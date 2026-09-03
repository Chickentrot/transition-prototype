/**
 * All financial arithmetic for the prototype lives here, as pure functions over
 * integer pennies. No arithmetic may be performed in UI text. These functions
 * model consequences of the user's own decisions; they never make recommendations.
 */
import type { Pennies } from "./money";
import type { Allocation, Position } from "./types";

export function totalAvailable(existingCash: Pennies, netPayout: Pennies): Pennies {
  return existingCash + netPayout;
}

export function cashAfterRepayments(total: Pennies, plannedRepayment: Pennies): Pennies {
  return total - plannedRepayment;
}

/** May be negative when planned obligations exceed available cash. */
export function cashAfterObligations(
  total: Pennies,
  plannedRepayment: Pennies,
  knownUpcomingCosts: Pennies,
): Pennies {
  return total - plannedRepayment - knownUpcomingCosts;
}

/** Value of the reserve the user chose (months may be fractional via custom input). */
export function reserveTarget(essentialMonthly: Pennies, reserveMonths: number): Pennies {
  return Math.round(essentialMonthly * reserveMonths);
}

export function allocationsTotal(allocations: Allocation[]): Pennies {
  return allocations.reduce((sum, a) => sum + a.amount, 0);
}

/** May be negative: the user has allocated more than is available. */
export function unallocated(
  afterObligations: Pennies,
  reserve: Pennies,
  allocations: Pennies,
): Pennies {
  return afterObligations - reserve - allocations;
}

/**
 * Essential-expense runway: months of essential spending the cash covers,
 * ignoring other income. Null when essentials are zero (runway undefined).
 */
export function runwayMonths(cash: Pennies, essentialMonthly: Pennies): number | null {
  if (essentialMonthly <= 0) return null;
  if (cash <= 0) return 0;
  return cash / essentialMonthly;
}

/** How many months of essentials a given amount represents. */
export function monthsOfEssentials(amount: Pennies, essentialMonthly: Pennies): number | null {
  if (essentialMonthly <= 0) return null;
  return Math.max(0, amount) / essentialMonthly;
}

export interface PlanSummary {
  totalAvailable: Pennies;
  afterRepayments: Pennies;
  afterObligations: Pennies;
  reserve: Pennies;
  allocations: Pennies;
  unallocated: Pennies;
  runway: number | null;
  overAllocated: boolean;
}

export function summarise(
  position: Position,
  netPayout: Pennies,
  reserveMonths: number,
  allocations: Allocation[],
): PlanSummary {
  const total = totalAvailable(position.existingCash, netPayout);
  const afterRepay = cashAfterRepayments(total, position.plannedRepayment);
  const afterObl = cashAfterObligations(total, position.plannedRepayment, position.knownUpcomingCosts);
  const reserve = reserveTarget(position.essentialMonthly, reserveMonths);
  const allocs = allocationsTotal(allocations);
  const unalloc = unallocated(afterObl, reserve, allocs);
  return {
    totalAvailable: total,
    afterRepayments: afterRepay,
    afterObligations: afterObl,
    reserve,
    allocations: allocs,
    unallocated: unalloc,
    runway: runwayMonths(afterObl, position.essentialMonthly),
    overAllocated: unalloc < 0,
  };
}

export interface SpendImpact {
  amount: Pennies;
  cashBefore: Pennies;
  cashAfter: Pennies;
  unallocatedBefore: Pennies;
  unallocatedAfter: Pennies;
  reserveBefore: Pennies;
  reserveAfter: Pennies;
  reserveUsed: Pennies;
  reserveMonthsBefore: number | null;
  reserveMonthsAfter: number | null;
  runwayBefore: number | null;
  runwayAfter: number | null;
  usesReserve: boolean;
  /** Spend exceeds unallocated + reserve: it would have to come from named allocations or doesn't exist. */
  exceedsProtected: boolean;
  /** Cash after the spend would be negative. */
  insufficientCash: boolean;
}

/**
 * Models a hypothetical spend. Draws from unallocated money first (negative
 * unallocated counts as zero available), then from the user-selected reserve.
 * Named allocations are committed plans and are never silently raided; anything
 * beyond the reserve is flagged instead.
 */
export function spendImpact(
  summary: PlanSummary,
  essentialMonthly: Pennies,
  amount: Pennies,
): SpendImpact {
  const spend = Math.max(0, amount);
  const unallocatedAvailable = Math.max(0, summary.unallocated);
  const fromUnallocated = Math.min(spend, unallocatedAvailable);
  const afterUnallocated = spend - fromUnallocated;
  const reserveUsed = Math.min(afterUnallocated, Math.max(0, summary.reserve));
  const beyond = afterUnallocated - reserveUsed;

  const cashAfter = summary.afterObligations - spend;
  const reserveAfter = summary.reserve - reserveUsed;

  return {
    amount: spend,
    cashBefore: summary.afterObligations,
    cashAfter,
    unallocatedBefore: summary.unallocated,
    unallocatedAfter: summary.unallocated - fromUnallocated,
    reserveBefore: summary.reserve,
    reserveAfter,
    reserveUsed,
    reserveMonthsBefore: monthsOfEssentials(summary.reserve, essentialMonthly),
    reserveMonthsAfter: monthsOfEssentials(reserveAfter, essentialMonthly),
    runwayBefore: runwayMonths(summary.afterObligations, essentialMonthly),
    runwayAfter: runwayMonths(cashAfter, essentialMonthly),
    usesReserve: reserveUsed > 0,
    exceedsProtected: beyond > 0,
    insufficientCash: cashAfter < 0,
  };
}
