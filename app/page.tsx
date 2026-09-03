"use client";

import { useEffect, useRef, useState } from "react";
import { Stepper } from "@/components/Stepper";
import { StepImpact } from "@/components/steps/StepImpact";
import { StepNext } from "@/components/steps/StepNext";
import { StepPosition } from "@/components/steps/StepPosition";
import { StepProtect } from "@/components/steps/StepProtect";
import { StepWhatChanged } from "@/components/steps/StepWhatChanged";
import { clearState, demoState, emptyState, loadState, saveState } from "@/lib/state";
import type { AppState } from "@/lib/types";

export default function Home() {
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  // Remounts the form fields when state is replaced wholesale (demo load / clear).
  const [formEpoch, setFormEpoch] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // One-off hydration from localStorage after mount; SSR markup must render the
    // empty state first, so this cannot move into a useState initialiser.
    /* eslint-disable react-hooks/set-state-in-effect */
    const saved = loadState();
    if (saved) setState(saved);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const goTo = (step: AppState["step"]) => {
    setState((s) => ({ ...s, step }));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const replaceState = (next: AppState) => {
    setState(next);
    setFormEpoch((e) => e + 1);
  };

  const clearAll = () => {
    clearState();
    replaceState(structuredClone(emptyState));
  };

  return (
    <div ref={topRef} className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-16 pt-6 sm:px-6">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="font-display text-lg font-semibold tracking-tight text-ink">
          After Redundancy
          <span className="ml-2 align-middle rounded-sm border border-line px-1.5 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-[0.14em] text-faint">
            Prototype
          </span>
        </p>
        <div className="flex gap-4 text-[12px] text-muted">
          <button type="button" className="transition-colors hover:text-ink" onClick={() => replaceState(structuredClone(demoState))}>
            Load demo data
          </button>
          <button type="button" className="transition-colors hover:text-ink" onClick={clearAll}>
            Clear my data
          </button>
        </div>
      </header>

      <div className="mt-6">
        <Stepper current={state.step} onJump={goTo} />
      </div>

      <main className="mt-8 flex-1" key={`${state.step}-${formEpoch}`}>
        {!hydrated ? null : state.step === 1 ? (
          <StepWhatChanged
            transition={state.transition}
            onChange={(transition) => setState((s) => ({ ...s, transition }))}
            onContinue={() => goTo(2)}
          />
        ) : state.step === 2 ? (
          <StepPosition
            position={state.position}
            netPayout={state.transition.netPayout}
            onChange={(position) => setState((s) => ({ ...s, position }))}
            onBack={() => goTo(1)}
            onContinue={() => goTo(3)}
          />
        ) : state.step === 3 ? (
          <StepProtect
            position={state.position}
            netPayout={state.transition.netPayout}
            plan={state.plan}
            onChange={(plan) => setState((s) => ({ ...s, plan }))}
            onBack={() => goTo(2)}
            onContinue={() => goTo(4)}
          />
        ) : state.step === 4 ? (
          <StepImpact
            position={state.position}
            netPayout={state.transition.netPayout}
            plan={state.plan}
            onBack={() => goTo(3)}
            onContinue={() => goTo(5)}
          />
        ) : (
          <StepNext
            position={state.position}
            netPayout={state.transition.netPayout}
            plan={state.plan}
            onBack={() => goTo(4)}
            onStartAgain={clearAll}
          />
        )}
      </main>

      <footer className="mt-12 border-t border-line pt-4">
        <p className="text-[12px] leading-relaxed text-faint">
          Prototype only. Information and scenario modelling, not financial advice. Your figures stay in
          this browser and are never sent anywhere.
        </p>
      </footer>
    </div>
  );
}
