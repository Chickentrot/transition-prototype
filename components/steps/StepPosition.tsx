"use client";

import { cashAfterObligations, cashAfterRepayments, totalAvailable } from "@/lib/calculations";
import { gbp, type Pennies } from "@/lib/money";
import type { Position } from "@/lib/types";
import { Card, CurrencyField, GhostButton, MoneyRow, PrimaryButton, Rule, StepHeading } from "@/components/ui";

export function StepPosition({
  position,
  netPayout,
  onChange,
  onBack,
  onContinue,
}: {
  position: Position;
  netPayout: Pennies;
  onChange: (p: Position) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const total = totalAvailable(position.existingCash, netPayout);
  const afterRepay = cashAfterRepayments(total, position.plannedRepayment);
  const afterObligations = cashAfterObligations(total, position.plannedRepayment, position.knownUpcomingCosts);
  const set = (patch: Partial<Position>) => onChange({ ...position, ...patch });

  return (
    <div className="space-y-6">
      <StepHeading
        kicker="Step 2 of 5"
        title="Where are you now?"
        lede="Your new financial state, in six numbers. The tool only models the decisions you tell it you've already made."
      />

      <Card delay={60}>
        <div className="grid gap-5 sm:grid-cols-2">
          <CurrencyField
            label="Cash already available"
            value={position.existingCash}
            onChange={(p) => set({ existingCash: p })}
          />
          <CurrencyField
            label="Essential monthly spending"
            hint="Rent or mortgage, bills, food, transport, insurance, childcare."
            value={position.essentialMonthly}
            onChange={(p) => set({ essentialMonthly: p })}
          />
          <CurrencyField
            label="Other monthly household income"
            value={position.otherMonthlyIncome}
            onChange={(p) => set({ otherMonthlyIncome: p })}
          />
          <CurrencyField
            label="Credit cards / loans outstanding"
            value={position.creditBalance}
            onChange={(p) => set({ creditBalance: p })}
          />
          <CurrencyField
            label="Repayment you've already decided to make"
            hint="Only what you have decided yourself. This tool doesn't advise on repaying debts."
            value={position.plannedRepayment}
            onChange={(p) => set({ plannedRepayment: p })}
          />
          <CurrencyField
            label="Known upcoming costs"
            hint="One-off costs you already know about."
            value={position.knownUpcomingCosts}
            onChange={(p) => set({ knownUpcomingCosts: p })}
          />
        </div>
      </Card>

      <Card delay={120}>
        <div className="space-y-2.5">
          <MoneyRow label="Redundancy money" value={netPayout} />
          <MoneyRow label="Cash already available" value={position.existingCash} />
          <Rule />
          <MoneyRow label="Total available" value={total} strong />
          <MoneyRow label="After the repayment you've planned" value={afterRepay} />
          <MoneyRow label="After known upcoming costs" value={afterObligations} />
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-muted">
          After the repayments and costs you&apos;ve told us you plan to make,{" "}
          <strong className="tnum font-semibold text-ink">{gbp(afterObligations)}</strong> would remain.
          {afterObligations < 0 ? " Your planned obligations exceed the money available." : ""}
        </p>
      </Card>

      <div className="rise flex gap-3" style={{ animationDelay: "180ms" }}>
        <GhostButton onClick={onBack}>Back</GhostButton>
        <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
      </div>
    </div>
  );
}
