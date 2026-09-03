"use client";

import { useState } from "react";
import { spendImpact, summarise } from "@/lib/calculations";
import { gbp, months1dp, toPennies, type Pennies } from "@/lib/money";
import type { PlanChoices, Position } from "@/lib/types";
import { Card, GhostButton, InfoNote, PrimaryButton, StepHeading } from "@/components/ui";

function BeforeAfter({
  label,
  before,
  after,
  changed,
}: {
  label: string;
  before: string;
  after: string;
  changed: boolean;
}) {
  return (
    <div className="border-b border-line py-3 last:border-b-0">
      <p className="text-[13px] text-muted">{label}</p>
      <p className="tnum mt-1 flex flex-wrap items-baseline gap-x-2 text-[17px] text-ink">
        <span className={changed ? "text-faint line-through decoration-line-strong" : "font-semibold"}>
          {before}
        </span>
        {changed ? (
          <>
            <span aria-hidden className="text-faint">
              to
            </span>
            <span className="font-semibold">{after}</span>
          </>
        ) : (
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">unchanged</span>
        )}
      </p>
    </div>
  );
}

export function StepImpact({
  position,
  netPayout,
  plan,
  onBack,
  onContinue,
}: {
  position: Position;
  netPayout: Pennies;
  plan: PlanChoices;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [noted, setNoted] = useState(false);

  const summary = summarise(position, netPayout, plan.reserveMonths, plan.allocations);
  const amount = toPennies(draft);
  const impact = amount !== null && amount > 0 ? spendImpact(summary, position.essentialMonthly, amount) : null;

  const fmtMonths = (m: number | null) => (m === null ? "—" : `${months1dp(m)} months`);

  return (
    <div className="space-y-6">
      <StepHeading
        kicker="Step 4 of 5"
        title="See the impact"
        lede="Type an amount you're thinking about spending. The tool shows the mathematical consequence. The decision stays yours."
      />

      <Card delay={60}>
        <label className="block">
          <span className="text-[13px] font-medium text-ink">If I spend…</span>
          <span className="mt-2 flex items-baseline gap-2 border-b-2 border-line pb-2 transition-colors focus-within:border-accent">
            <span className="font-display text-3xl text-faint">£</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              autoComplete="off"
              className="tnum w-full bg-transparent font-display text-3xl font-semibold text-ink outline-none placeholder:text-faint"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setNoted(false);
              }}
            />
          </span>
        </label>
      </Card>

      {impact ? (
        <>
          <Card>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              If you spend {gbp(impact.amount)}
            </p>
            <div className="mt-2">
              <BeforeAfter
                label="Cash after your planned obligations"
                before={gbp(impact.cashBefore)}
                after={gbp(impact.cashAfter)}
                changed
              />
              <BeforeAfter
                label={`Your protected reserve (${plan.reserveMonths} months selected)`}
                before={gbp(impact.reserveBefore)}
                after={gbp(impact.reserveAfter)}
                changed={impact.usesReserve}
              />
              <BeforeAfter
                label="Unallocated money"
                before={gbp(impact.unallocatedBefore)}
                after={gbp(impact.unallocatedAfter)}
                changed={impact.unallocatedBefore !== impact.unallocatedAfter}
              />
              <BeforeAfter
                label="Essential-expense runway"
                before={fmtMonths(impact.runwayBefore)}
                after={fmtMonths(impact.runwayAfter)}
                changed
              />
            </div>

            <div className="mt-4 space-y-3">
              {!impact.usesReserve && !impact.exceedsProtected ? (
                <InfoNote>
                  This purchase would not require using the {plan.reserveMonths}-month reserve you chose
                  to protect.
                </InfoNote>
              ) : null}
              {impact.usesReserve && !impact.exceedsProtected ? (
                <InfoNote tone="amber">
                  This would use {gbp(impact.reserveUsed)} of the reserve you chose to protect and would
                  change that reserve from {months1dp(impact.reserveMonthsBefore ?? 0)} to{" "}
                  {months1dp(impact.reserveMonthsAfter ?? 0)} months.
                </InfoNote>
              ) : null}
              {impact.exceedsProtected ? (
                <InfoNote tone="amber">
                  This is more than your unallocated money and your protected reserve combined. It would
                  use the whole reserve and would also need to come from the money you&apos;ve set aside
                  for other plans{impact.insufficientCash ? ", and it exceeds the cash available" : ""}.
                </InfoNote>
              ) : null}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <GhostButton onClick={() => setNoted(true)}>Think about this for 24 hours</GhostButton>
              {noted ? (
                <span className="text-[13px] text-muted">
                  Noted. This prototype doesn&apos;t set reminders yet.
                </span>
              ) : null}
            </div>
          </Card>
        </>
      ) : (
        <p className="rise text-[13px] text-faint" style={{ animationDelay: "120ms" }}>
          Enter an amount above to see its effect on your cash, your reserve and your runway.
        </p>
      )}

      <div className="rise flex gap-3" style={{ animationDelay: "180ms" }}>
        <GhostButton onClick={onBack}>Back</GhostButton>
        <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
      </div>
    </div>
  );
}
