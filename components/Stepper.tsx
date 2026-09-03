"use client";

const STEPS = ["What changed?", "Where are you now?", "Protect what matters", "See the impact", "Next 90 days"];

export function Stepper({ current, onJump }: { current: number; onJump: (step: 1 | 2 | 3 | 4 | 5) => void }) {
  return (
    <nav aria-label="Progress" className="flex gap-1.5">
      {STEPS.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3 | 4 | 5;
        const state = step === current ? "current" : step < current ? "done" : "todo";
        return (
          <button
            key={label}
            type="button"
            onClick={() => state === "done" && onJump(step)}
            disabled={state === "todo"}
            className={`group flex-1 pt-2 text-left ${state === "done" ? "cursor-pointer" : "cursor-default"}`}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span
              className={`block h-[3px] w-full rounded-full transition-colors ${
                state === "todo" ? "bg-line" : "bg-accent"
              } ${state === "done" ? "opacity-45 group-hover:opacity-70" : ""}`}
            />
            <span
              className={`mt-1.5 hidden text-[11px] leading-tight sm:block ${
                state === "current" ? "font-semibold text-ink" : "text-faint"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
