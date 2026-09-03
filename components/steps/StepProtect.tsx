"use client";

import { useState } from "react";
import { summarise } from "@/lib/calculations";
import { gbp, toPennies, type Pennies } from "@/lib/money";
import type { PlanChoices, Position } from "@/lib/types";
import {
  Card,
  FieldLabel,
  GhostButton,
  InfoNote,
  MoneyRow,
  PrimaryButton,
  Rule,
  StepHeading,
} from "@/components/ui";

const PRESET_MONTHS = [3, 6, 9, 12];

export function StepProtect({
  position,
  netPayout,
  plan,
  onChange,
  onBack,
  onContinue,
}: {
  position: Position;
  netPayout: Pennies;
  plan: PlanChoices;
  onChange: (p: PlanChoices) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [customOpen, setCustomOpen] = useState(!PRESET_MONTHS.includes(plan.reserveMonths));
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const summary = summarise(position, netPayout, plan.reserveMonths, plan.allocations);

  const addAllocation = () => {
    const amount = toPennies(newAmount);
    if (!newLabel.trim() || amount === null || amount <= 0) return;
    onChange({
      ...plan,
      allocations: [
        ...plan.allocations,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label: newLabel.trim(), amount },
      ],
    });
    setNewLabel("");
    setNewAmount("");
  };

  return (
    <div className="space-y-6">
      <StepHeading
        kicker="Step 3 of 5"
        title="Protect what matters"
        lede="You decide what to protect and what to set aside. The tool doesn't suggest amounts; it shows the consequence of your choices."
      />

      <Card delay={60}>
        <FieldLabel hint="Your choice. There is no recommended number.">
          How many months of essential spending do you want to protect while you&apos;re between jobs?
        </FieldLabel>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {PRESET_MONTHS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setCustomOpen(false);
                onChange({ ...plan, reserveMonths: m });
              }}
              className={`rounded-sm border px-5 py-2 text-[14px] font-medium transition-colors ${
                !customOpen && plan.reserveMonths === m
                  ? "border-accent bg-accent text-white"
                  : "border-line text-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {m}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            className={`rounded-sm border px-5 py-2 text-[14px] font-medium transition-colors ${
              customOpen ? "border-accent bg-accent text-white" : "border-line text-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            Custom
          </button>
          {customOpen ? (
            <input
              type="number"
              min={0}
              step={0.5}
              className="tnum w-24 rounded-sm border border-line bg-surface px-3 py-2 text-[14px] outline-none focus:border-accent"
              value={plan.reserveMonths}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isFinite(v) && v >= 0) onChange({ ...plan, reserveMonths: v });
              }}
            />
          ) : null}
          <span className="text-[13px] text-muted">months</span>
        </div>
        <p className="mt-3 text-[13px] text-muted">
          {plan.reserveMonths} months of your essential spending is{" "}
          <strong className="tnum font-semibold text-ink">{gbp(summary.reserve)}</strong>.
        </p>
      </Card>

      <Card delay={120}>
        <FieldLabel hint="Give money a purpose before it disappears: training, a car, a holiday, or simply “keep undecided”.">
          Set aside money for your own plans
        </FieldLabel>
        {plan.allocations.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {plan.allocations.map((a) => (
              <li key={a.id} className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                <span className="text-[14px] text-ink">{a.label}</span>
                <span className="flex items-baseline gap-3">
                  <span className="tnum text-[14px] text-ink">{gbp(a.amount)}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${a.label}`}
                    className="text-xs text-faint transition-colors hover:text-amber-ink"
                    onClick={() =>
                      onChange({ ...plan, allocations: plan.allocations.filter((x) => x.id !== a.id) })
                    }
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="What's it for?"
            className="min-w-0 flex-1 rounded-sm border border-line bg-surface px-3 py-2 text-[14px] outline-none placeholder:text-faint focus:border-accent"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <span className="flex items-baseline gap-1 rounded-sm border border-line bg-surface px-3 py-2 focus-within:border-accent">
            <span className="text-[14px] text-faint">£</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              className="tnum w-24 bg-transparent text-[14px] outline-none placeholder:text-faint"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAllocation()}
            />
          </span>
          <GhostButton onClick={addAllocation}>Add</GhostButton>
        </div>
      </Card>

      <Card delay={180}>
        <p className="font-display text-lg font-semibold text-ink">Your transition</p>
        <div className="mt-4 space-y-2.5">
          <MoneyRow label="Starting available money" value={summary.totalAvailable} strong />
          <MoneyRow label="Your planned repayments" value={-position.plannedRepayment} sub />
          <MoneyRow label="Known upcoming costs" value={-position.knownUpcomingCosts} sub />
          <MoneyRow
            label={`${plan.reserveMonths}-month reserve you selected`}
            value={-summary.reserve}
            sub
          />
          {plan.allocations.map((a) => (
            <MoneyRow key={a.id} label={a.label} value={-a.amount} sub />
          ))}
          <Rule />
          <MoneyRow label="Remaining unallocated" value={summary.unallocated} strong negative={summary.overAllocated} />
        </div>
        {summary.overAllocated ? (
          <div className="mt-4">
            <InfoNote tone="amber">
              The reserve and plans you&apos;ve set add up to more than the money available. Nothing is
              wrong with the maths; it just means these choices can&apos;t all be funded at once.
            </InfoNote>
          </div>
        ) : null}
      </Card>

      <div className="rise flex gap-3" style={{ animationDelay: "240ms" }}>
        <GhostButton onClick={onBack}>Back</GhostButton>
        <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
      </div>
    </div>
  );
}
