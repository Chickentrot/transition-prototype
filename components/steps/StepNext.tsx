"use client";

import { summarise } from "@/lib/calculations";
import type { Pennies } from "@/lib/money";
import type { PlanChoices, Position } from "@/lib/types";
import { Card, GhostButton, InfoNote, MoneyRow, Rule, StepHeading } from "@/components/ui";

const CAN_HELP = [
  "Tracking the transition",
  "Modelling spending scenarios",
  "Monitoring the reserve you selected",
  "Keeping planned and unplanned spending separate",
  "Updating the plan when you get another job",
];

const SPECIALIST = [
  "Choosing investments or pension actions",
  "Deciding how to deal with specific credit debts",
  "Complex tax questions, including tax on payments above £30,000",
  "Mortgage or financial-product recommendations",
  "Legal and employment-rights questions",
];

const ROUTES: { name: string; blurb: string; href: string }[] = [
  {
    name: "MoneyHelper",
    blurb: "Free, government-backed guidance, including a dedicated redundancy-pay journey.",
    href: "https://www.moneyhelper.org.uk/en/work/losing-your-job",
  },
  {
    name: "Find an FCA-authorised financial adviser",
    blurb: "Regulated advice on investments, pensions and products. Check the FCA register.",
    href: "https://register.fca.org.uk/",
  },
  {
    name: "StepChange",
    blurb: "Free debt advice and support with repayment arrangements.",
    href: "https://www.stepchange.org/",
  },
  {
    name: "Citizens Advice",
    blurb: "Free help across benefits, debt, housing and employment.",
    href: "https://www.citizensadvice.org.uk/",
  },
  {
    name: "ACAS",
    blurb: "Employment rights, notice, settlement agreements and disputes.",
    href: "https://www.acas.org.uk/",
  },
  {
    name: "Your employer / EAP support",
    blurb: "Outplacement or employee-assistance support that may be part of your package.",
    href: "#",
  },
];

export function StepNext({
  position,
  netPayout,
  plan,
  onBack,
  onStartAgain,
}: {
  position: Position;
  netPayout: Pennies;
  plan: PlanChoices;
  onBack: () => void;
  onStartAgain: () => void;
}) {
  const summary = summarise(position, netPayout, plan.reserveMonths, plan.allocations);

  return (
    <div className="space-y-6">
      <StepHeading
        kicker="Step 5 of 5"
        title="Your next 90 days"
        lede="A summary of the transition you've organised, what this tool can keep helping with, and where specialist help fits."
      />

      <Card delay={60}>
        <p className="font-display text-lg font-semibold text-ink">Your redundancy transition</p>
        <div className="mt-4 space-y-2.5">
          <MoneyRow label="Redundancy payout" value={netPayout} strong />
          <MoneyRow label="Your planned repayments" value={position.plannedRepayment} />
          <MoneyRow label="Known upcoming costs" value={position.knownUpcomingCosts} />
          <MoneyRow label={`Reserve you selected (${plan.reserveMonths} months)`} value={summary.reserve} />
          <MoneyRow label="Your planned goals" value={summary.allocations} />
          <Rule />
          <MoneyRow label="Currently undecided" value={summary.unallocated} strong negative={summary.overAllocated} />
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card delay={120}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            After Redundancy can help you
          </p>
          <ul className="mt-3 space-y-2.5">
            {CAN_HELP.map((item) => (
              <li key={item} className="border-b border-line pb-2.5 text-[14px] leading-snug text-ink last:border-b-0">
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card delay={180}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-ink">
            Specialist help may be appropriate for
          </p>
          <ul className="mt-3 space-y-2.5">
            {SPECIALIST.map((item) => (
              <li key={item} className="border-b border-line pb-2.5 text-[14px] leading-snug text-ink last:border-b-0">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card delay={240}>
        <p className="text-[13px] font-medium text-ink">Where to go</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {ROUTES.map((r) => (
            <a
              key={r.name}
              href={r.href}
              target={r.href === "#" ? undefined : "_blank"}
              rel="noreferrer"
              className="group rounded-sm border border-line p-4 transition-colors hover:border-accent"
            >
              <p className="text-[14px] font-semibold text-ink group-hover:text-accent-deep">{r.name}</p>
              <p className="mt-1 text-[13px] leading-snug text-muted">{r.blurb}</p>
            </a>
          ))}
        </div>
        <div className="mt-4">
          <InfoNote>
            Universal Credit or New Style Jobseeker&apos;s Allowance may apply after redundancy.{" "}
            <a
              className="font-semibold underline decoration-line-strong underline-offset-2 hover:decoration-accent"
              href="https://www.gov.uk/redundancy-your-rights"
              target="_blank"
              rel="noreferrer"
            >
              Check eligibility on gov.uk
            </a>
            .
          </InfoNote>
        </div>
      </Card>

      <div className="rise flex gap-3" style={{ animationDelay: "300ms" }}>
        <GhostButton onClick={onBack}>Back</GhostButton>
        <GhostButton onClick={onStartAgain}>Start again</GhostButton>
      </div>
    </div>
  );
}
