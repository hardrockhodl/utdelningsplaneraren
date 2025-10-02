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
  const grossSalaryYearly = input.grossSalaryMonthly * 12;

  // Effective employer contribution rate (reduced by 10% if regional support applies)
  // Effektiv arbetsgivaravgift (reducerad med 10% vid regionalt stöd)
  const effectiveEmployerContribution = settings.regionalSupport
    ? settings.employerContribution - 10
    : settings.employerContribution;

  // Calculate employer contributions / Beräkna arbetsgivaravgifter
  let employerContributionYearly = grossSalaryYearly * (effectiveEmployerContribution / 100);

  // Apply regional support deduction if applicable
  // Tillämpa regionalt stödavdrag om tillämpligt
  if (settings.regionalSupport) {
    const monthlyDeduction = Math.min((grossSalaryYearly / 12) * 0.10, 7100);
    employerContributionYearly = Math.max(0, employerContributionYearly - monthlyDeduction * 12);
  }

  // Calculate income tax and net salary / Beräkna inkomstskatt och nettolön
  const taxAmount = grossSalaryYearly * (settings.municipalTax / 100);
  const netSalaryYearly = grossSalaryYearly - taxAmount;

  // Annual costs / Årliga kostnader
  const costsYearly = input.otherCostsMonthly * 12;

  // Annual billing / Årlig fakturering
  const billedYearly = input.hourlyRate * input.hoursPerMonth * 12;

  // Calculate surplus before and after buffer / Beräkna överskott före och efter buffert
  const surplusBeforeBuffer = billedYearly - grossSalaryYearly - employerContributionYearly - costsYearly;
  const bufferYearly = surplusBeforeBuffer * (input.bufferPercent / 100);
  const surplusYearly = surplusBeforeBuffer - bufferYearly;

  // Corporate tax and net profit / Bolagsskatt och årets resultat
  const corporateTaxAmount = surplusYearly * (settings.corporateTax / 100);
  const netProfitYearly = surplusYearly - corporateTaxAmount;

  // Opening equity (from previous year or initial value)
  // Ingående fritt eget kapital (från föregående år eller initialt värde)
  const openingEquity = yearNumber === 1
    ? settings.openingFreeEquity
    : (previousYear?.closingEquity || 0);

  // Maximum dividend based on equity / Maximal utdelning baserat på eget kapital
  const maxDividendByEquity = openingEquity + netProfitYearly;

  // Main rule should be based on cash salaries (excluding employer contributions)
  // Huvudregeln ska utgå från kontanta löner (ej inkl. AG-avgifter)
  const totalCashSalariesYearly = settings.totalCashSalariesYearly ?? grossSalaryYearly;

  // Salary requirement for main rule / Löneuttagskravet för huvudregeln
  const wageFloor = Math.max(
    6 * settings.ibb + 0.05 * totalCashSalariesYearly,
    9.6 * settings.ibb
  );
  const eligibleForMainRule = grossSalaryYearly >= wageFloor;

  // Simplified rule allowance (2.75 × IBB) / Förenklingsregelns utrymme (2,75 × IBB)
  const simplifiedRuleAllowance = 2.75 * settings.ibb;

  // Main rule allowance (50% of salaries + 9% of share acquisition value)
  // Huvudregelns utrymme (50% av löner + 9% av aktieförvärvet)
  const mainRuleAllowance = eligibleForMainRule
    ? (totalCashSalariesYearly * 0.5) + (settings.shareAcquisitionValue * 0.1096)
    : 0;

  // Use the higher of simplified or main rule / Använd det högsta av förenklings- eller huvudregeln
  const currentYearAllowance = Math.max(simplifiedRuleAllowance, mainRuleAllowance);

  // Carried forward allowance from previous years / Överfört utrymme från tidigare år
  const carriedForwardAllowance = (previousYear?.savedDividendAllowance || 0) * 1.0496;

  // Total dividend allowance (current year + carried forward)
  // Totalt utdelningsutrymme (innevarande år + överfört)
  const dividendAllowanceSEK = currentYearAllowance + carriedForwardAllowance;

  // Dividend allowance as percentage of available equity
  // Utdelningsutrymme som procent av tillgängligt kapital
  const dividendAllowancePct = maxDividendByEquity > 0
    ? (dividendAllowanceSEK / maxDividendByEquity) * 100
    : 0;

  // Gross dividend (user-selected percentage) / Bruttoutdelning (användarens procentval)
  const grossDividend = maxDividendByEquity * (input.dividendPercent / 100);

  // Split dividend into low-tax and high-tax portions
  // Dela upp utdelning i låg- och högbeskattad del
  const lowTaxDividend = Math.min(grossDividend, dividendAllowanceSEK);
  const highTaxDividend = Math.max(0, grossDividend - dividendAllowanceSEK);

  // Net dividend after tax (20% tax on low-tax, marginal rate on high-tax)
  // Nettoutdelning efter skatt (20% skatt på lågdel, marginalskatt på högdel)
  const lowTaxNet = lowTaxDividend * 0.8;
  const highTaxNet = highTaxDividend * (1 - settings.marginalTaxRate / 100);

  const netDividend = lowTaxNet + highTaxNet;

  // Total net income per month (salary + dividend) / Total nettoinkomst per månad (lön + utdelning)
  const totalNetMonthly = (netSalaryYearly + netDividend) / 12;

  // Equivalent gross salary that would give the same net income
  // Motsvarande bruttolön som skulle ge samma nettoinkomst
  const equivalentGrossSalaryMonthly = totalNetMonthly / (1 - settings.municipalTax / 100);

  // Closing equity (remaining after dividend) / Utgående fritt eget kapital (kvar efter utdelning)
  const closingEquity = maxDividendByEquity - grossDividend;

  // Saved dividend allowance to carry forward / Sparat utdelningsutrymme att föra vidare
  const usedAllowance = Math.min(grossDividend, dividendAllowanceSEK);
  const savedDividendAllowance = dividendAllowanceSEK - usedAllowance;

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

  const header = ['År', ...years.map((_, i) => String(i + 1))];

  const rows = [
    ['Timpris (kr)', ...years.map(y => y.timpris)],
    ['Timmar/mån', ...years.map(y => y.timmarPerManad)],
    ['Bruttolön (mån)', ...years.map(y => y.bruttolonManad)],
    ['Övr. kostn (mån)', ...years.map(y => y.ovrigaKostnaderManad)],
    ['Buffert %', ...years.map(y => y.buffertPct)],
    ['Fakturerat (år)', ...years.map(y => y.faktureratAr)],
    ['Bruttolön (år)', ...years.map(y => y.bruttolonAr)],            // om inte finns: y.bruttolonManad*12
    ['Nettolön (år)', ...years.map(y => y.nettolonAr)],
    ['Arbetsgivaravgift (år)', ...years.map(y => y.arbetsgivaravgiftAr)],
    ['Kostnader (år)', ...years.map(y => y.kostnaderAr)],
    ['Buffert (år)', ...years.map(y => y.buffertAr)],
    ['Överskott (år)', ...years.map(y => y.overskottAr)],
    ['Årets resultat', ...years.map(y => y.aretsResultat)],
    ['Ing. fritt EK', ...years.map(y => y.ingaendeEK)],
    ['Max utd. EK', ...years.map(y => y.maxUtdelningEK)],
    ['Utdeln. %', ...years.map(y => y.utdelningPct)],
    ['Utd. brutto', ...years.map(y => y.utdelningBrutto)],
    ['Utd. netto', ...years.map(y => y.utdelningNetto)],
    ['Totalt netto (mån)', ...years.map(y => y.totaltNettoManad)],
    ['Utg. fritt EK', ...years.map(y => y.utgaendeEK)],
    ['Sparat utd. utrymme', ...years.map(y => y.sparatUtdelningsutrymme)],
  ];

  return [
    header.join(sep),
    ...rows.map(r => r.join(sep)),
  ].join('\n');
}