import { calculateTaxDeduction } from './taxTables';

export interface FormansbilInput {
  grossSalary: number;
  municipalTax: number;
  formansvarde: number;
  deductionModel: 'brutto' | 'netto';
  bruttoDeduction: number;
  nettoDeduction: number;
  privatLeasing: number;
  businessLeasing: number;
  employerContribution: number;
}

export interface FormansbilResult {
  // Without car
  netSalaryWithoutCar: number;
  taxWithoutCar: number;

  // With car
  netSalaryWithCar: number;
  taxWithCar: number;
  effectiveFormansvarde: number;

  // Comparison
  monthlyDifference: number;
  comparedToPrivateLeasing: number;
  comparedToBusinessLeasing: number;

  // Employer costs
  employerCostForman: number;
  employerCostTotal: number;

  // Details
  adjustedGrossSalary: number;
  taxableForman: number;
  privatePayment: number;
}

export function calculateFormansbil(
  input: FormansbilInput,
  taxTable: any[],
  taxColumn: number
): FormansbilResult {
  const {
    grossSalary,
    formansvarde,
    deductionModel,
    bruttoDeduction,
    nettoDeduction,
    privatLeasing,
    businessLeasing,
    employerContribution
  } = input;

  // Scenario 1: Without car
  const taxWithoutCar = calculateTaxDeduction(grossSalary, taxTable, taxColumn);
  const netSalaryWithoutCar = grossSalary - taxWithoutCar;

  let adjustedGrossSalary = grossSalary;
  let effectiveFormansvarde = formansvarde;
  let privatePayment = 0;
  let taxableForman = formansvarde;

  // Scenario 2: With car (depends on deduction model)
  if (deductionModel === 'brutto') {
    // Bruttolöneavdrag: Reduce gross salary, förmån remains taxable
    adjustedGrossSalary = Math.max(0, grossSalary - bruttoDeduction);
    taxableForman = formansvarde;
    effectiveFormansvarde = formansvarde;

  } else {
    // Nettolöneavdrag: Gross salary unchanged, reduce förmån by netto payment
    adjustedGrossSalary = grossSalary;
    effectiveFormansvarde = Math.max(0, formansvarde - Math.max(0, nettoDeduction));
    taxableForman = effectiveFormansvarde;
    privatePayment = Math.min(Math.max(0, nettoDeduction), formansvarde);
  }

  // Calculate tax on adjusted gross + taxable förmån
  const totalTaxableIncome = Math.max(0, adjustedGrossSalary + taxableForman);
  const taxWithCar = calculateTaxDeduction(totalTaxableIncome, taxTable, taxColumn);

  // Net salary with car
  let netSalaryWithCar = adjustedGrossSalary - taxWithCar;

  // Subtract private payment if nettolöneavdrag
  if (deductionModel === 'netto') {
    netSalaryWithCar -= privatePayment;
  }

  // Employer costs
  const employerCostForman = effectiveFormansvarde * (employerContribution / 100);
  const employerCostTotal = adjustedGrossSalary * (employerContribution / 100) + employerCostForman;

  // Comparison
  const monthlyDifference = netSalaryWithCar - netSalaryWithoutCar;
  const comparedToPrivateLeasing = privatLeasing > 0
    ? monthlyDifference + privatLeasing
    : 0;
  const comparedToBusinessLeasing = businessLeasing > 0
    ? monthlyDifference + businessLeasing
    : 0;

  return {
    netSalaryWithoutCar,
    taxWithoutCar,
    netSalaryWithCar,
    taxWithCar,
    effectiveFormansvarde,
    monthlyDifference,
    comparedToPrivateLeasing,
    comparedToBusinessLeasing,
    employerCostForman,
    employerCostTotal,
    adjustedGrossSalary,
    taxableForman,
    privatePayment
  };
}

// Helper to recommend best deduction model
export function getBestDeductionModel(
  input: FormansbilInput,
  taxTable: any[],
  taxColumn: number
): 'brutto' | 'netto' {
  const bruttoResult = calculateFormansbil(
    { ...input, deductionModel: 'brutto' },
    taxTable,
    taxColumn
  );

  const nettoResult = calculateFormansbil(
    { ...input, deductionModel: 'netto' },
    taxTable,
    taxColumn
  );

  // Better model is the one with higher net salary
  return bruttoResult.netSalaryWithCar > nettoResult.netSalaryWithCar
    ? 'brutto'
    : 'netto';
}

// Calculate monthly payment for a car loan
export function calculateCarLoanPayment(
  principal: number,
  annualInterestRate: number,
  termInMonths: number = 60
): number {
  if (principal <= 0) return 0;
  if (annualInterestRate === 0) return principal / termInMonths;

  const monthlyRate = annualInterestRate / 100 / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) /
                  (Math.pow(1 + monthlyRate, termInMonths) - 1);

  return payment;
}

export interface ScenarioComparison {
  scenario: string;
  monthlyCost: number | null;
  netSalaryImpact: number;
  description: string;
}

// Calculate all 4 scenarios for comparison
export function calculateAllScenarios(
  input: FormansbilInput,
  taxTable: any[],
  taxColumn: number,
  nybilspris: number,
  fordonsskatt: number
): ScenarioComparison[] {
  const netSalaryWithoutCar = input.grossSalary - calculateTaxDeduction(input.grossSalary, taxTable, taxColumn);

  // Scenario 1: Nettolöneavdrag
  const nettoResult = calculateFormansbil(
    { ...input, deductionModel: 'netto' },
    taxTable,
    taxColumn
  );

  // Scenario 2: Bruttolöneavdrag
  const bruttoResult = calculateFormansbil(
    { ...input, deductionModel: 'brutto' },
    taxTable,
    taxColumn
  );

  // Scenario 3: Privat leasing
  const privatLeasingCost = input.privatLeasing > 0 ? input.privatLeasing : null;
  const privatLeasingImpact = input.privatLeasing > 0 ? -input.privatLeasing : 0;

  // Scenario 4: Privat billån (4.95% interest, 60 months)
  const loanPayment = calculateCarLoanPayment(nybilspris, 4.95, 60);
  const monthlyVehicleTax = fordonsskatt / 12;
  const privatLoanCost = loanPayment + monthlyVehicleTax;
  const privatLoanImpact = -(loanPayment + monthlyVehicleTax);

  return [
    {
      scenario: 'Nettolöneavdrag',
      monthlyCost: Math.abs(nettoResult.monthlyDifference),
      netSalaryImpact: nettoResult.netSalaryWithCar,
      description: 'Förmånsbil med privat betalning efter skatt'
    },
    {
      scenario: 'Bruttolöneavdrag',
      monthlyCost: Math.abs(bruttoResult.monthlyDifference),
      netSalaryImpact: bruttoResult.netSalaryWithCar,
      description: 'Förmånsbil med reducerad bruttolön'
    },
    {
      scenario: 'Privat leasing',
      monthlyCost: privatLeasingCost,
      netSalaryImpact: netSalaryWithoutCar + privatLeasingImpact,
      description: 'Egen leasing utan förmån'
    },
    {
      scenario: 'Privat billån',
      monthlyCost: privatLoanCost,
      netSalaryImpact: netSalaryWithoutCar + privatLoanImpact,
      description: 'Billån 4.95% ränta, 60 månader'
    }
  ];
}
