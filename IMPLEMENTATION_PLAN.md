# After Redundancy — implementation plan

Research prototype for an event-driven financial transition product. First transition: redundancy.
Working product name in the UI: **After Redundancy** ("Product X" is the internal codename).

The prototype demonstrates how a person can take a redundancy lump sum, understand their new
financial state, create their **own** protection choices, and model the consequences of future
spending. It must not provide personalised financial, investment, pension, debt, tax, legal,
mortgage or credit recommendations. It is not a production fintech application.

## Technology

- Next.js (App Router), TypeScript, Tailwind. Entirely client-side.
- No auth, no database, no external API, no AI/LLM, no Open Banking, no analytics.
- State lives in React and is persisted to `localStorage` only. A "Clear my data" control wipes it.
- All financial arithmetic in pure TypeScript functions in `lib/calculations.ts`, in **integer pennies**.
  No arithmetic in UI text and no LLM anywhere.
- Unit tests with Vitest over the calculation module.

## Data model

All money values are integer pennies (`type Pennies = number`).

```ts
TransitionDetails {
  employmentEndDate: string      // ISO date, may be empty
  payoutDate: string             // ISO date, may be empty
  netPayout: Pennies             // net redundancy amount actually available
  householdIncomeContinues: boolean
  expectedNextIncomeDate: string // optional, may be empty
}

Position {
  existingCash: Pennies          // cash already available
  essentialMonthly: Pennies      // essential monthly spending
  otherMonthlyIncome: Pennies    // other monthly household income
  creditBalance: Pennies         // credit cards / loans outstanding (context only)
  plannedRepayment: Pennies      // amount the USER has already decided to repay
  knownUpcomingCosts: Pennies    // known one-off upcoming costs
}

Allocation { id: string; label: string; amount: Pennies }

PlanChoices {
  reserveMonths: number          // months of essentials the USER chose to protect
  allocations: Allocation[]      // user-created pots (training, car, undecided…)
}
```

The full app state (`AppState`) is `{ step, transition, position, plan }`, persisted under one
versioned localStorage key.

## Calculation formulas

All in `lib/calculations.ts`, all pure, all pennies.

- `totalAvailable = existingCash + netPayout`
- `cashAfterObligations = totalAvailable − plannedRepayment − knownUpcomingCosts` (may be negative)
- `reserveTarget = round(essentialMonthly × reserveMonths)`
- `allocationsTotal = Σ allocation.amount`
- `unallocated = cashAfterObligations − reserveTarget − allocationsTotal` (may be negative → over-allocated)
- `runwayMonths = cashAfterObligations ÷ essentialMonthly` — "essential-expense runway": how many
  months of essential spending the remaining cash covers, ignoring other income (per spec example:
  £25,700 ÷ £2,100 = 12.2 months). `null` when essentials are zero; floored at 0.
- `monthsOfEssentials(amount) = amount ÷ essentialMonthly` (used for reserve months display)

### Hypothetical spend model (`spendImpact`)

A hypothetical spend draws down in layers:

1. from **unallocated** money first (treating negative unallocated as zero available),
2. then from the **user-selected reserve**,
3. anything beyond that is flagged (`exceedsProtected`) — it would have to come from the user's
   named allocations or doesn't exist. Named allocations are treated as committed plans and are
   never silently raided.

Outputs: cash before/after, unallocated before/after, reserve before/after, `reserveUsed`,
reserve months before/after, runway before/after, and flags (`usesReserve`, `exceedsProtected`,
`insufficientCash` when cash after would be negative).

The reserve-dip message is: *"This would use £X of the reserve you chose to protect and would
change that reserve from A months to B months."* Otherwise: *"This purchase would not require
using the reserve you chose to protect."* Pure consequence, no judgement.

## Prohibited recommendation language

The UI must never emit, in any state:

- "You can afford this" / "You cannot afford this"
- "This is a good idea" / "This is a bad idea"
- "You should…" / "You shouldn't…" / "We recommend…" / "Don't buy this"
- Any instruction to repay (or not repay) a specific debt
- Any suggested reserve size, allocation size, or default the tool picked for the user
- Any investment, pension, debt, tax, legal, mortgage or credit recommendation
- The phrase "Targeted Support" (specific FCA meaning) and the label "Safe to spend"

Permitted: arithmetic consequences of the user's own stated decisions, and neutral signposting to
MoneyHelper, FCA-authorised advisers, debt-support providers, Citizens Advice, ACAS, gov.uk and
employer/EAP support.

Every screen carries: *"Prototype only. Information and scenario modelling, not financial advice."*

## Screens

1. **What changed?** — transition selector (only Redundancy active; others visible but inactive),
   employment end date, payout date, net amount, household income continues, optional
   next-income date. Scope statement. CTA "Build my transition".
2. **Where are you now?** — the six Position fields; live readout of total available, after
   planned repayments, after known costs. Never advises on the debt.
3. **Protect what matters** — user picks reserve months (3/6/9/12/custom), creates own
   allocations; breakdown down to "Remaining unallocated". No recommended sizes.
4. **See the impact** — hypothetical amount → before/after on cash, reserve, unallocated,
   runway; reserve-dip sentence; non-functional "Think about this for 24 hours" action.
5. **Your next 90 days** — transition summary; "After Redundancy can help with" vs
   "Get specialist help for"; signpost cards (MoneyHelper, FCA register, StepChange,
   Citizens Advice, ACAS, employer/EAP); neutral Universal Credit / New Style JSA eligibility
   note linking to gov.uk.

Demo-data mode loads completely fictional values (the spec's worked example). Header controls:
Back, Start again, Clear my data, Load demo data.

## Test coverage (Vitest)

- available cash, cash after obligations
- user-selected reserve target (incl. custom/fractional months)
- unallocated cash (incl. negative / over-allocated)
- hypothetical-spend impact: unallocated-only case, reserve-dip case, beyond-reserve case
- runway before/after a spend
- insufficient cash / negative states
- penny-precision (no floating-pound arithmetic)
