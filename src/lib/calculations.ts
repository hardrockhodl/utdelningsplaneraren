import { GlobalSettings, YearInput, YearCalculation } from '../types';

/**
 * Calculate financial data for a single year
 * Beräknar ekonomiska data för ett enskilt år
 */
export function calculateYear(
  input: YearInput,
  settings: GlobalSettings,
  previousYear: YearCalculation | null,
  yearNumber: number
): YearCalculation {
  // Gross salary for the year / Bruttolön för året
  const grossSalaryYearly = Math.max(0, (input.grossSalaryMonthly ?? 0) * 12);

  // Effective employer contribution rate (reduced by 10% if regional support applies)
  // Effektiv arbetsgivaravgift (reducerad med 10 procentenheter vid regionalt stöd)
  const baseEmployerContribution = Number(settings.employerContribution ?? 0);
  const effectiveEmployerContribution = settings.regionalSupport
    ? Math.max(0, baseEmployerContribution - 10)
    : baseEmployerContribution;

  // Calculate employer contributions / Beräkna arbetsgivaravgifter
  let employerContributionYearly = grossSalaryYearly * (effectiveEmployerContribution / 100);

  // Apply regional support deduction if applicable
  // Tillämpa regionalt stödavdrag (10% av månadslön, max 7 100 kr/mån) om tillämpligt
  if (settings.regionalSupport) {
    const monthlyGross = Math.max(0, input.grossSalaryMonthly ?? 0);
    const monthlyDeduction = Math.min(monthlyGross * 0.10, 7100);
    employerContributionYearly = Math.max(0, employerContributionYearly - monthlyDeduction * 12);
  }

  // ----- Tax & net salary / Skatt & nettolön -----
  // Allow passing a total tax % directly; else sum municipal + region + optional church
  const municipalTax = Number(settings.municipalTax ?? 0);
  const countyTax = Number((settings as any).countyTax ?? 0);
  const churchTax = Number((settings as any).churchTax ?? 0);
  const totalTaxRateFromParts = municipalTax + countyTax + (settings?.churchMember ? churchTax : 0);

  const effectiveTaxRatePct = Number(
    (settings as any).totalTaxRate ?? totalTaxRateFromParts
  );

  const taxAmount = grossSalaryYearly * (Math.max(0, effectiveTaxRatePct) / 100);
  const netSalaryYearly = Math.max(0, grossSalaryYearly - taxAmount);

  // Annual costs / Årliga kostnader
  const costsYearly = Math.max(0, (input.otherCostsMonthly ?? 0) * 12);

  // Annual billing / Årlig fakturering
  const billedYearly = Math.max(0, (input.hourlyRate ?? 0) * (input.hoursPerMonth ?? 0) * 12);

  // Calculate surplus before and after buffer / Beräkna överskott före och efter buffert
  const surplusBeforeBuffer = billedYearly - grossSalaryYearly - employerContributionYearly - costsYearly;
  const bufferYearly = Math.max(0, surplusBeforeBuffer * (Math.max(0, input.bufferPercent ?? 0) / 100));
  const surplusYearly = surplusBeforeBuffer - bufferYearly;

  // Corporate tax and net profit / Bolagsskatt och årets resultat
  const corporateTaxRate = Math.max(0, Number(settings.corporateTax ?? 0));
  const corporateTaxAmount = Math.max(0, surplusYearly * (corporateTaxRate / 100));
  const netProfitYearly = surplusYearly - corporateTaxAmount;

  // Opening equity (from previous year or initial value)
  // Ingående fritt eget kapital (från föregående år eller initialt värde)
  const openingEquity = yearNumber === 1
    ? Math.max(0, Number(settings.openingFreeEquity ?? 0))
    : Math.max(0, Number(previousYear?.closingEquity ?? 0));

  // Maximum dividend based on equity / Maximal utdelning baserat på eget kapital
  const maxDividendByEquity = Math.max(0, openingEquity + netProfitYearly);

  // Main rule should be based on cash salaries (excluding employer contributions)
  // Huvudregeln ska utgå från kontanta löner (ej inkl. AG-avgifter)
  const totalCashSalariesYearly = Math.max(
    0,
    Number(settings.totalCashSalariesYearly ?? grossSalaryYearly)
  );

  // Salary requirement for main rule / Löneuttagskravet för huvudregeln
  const ibb = Math.max(0, Number(settings.ibb ?? 0));
  const wageFloor = Math.max(6 * ibb + 0.05 * totalCashSalariesYearly, 9.6 * ibb);
  const eligibleForMainRule = grossSalaryYearly >= wageFloor;

  // Simplified rule allowance (2.75 × IBB) / Förenklingsregelns utrymme (2,75 × IBB)
  const simplifiedRuleAllowance = 2.75 * ibb;

  // Main rule allowance (50% of salaries + 10.96% of share acquisition value, 2025)
  // Huvudregelns utrymme (50% av löner + 10,96% av aktieförvärvet, 2025)
  const mainRuleAllowance = eligibleForMainRule
    ? (totalCashSalariesYearly * 0.5) + (Math.max(0, Number(settings.shareAcquisitionValue ?? 0)) * 0.1096)
    : 0;

  // Use the higher of simplified or main rule / Använd det högsta av förenklings- eller huvudregeln
  const currentYearAllowance = Math.max(simplifiedRuleAllowance, mainRuleAllowance);

  // Carried forward allowance from previous years / Överfört utrymme från tidigare år
  const carriedForwardAllowance = Math.max(0, Number(previousYear?.savedDividendAllowance ?? 0)) * 1.0496;

  // Total dividend allowance (current year + carried forward)
  // Totalt utdelningsutrymme (innevarande år + överfört)
  const dividendAllowanceSEK = currentYearAllowance + carriedForwardAllowance;

  // Dividend allowance as percentage of available equity
  // Utdelningsutrymme som procent av tillgängligt kapital
  const dividendAllowancePct = maxDividendByEquity > 0
    ? (dividendAllowanceSEK / maxDividendByEquity) * 100
    : 0;

  // Gross dividend (user-selected percentage) / Bruttoutdelning (användarens procentval)
  const grossDividend = Math.max(0, maxDividendByEquity * (Math.max(0, input.dividendPercent ?? 0) / 100));

  // Split dividend into low-tax and high-tax portions
  // Dela upp utdelning i låg- och högbeskattad del
  const lowTaxDividend = Math.min(grossDividend, dividendAllowanceSEK);
  const highTaxDividend = Math.max(0, grossDividend - dividendAllowanceSEK);

  // Net dividend after tax (20% tax on low-tax, marginal rate on high-tax)
  // Nettoutdelning efter skatt (20% skatt på lågdel, marginalskatt på högdel)
  const marginalTaxRate = Math.max(0, Number(settings.marginalTaxRate ?? 0));
  const lowTaxNet = lowTaxDividend * 0.8;
  const highTaxNet = highTaxDividend * (1 - marginalTaxRate / 100);

  const netDividend = Math.max(0, lowTaxNet + highTaxNet);

  // Total net income per month (salary + dividend) / Total nettoinkomst per månad (lön + utdelning)
  const totalNetMonthly = (netSalaryYearly + netDividend) / 12;

  // Equivalent gross salary that would give the same net income
  // Motsvarande bruttolön som skulle ge samma nettoinkomst
  const safeTaxFactor = 1 - Math.min(0.9999, Math.max(0, effectiveTaxRatePct) / 100);
  const equivalentGrossSalaryMonthly = safeTaxFactor > 0 ? totalNetMonthly / safeTaxFactor : 0;

  // Closing equity (remaining after dividend) / Utgående fritt eget kapital (kvar efter utdelning)
  const closingEquity = Math.max(0, maxDividendByEquity - grossDividend);

  // Saved dividend allowance to carry forward / Sparat utdelningsutrymme att föra vidare
  const usedAllowance = Math.min(grossDividend, dividendAllowanceSEK);
  const savedDividendAllowance = Math.max(0, dividendAllowanceSEK - usedAllowance);

  return {
    ...input,
    grossSalaryYearly,
    netSalaryYearly,
    employerContributionYearly,
    costsYearly,
    bufferYearly,
    billedYearly,
    surplusYearly,
    netProfitYearly,
    openingEquity,
    maxDividendByEquity,
    dividendAllowanceSEK,
    dividendAllowancePct,
    grossDividend,
    netDividend,
    totalNetMonthly,
    equivalentGrossSalaryMonthly,
    closingEquity,
    savedDividendAllowance,
  };
}

