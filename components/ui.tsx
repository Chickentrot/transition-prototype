"use client";

import { useState, type ReactNode } from "react";
import { gbp, toEditString, toPennies, type Pennies } from "@/lib/money";

export function StepHeading({ kicker, title, lede }: { kicker: string; title: string; lede?: string }) {
  return (
    <header className="rise">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{kicker}</p>
      <h1 className="mt-2 font-display text-[2rem] leading-tight font-semibold text-ink sm:text-4xl">
        {title}
      </h1>
      {lede ? <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">{lede}</p> : null}
    </header>
  );
}

export function Card({ children, className = "", delay }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <section
      className={`rise rounded-md border border-line bg-surface p-5 sm:p-6 ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </section>
  );
}

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <span className="block">
      <span className="text-[13px] font-medium text-ink">{children}</span>
      {hint ? <span className="mt-0.5 block text-xs leading-snug text-muted">{hint}</span> : null}
    </span>
  );
}

export function CurrencyField({
  label,
  hint,
  value,
  onChange,
  placeholder = "0",
}: {
  label: string;
  hint?: string;
  value: Pennies;
  onChange: (p: Pennies) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  // While focused the user owns the text; otherwise mirror the canonical pennies value.
  const shown = focused ? draft : toEditString(value);

  return (
    <label className="block">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <span className="mt-1.5 flex items-baseline gap-1 rounded-sm border border-line bg-surface px-3 py-2 transition-colors focus-within:border-accent">
        <span className="text-[15px] text-faint">£</span>
        <input
          type="text"
          inputMode="decimal"
          className="tnum w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
          placeholder={placeholder}
          value={shown}
          onFocus={() => {
            setDraft(toEditString(value));
            setFocused(true);
          }}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            if (raw.trim() === "") {
              onChange(0);
              return;
            }
            const p = toPennies(raw);
            if (p !== null) onChange(p);
          }}
        />
      </span>
    </label>
  );
}

export function DateField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <input
        type="date"
        className="mt-1.5 w-full rounded-sm border border-line bg-surface px-3 py-2 text-[15px] text-ink outline-none transition-colors focus:border-accent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function YesNo({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <div className="mt-1.5 inline-flex rounded-sm border border-line bg-surface p-0.5">
        {([true, false] as const).map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-[3px] px-4 py-1.5 text-[13px] font-medium transition-colors ${
              value === option ? "bg-accent text-white" : "text-muted hover:text-ink"
            }`}
          >
            {option ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MoneyRow({
  label,
  value,
  strong,
  negative,
  sub,
}: {
  label: ReactNode;
  value: Pennies;
  strong?: boolean;
  negative?: boolean;
  sub?: boolean;
}) {
  return (
    <div className={`flex items-baseline justify-between gap-4 ${sub ? "pl-4" : ""}`}>
      <span className={`text-[14px] ${strong ? "font-semibold text-ink" : "text-muted"}`}>{label}</span>
      <span
        className={`tnum text-[15px] ${strong ? "font-semibold" : ""} ${
          negative || value < 0 ? "text-amber-ink" : "text-ink"
        }`}
      >
        {gbp(value)}
      </span>
    </div>
  );
}

export function Rule() {
  return <hr className="border-t border-line" />;
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-sm bg-accent px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-sm border border-line px-4 py-2.5 text-[14px] font-medium text-muted transition-colors hover:border-line-strong hover:text-ink"
    >
      {children}
    </button>
  );
}

export function InfoNote({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "amber" }) {
  return (
    <div
      className={`rounded-sm border px-4 py-3 text-[13px] leading-relaxed ${
        tone === "amber" ? "border-amber-soft bg-amber-soft text-amber-ink" : "border-line bg-accent-soft text-ink"
      }`}
    >
      {children}
    </div>
  );
}
