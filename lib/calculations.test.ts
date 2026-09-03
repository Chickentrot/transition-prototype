import { describe, expect, it } from "vitest";
import {
  allocationsTotal,
  cashAfterObligations,
  monthsOfEssentials,
  reserveTarget,
  runwayMonths,
  spendImpact,
  summarise,
  totalAvailable,
  unallocated,
} from "./calculations";
import { gbp, toPennies } from "./money";
import type { Position } from "./types";

// The spec's worked example, in pennies.
const position: Position = {
  existingCash: 4200_00,
  essentialMonthly: 2100_00,
  otherMonthlyIncome: 1000_00,
  creditBalance: 7300_00,
  plannedRepayment: 7300_00,
  knownUpcomingCosts: 1200_00,
};
const netPayout = 30000_00;

describe("available cash", () => {
  it("totals existing cash and payout", () => {
    expect(totalAvailable(position.existingCash, netPayout)).toBe(34200_00);
  });

  it("subtracts user-planned repayments and known costs", () => {
    expect(cashAfterObligations(34200_00, 7300_00, 1200_00)).toBe(25700_00);
  });

  it("goes negative when obligations exceed cash", () => {
    expect(cashAfterObligations(5000_00, 7300_00, 1200_00)).toBe(-3500_00);
  });
});

describe("user-selected reserve", () => {
  it("values 6 months of £2,100 essentials at £12,600", () => {
    expect(reserveTarget(position.essentialMonthly, 6)).toBe(12600_00);
  });

  it("handles custom fractional months without penny drift", () => {
    expect(reserveTarget(2100_00, 4.5)).toBe(9450_00);
  });
});

describe("unallocated cash", () => {
  it("matches the spec example before pots are created", () => {
    expect(unallocated(25700_00, 12600_00, 0)).toBe(13100_00);
  });

  it("subtracts user-created allocations", () => {
    const allocations = [
      { id: "a", label: "Car replacement", amount: 2000_00 },
      { id: "b", label: "Training", amount: 1000_00 },
      { id: "c", label: "Holiday", amount: 1000_00 },
    ];
    expect(allocationsTotal(allocations)).toBe(4000_00);
    expect(unallocated(25700_00, 12600_00, 4000_00)).toBe(9100_00);
  });

  it("goes negative when the user allocates more than exists", () => {
    const summary = summarise(position, netPayout, 12, [
      { id: "a", label: "Everything", amount: 5000_00 },
    ]);
    expect(summary.reserve).toBe(25200_00);
    expect(summary.unallocated).toBe(-4500_00);
    expect(summary.overAllocated).toBe(true);
  });
});

describe("runway", () => {
  it("computes essential-expense runway to the spec example", () => {
    const runway = runwayMonths(25700_00, 2100_00);
    expect(runway).not.toBeNull();
    expect(runway!).toBeCloseTo(12.238, 3);
  });

  it("is null when essentials are zero and 0 when cash is gone", () => {
    expect(runwayMonths(25700_00, 0)).toBeNull();
    expect(runwayMonths(-500_00, 2100_00)).toBe(0);
  });
});

describe("hypothetical-spend impact", () => {
  const summary = summarise(position, netPayout, 6, []);

  it("draws from unallocated money without touching the reserve", () => {
    const impact = spendImpact(summary, position.essentialMonthly, 2000_00);
    expect(impact.cashBefore).toBe(25700_00);
    expect(impact.cashAfter).toBe(23700_00);
    expect(impact.unallocatedBefore).toBe(13100_00);
    expect(impact.unallocatedAfter).toBe(11100_00);
    expect(impact.reserveBefore).toBe(12600_00);
    expect(impact.reserveAfter).toBe(12600_00);
    expect(impact.usesReserve).toBe(false);
    expect(impact.exceedsProtected).toBe(false);
    expect(impact.runwayBefore!).toBeCloseTo(12.238, 3);
    expect(impact.runwayAfter!).toBeCloseTo(11.286, 3);
  });

  it("dips into the reserve once unallocated money is exhausted", () => {
    const impact = spendImpact(summary, position.essentialMonthly, 13900_00);
    expect(impact.reserveUsed).toBe(800_00);
    expect(impact.reserveAfter).toBe(11800_00);
    expect(impact.usesReserve).toBe(true);
    expect(impact.exceedsProtected).toBe(false);
    expect(impact.reserveMonthsBefore!).toBeCloseTo(6.0, 5);
    expect(impact.reserveMonthsAfter!).toBeCloseTo(5.619, 3);
  });

  it("flags spends beyond unallocated + reserve and negative cash", () => {
    const impact = spendImpact(summary, position.essentialMonthly, 26000_00);
    expect(impact.exceedsProtected).toBe(true);
    expect(impact.reserveAfter).toBe(0);
    expect(impact.insufficientCash).toBe(true);
    expect(impact.cashAfter).toBe(-300_00);
  });

  it("treats negative unallocated as zero available before the reserve", () => {
    const over = summarise(position, netPayout, 12, [
      { id: "a", label: "Everything", amount: 5000_00 },
    ]);
    const impact = spendImpact(over, position.essentialMonthly, 1000_00);
    expect(impact.reserveUsed).toBe(1000_00);
    expect(impact.usesReserve).toBe(true);
  });
});

describe("months of essentials", () => {
  it("converts a reserve value back to months", () => {
    expect(monthsOfEssentials(11800_00, 2100_00)!).toBeCloseTo(5.619, 3);
    expect(monthsOfEssentials(11800_00, 0)).toBeNull();
  });
});

describe("penny-safe money handling", () => {
  it("parses common user input into pennies", () => {
    expect(toPennies("30,000")).toBe(30000_00);
    expect(toPennies("£4,200.50")).toBe(4200_50);
    expect(toPennies(" 1200 ")).toBe(1200_00);
    expect(toPennies("0.1")).toBe(10);
    expect(toPennies("abc")).toBeNull();
    expect(toPennies("")).toBeNull();
  });

  it("formats without floating-point artefacts", () => {
    expect(gbp(25700_00)).toBe("£25,700");
    expect(gbp(4200_50)).toBe("£4,200.50");
    expect(gbp(-300_00)).toBe("−£300");
    // Classic float trap: 0.1 + 0.2. In pennies it is exact.
    expect(gbp(toPennies("0.1")! + toPennies("0.2")!)).toBe("£0.30");
  });
});