/**
 * Calculate all years sequentially, passing equity forward
 * Beräkna alla år sekventiellt, för vidare eget kapital
 */
export function calculateAllYears(
  yearInputs: YearInput[],
  settings: GlobalSettings
): YearCalculation[] {
  const results: YearCalculation[] = [];
  for (let i = 0; i < yearInputs.length; i++) {
    const previousYear = i > 0 ? results[i - 1] : null;
    const calculation = calculateYear(yearInputs[i], settings, previousYear, i + 1);
    results.push(calculation);
  }
  return results;
}

/**
 * Calculate hourly rate based on desired net salary and business parameters
 * Beräkna timpris baserat på önskad nettolön och affärsparametrar
 */
export interface HourlyRateInput {
  desiredNetSalary: number;
  municipalTax: number;          // can be total tax if you pass totalTaxRate here
  employerContribution: number;
  regionalSupport?: boolean;
  businessCosts: number;
  billableHours: number;
  bufferPercentage: number;
  savingsGoal: number;
}

export interface HourlyRateResult {
  grossSalary: number;
  employerContributions: number;
  totalMonthlyCost: number;
  hourlyRate: number;
  hourlyRateWithVAT: number;
  monthlyRevenue: number;
  annualGrossSalary: number;
  annualCost: number;
  annualRevenue: number;
}

