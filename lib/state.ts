import type { AppState } from "./types";

export const STORAGE_KEY = "after-redundancy-v1";

export const emptyState: AppState = {
  step: 1,
  transition: {
    employmentEndDate: "",
    payoutDate: "",
    netPayout: 0,
    householdIncomeContinues: false,
    expectedNextIncomeDate: "",
  },
  position: {
    existingCash: 0,
    essentialMonthly: 0,
    otherMonthlyIncome: 0,
    creditBalance: 0,
    plannedRepayment: 0,
    knownUpcomingCosts: 0,
  },
  plan: {
    reserveMonths: 6,
    allocations: [],
  },
};

/** Completely fictional demo figures (the worked example from the spec). */
export const demoState: AppState = {
  step: 1,
  transition: {
    employmentEndDate: "2026-09-30",
    payoutDate: "2026-10-14",
    netPayout: 30000_00,
    householdIncomeContinues: true,
    expectedNextIncomeDate: "",
  },
  position: {
    existingCash: 4200_00,
    essentialMonthly: 2100_00,
    otherMonthlyIncome: 1000_00,
    creditBalance: 7300_00,
    plannedRepayment: 7300_00,
    knownUpcomingCosts: 1200_00,
  },
  plan: {
    reserveMonths: 6,
    allocations: [
      { id: "demo-car", label: "Car replacement", amount: 2000_00 },
      { id: "demo-training", label: "Training", amount: 1000_00 },
      { id: "demo-holiday", label: "Holiday", amount: 1000_00 },
    ],
  },
};

export function loadState(): AppState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || typeof parsed !== "object" || !parsed.position || !parsed.plan) return null;
    return { ...structuredClone(emptyState), ...parsed };
  } catch {
    return null;
  }
}

export function saveState(state: AppState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode etc.) — prototype carries on in memory.
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
