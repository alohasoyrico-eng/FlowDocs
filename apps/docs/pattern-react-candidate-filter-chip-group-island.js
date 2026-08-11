import React from "react";
import { FilterChipGroup } from "./generated/react/patterns/FilterChipGroup.js?v=1";

export function FilterChipGroupIsland({ initialProps }) {
  const initialFilters = initialProps.filters ?? [];
  const [filters, setFilters] = React.useState(initialFilters);
  const [state, setState] = React.useState(initialProps.state ?? "active");
  const [feedback, setFeedback] = React.useState(initialProps.feedback);
  const resultCount = filters.length ? Math.max(0, 128 - ((initialFilters.length - filters.length) * 24)) : 0;

  const finish = (nextState, nextFeedback) => {
    window.setTimeout(() => {
      setState(nextState);
      setFeedback(nextFeedback);
    }, 220);
  };

  return React.createElement(FilterChipGroup, {
    ...initialProps,
    filters,
    resultCount,
    state,
    feedback,
    onRemoveFilter: (key, event) => {
      setState("removing");
      setFilters((currentFilters) => currentFilters.filter((filter) => (filter.key ?? filter.value ?? filter.label) !== key));
      finish("active", { label: "Filter removed", description: "The table results were updated.", tone: "info", state: "visible" });
      initialProps.onRemoveFilter?.(key, event);
    },
    onReset: (event) => {
      setState("resetting");
      setFilters([]);
      finish("empty", { label: "Filters cleared", description: "All active filters were removed.", tone: "success", state: "visible" });
      initialProps.onReset?.(event);
    },
  });
}
