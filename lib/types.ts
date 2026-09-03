import type { Pennies } from "./money";

export interface TransitionDetails {
  employmentEndDate: string;
  payoutDate: string;
  netPayout: Pennies;
  householdIncomeContinues: boolean;
  expectedNextIncomeDate: string;
}

export interface Position {
  existingCash: Pennies;
  essentialMonthly: Pennies;
  otherMonthlyIncome: Pennies;
  creditBalance: Pennies;
  /** Amount the user has ALREADY DECIDED to repay. The tool never suggests repaying anything. */
  plannedRepayment: Pennies;
  knownUpcomingCosts: Pennies;
}

export interface Allocation {
  id: string;
  label: string;
  amount: Pennies;
}

export interface PlanChoices {
  /** Months of essential spending the USER chose to protect. Never suggested by the tool. */
  reserveMonths: number;
  allocations: Allocation[];
}

export interface AppState {
  step: 1 | 2 | 3 | 4 | 5;
  transition: TransitionDetails;
  position: Position;
  plan: PlanChoices;
}