export function calculateHourlyRateFromNetSalary(input: HourlyRateInput): HourlyRateResult {
  const totalTaxPct = Math.max(0, Number(input.municipalTax ?? 0));
  const safeFactor = 1 - Math.min(0.9999, totalTaxPct / 100);
  const grossSalary = safeFactor > 0 ? input.desiredNetSalary / safeFactor : 0;

  const baseAg = Math.max(0, Number(input.employerContribution ?? 0));
  const effectiveEmployerContribution = input.regionalSupport ? Math.max(0, baseAg - 10) : baseAg;

  let employerContributions = grossSalary * (effectiveEmployerContribution / 100);

  if (input.regionalSupport) {
    const monthlyDeduction = Math.min(grossSalary * 0.10, 7100);
    employerContributions = Math.max(0, employerContributions - monthlyDeduction);
  }

  const baseCost = grossSalary
    + employerContributions
    + Math.max(0, Number(input.businessCosts ?? 0))
    + Math.max(0, Number(input.savingsGoal ?? 0));

  const totalMonthlyCost = baseCost * (1 + Math.max(0, Number(input.bufferPercentage ?? 0)) / 100);

  const hours = Math.max(1, Number(input.billableHours ?? 1));
  const hourlyRate = totalMonthlyCost / hours;
  const hourlyRateWithVAT = hourlyRate * 1.25;
  const monthlyRevenue = hourlyRate * hours;

  return {
    grossSalary,
    employerContributions,
    totalMonthlyCost,
    hourlyRate,
    hourlyRateWithVAT,
    monthlyRevenue,
    annualGrossSalary: grossSalary * 12,
    annualCost: totalMonthlyCost * 12,
    annualRevenue: monthlyRevenue * 12,
  };
}

/**
 * Format number according to Swedish locale
 * Formatera tal enligt svensk standard
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('sv-SE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Export calculation results to CSV format
 * Exportera beräkningsresultat till CSV-format
 */
export function exportToCSVTransposed(_settings: GlobalSettings, years: YearCalculation[]) {
  const sep = ';';
  const pick = (y: any, ...keys: string[]) => {
    for (const k of keys) {
      const v = y?.[k];
      if (v !== undefined && v !== null) return v;
    }
    return '';
  };
  const mul = (v: any, n: number) => (typeof v === 'number' ? v * n : '');

  const header = ['År', ...years.map((_, i) => String(i + 1))];

  const rows = [
    ['Timpris (kr)', ...years.map(y => pick(y, 'timpris', 'hourlyRate'))],
    ['Timmar/mån', ...years.map(y => pick(y, 'timmarPerManad', 'hoursPerMonth'))],
    ['Bruttolön (mån)', ...years.map(y => pick(y, 'bruttolonManad', 'grossSalaryMonth'))],
    ['Övr. kostn (mån)', ...years.map(y => pick(y, 'ovrigaKostnaderManad', 'otherCostsMonth'))],
    ['Buffert %', ...years.map(y => pick(y, 'buffertPct', 'bufferPct'))],

    ['Fakturerat (år)', ...years.map(y => pick(y, 'faktureratAr', 'invoicedYear'))],
    // årsbrutto: använd direkt fält om finns, annars 12 × månadsbrutto
    ['Bruttolön (år)', ...years.map(y => {
      const ar = pick(y, 'bruttolonAr', 'grossSalaryYear');
      return ar !== '' ? ar : mul(pick(y, 'bruttolonManad', 'grossSalaryMonth'), 12);
    })],
    ['Nettolön (år)', ...years.map(y => pick(y, 'nettolonAr', 'netSalaryYear'))],
    ['Arbetsgivaravgift (år)', ...years.map(y => pick(y, 'arbetsgivaravgiftAr', 'employerContributionYear'))],
    ['Kostnader (år)', ...years.map(y => pick(y, 'kostnaderAr', 'costsYear'))],
    ['Buffert (år)', ...years.map(y => pick(y, 'buffertAr', 'bufferYear'))],
    ['Överskott (år)', ...years.map(y => pick(y, 'overskottAr', 'surplusYear'))],

    ['Årets resultat', ...years.map(y => pick(y, 'aretsResultat', 'resultYear'))],
    ['Ing. fritt EK', ...years.map(y => pick(y, 'ingaendeEK', 'equityIn'))],
    ['Max utd. EK', ...years.map(y => pick(y, 'maxUtdelningEK', 'maxDividendEquity'))],
    ['Utdeln. %', ...years.map(y => pick(y, 'utdelningPct', 'dividendPct'))],
    ['Utd. brutto', ...years.map(y => pick(y, 'utdelningBrutto', 'dividendGross'))],
    ['Utd. netto', ...years.map(y => pick(y, 'utdelningNetto', 'dividendNet'))],
    ['Totalt netto (mån)', ...years.map(y => pick(y, 'totaltNettoManad', 'totalNetPerMonth'))],
    ['Utg. fritt EK', ...years.map(y => pick(y, 'utgaendeEK', 'equityOut'))],
    ['Sparat utd. utrymme', ...years.map(y => pick(y, 'sparatUtdelningsutrymme', 'savedAllowance'))],
  ];

  return [header.join(sep), ...rows.map(r => r.join(sep))].join('\n');
}