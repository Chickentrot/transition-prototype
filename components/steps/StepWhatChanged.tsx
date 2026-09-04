"use client";

import type { TransitionDetails } from "@/lib/types";
import { Card, CurrencyField, DateField, InfoNote, PrimaryButton, StepHeading, YesNo } from "@/components/ui";

const OTHER_TRANSITIONS = ["Inheritance", "Retirement", "Business exit", "Divorce or separation", "Bereavement"];

export function StepWhatChanged({
  transition,
  onChange,
  onContinue,
}: {
  transition: TransitionDetails;
  onChange: (t: TransitionDetails) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6">
      <StepHeading
        kicker="Step 1 of 5"
        title="What changed?"
        lede="A major financial event changes your position overnight. Start by telling the tool what happened."
      />

      <Card delay={60}>
        <p className="text-[13px] font-medium text-ink">Your transition</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-sm border border-accent bg-accent-soft px-4 py-2 text-[14px] font-semibold text-accent-deep">
            I&apos;ve been made redundant
          </span>
          {OTHER_TRANSITIONS.map((label) => (
            <span
              key={label}
              className="rounded-sm border border-line px-4 py-2 text-[14px] text-faint"
              title="Not in this prototype"
            >
              {label}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-faint">Only redundancy is active in this prototype.</p>
      </Card>

      <Card delay={120}>
        <div className="grid gap-5 sm:grid-cols-2">
          <DateField
            label="Last day of employment"
            value={transition.employmentEndDate}
            onChange={(v) => onChange({ ...transition, employmentEndDate: v })}
          />
          <DateField
            label="When the redundancy payment arrives"
            value={transition.payoutDate}
            onChange={(v) => onChange({ ...transition, payoutDate: v })}
          />
          <CurrencyField
            label="Redundancy amount, expected or confirmed"
            hint="What will actually land in your account, after any tax. An estimate from your consultation is fine. The first £30,000 of redundancy pay is usually tax-free (gov.uk)."
            value={transition.netPayout}
            onChange={(p) => onChange({ ...transition, netPayout: p })}
          />
          <YesNo
            label="Does other household income continue?"
            hint="For example a partner's salary."
            value={transition.householdIncomeContinues}
            onChange={(v) => onChange({ ...transition, householdIncomeContinues: v })}
          />
          <DateField
            label="Expected date of your next income"
            hint="Optional. Leave blank if you don't know yet."
            value={transition.expectedNextIncomeDate}
            onChange={(v) => onChange({ ...transition, expectedNextIncomeDate: v })}
          />
        </div>
      </Card>

      <div className="rise" style={{ animationDelay: "150ms" }}>
        <InfoNote>
          <strong>Everything you enter stays on this device.</strong> No account, no sign-up, nothing
          sent anywhere. If an employer gave you this tool, they can never see your figures.
        </InfoNote>
      </div>

      <div className="rise space-y-4" style={{ animationDelay: "180ms" }}>
        <p className="max-w-prose text-[13px] leading-relaxed text-muted">
          After Redundancy helps you organise your financial transition and understand the effect of
          different choices. It does not provide personalised investment, pension or debt advice.
        </p>
        <PrimaryButton onClick={onContinue}>Build my transition</PrimaryButton>
      </div>
    </div>
  );
}
