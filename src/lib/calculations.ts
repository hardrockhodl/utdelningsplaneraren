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
export function exportToCSV(settings: GlobalSettings, years: YearCalculation[]): string {
  const headers = [
    'År',
    'Timpris (kr)',
    'Timmar/mån',
    'Bruttolön (mån)',
    'Övr. kostn (mån)',
    'Buffert %',
    'Fakturerat (år)',
    'Bruttolön (år)',
    'Nettolön (år)',
    'Arbetsgivaravgift (år)',
    'Kostnader (år)',
    'Buffert (år)',
    'Överskott (år)',
    'Årets resultat',
    'Ing. fritt EK',
    'Max utd. EK',
    'Utdeln. %',
    'Utd. brutto',
    'Utd. netto',
    'Totalt netto (mån)',
    'Utg. fritt EK',
    'Sparat utd. utrymme'
  ];

  const rows = years.map((year, idx) => [
    idx + 1,
    year.hourlyRate,
    year.hoursPerMonth,
    year.grossSalaryMonthly,
    year.otherCostsMonthly,
    year.bufferPercent,
    year.billedYearly,
    year.grossSalaryYearly,
    year.netSalaryYearly,
    year.employerContributionYearly,
    year.costsYearly,
    year.bufferYearly,
    year.surplusYearly,
    year.netProfitYearly,
    year.openingEquity,
    year.maxDividendByEquity,
    year.dividendPercent,
    year.grossDividend,
    year.netDividend,
    year.totalNetMonthly,
    year.closingEquity,
    year.savedDividendAllowance
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}