export interface GlobalSettings {
  kommun: string | null;
  municipalTax: number;
  churchMember: boolean;
  churchTax: number;
  marginalTaxRate: number;
  employerContribution: number;
  regionalSupport: boolean;
  ibb: number;
  corporateTax: number;
  shareAcquisitionValue: number;
  openingFreeEquity: number;
  numberOfYears: number;
  totalCashSalariesYearly?: number;
}

export interface YearInput {
  hourlyRate: number;
  hoursPerMonth: number;
  grossSalaryMonthly: number;
  otherCostsMonthly: number;
  bufferPercent: number;
  dividendPercent: number;
}

export interface YearCalculation extends YearInput {
  grossSalaryYearly: number;
  netSalaryYearly: number;
  employerContributionYearly: number;
  costsYearly: number;
  bufferYearly: number;
  billedYearly: number;
  surplusYearly: number;
  netProfitYearly: number;
  openingEquity: number;
  maxDividendByEquity: number;
  dividendAllowanceSEK: number;
  dividendAllowancePct: number;
  grossDividend: number;
  netDividend: number;
  totalNetMonthly: number;
  equivalentGrossSalaryMonthly: number;
  closingEquity: number;
  savedDividendAllowance: number;
}

export interface Scenario {
  id?: string;
  name: string;
  settings: GlobalSettings;
  years_data: YearCalculation[];
  created_at?: string;
  updated_at?: string;
}

export interface Kommune {
  KommunId: string;
  Kommun: string;
  Kommnskatt: string;
  Landstingsskatt: string;
  Kyrkoskatt: string | null;
  Begravningsavgift: string;
  Arbetsgivaravgift: string;
  Slutskatt: string;
  År: string;
}
