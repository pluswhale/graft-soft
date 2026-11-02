"use client";

import { useCallback, useState } from "react";

export interface HorizontalAccordionState {
  activeId: string | null;
  toggle: (id: string) => void;
}

/**
 * State for the horizontal accordion timeline.
 * Clicking a card expands it; clicking it again collapses the accordion
 * (every card then renders at equal compact width).
 *
 * When the step list changes (e.g. locale switch), the selection is
 * re-validated during render (see "adjusting state when a prop changes" in the
 * React docs — no setState inside an effect).
 */
export function useHorizontalAccordion(stepIds: string[], initialId?: string): HorizontalAccordionState {
  const [state, setState] = useState<{ ids: string[]; id: string | null }>({
    ids: stepIds,
    id: initialId ?? null,
  });

  if (state.ids !== stepIds) {
    const id =
      state.id != null ? (stepIds.includes(state.id) ? state.id : stepIds[0] ?? null) : null;
    setState({ ids: stepIds, id });
  }

  const toggle = useCallback((id: string) => {
    setState((current) => ({ ids: current.ids, id: current.id === id ? null : id }));
  }, []);

  return { activeId: state.id, toggle };
}
