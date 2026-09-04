# Research notes

## 2026-09-04 — First user test (target user: recently redundant, 60+)

Setup: walked through the five-step flow at home with real-adjacent figures.

Feedback as reported:
- "Good, kinda helpful."
- Not sure that many people would use it in this standalone, self-serve prototype form.
- Wanted more signposting at the end: HMRC, find a pension, find council help, and
  visibility of priority support for people over 60.

Actions taken:
- Added four signpost cards to step 5: HMRC (tax on redundancy pay), Pension Tracing
  Service (gov.uk find-pension-contact-details), local council finder (gov.uk
  find-local-council), and Age UK (over-60s support).

Follow-up (same day): asked whether it would have been useful if his employer had
given him this at the point of redundancy. His employer provided information only,
no tool or structured support. His answer: yes, a platform like this handed over by
the employer would be handy.

Interpretation (to test, not to assume):
- Doubt about standalone consumer use is consistent with the B2B2C thesis: the
  employer hands this to the employee as part of the redundancy package, rather than
  a stressed consumer finding it themselves. The follow-up strengthens this: the
  same user who doubted self-serve said yes to employer-provided. The gap he named
  (information given, no tool) is exactly the wedge: employers already discharge
  this duty with leaflets and links, and a structured tool is a visible upgrade at
  near-zero marginal cost per redundancy.
- The requests were all for *routing to existing help*, not for more modelling.
  The boundary screen may be the most valued screen for this user type.

## 2026-09-04 — Follow-up interview, six questions (same user)

Answers as reported:
1. What did you expect it to do that it didn't? — Wanted a bit more information on
   advice; questioned why it needs information about credit cards or debt.
2. What did you actually do with the money? — Gave most of it to his sister, who has
   managed his finances for much of his life.
3. Would you put real numbers into an employer-provided tool? — Not really, because
   it's very private.
4. When would it have been most useful? — Beforehand, provided you knew what your
   redundancy figure would be.
5. Choosing your own reserve vs being told? — Better picking your own; the tool then
   calculated he'd have 11 months of runway anyway.
6. Would you tell someone else to use it? — Yes, it would be useful. Needs more
   refinement and privacy. People have to tell the truth, which they might not.
   Noted £30k is the tax-free allowance for redundancy; the rest most likely goes
   into a pension.

What this says:
- **The real competitor is a trusted person, not a product.** The payout went to his
  sister. For this segment the product is competing with (or assisting) a trusted
  helper. A "sit beside someone you trust" use pattern may matter more than solo use.
- **Employer distribution ≠ employer visibility.** He wants the employer to provide
  it (previous note) but won't put real figures in something the employer can see.
  The local-first, no-account architecture is not a prototype shortcut; it is the
  product's trust story. "Your employer never sees your figures" must be explicit.
- **Activation is the consultation period, pre-payout.** Works with an estimated
  figure; employers know figures at consultation stage, which strengthens the
  B2B2C packaging (part of the consultation support pack, not the exit letter).
- **The user-selected reserve bet validated.** He preferred choosing and recalled
  the computed runway ("11 months") unprompted — the consequence display landed.
- **Honesty problem.** Garbage-in risk if users understate debts. Long-term answer
  is connected data (Open Banking); short-term, make sensitive fields explicitly
  optional and explain why they're asked.
- **£30k tax-free threshold is common knowledge in this segment**, and above-£30k
  amounts often go to pension — a tax question the tool must route out, but stating
  the £30k fact itself is general information, not advice.

Open questions for next conversations (3–5 people going through redundancy):
- Would you have wanted this the day the letter arrived?
- What did you expect it to do that it didn't?
- Who gave it to you matters: employer, union, JobCentre, family member?
