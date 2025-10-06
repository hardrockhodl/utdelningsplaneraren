import { calculateTaxDeduction } from './taxTables';

export interface FormansbilInput {
  grossSalary: number;
  municipalTax: number;
  formansvarde: number;
  deductionModel: 'brutto' | 'netto';
  bruttoDeduction: number;
  nettoDeduction: number;
  privatLeasing: number;
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
    effectiveFormansvarde = Math.max(0, formansvarde - nettoDeduction);
    taxableForman = effectiveFormansvarde;
    privatePayment = Math.min(nettoDeduction, formansvarde);
  }

  // Calculate tax on adjusted gross + taxable förmån
  const totalTaxableIncome = adjustedGrossSalary + taxableForman;
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

  return {
    netSalaryWithoutCar,
    taxWithoutCar,
    netSalaryWithCar,
    taxWithCar,
    effectiveFormansvarde,
    monthlyDifference,
    comparedToPrivateLeasing,
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
