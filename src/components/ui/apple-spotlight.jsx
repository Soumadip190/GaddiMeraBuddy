import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ChevronRight, X } from "lucide-react";
import { cn } from "../../lib/utils";

const SVGFilter = () => {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
      <filter id="spotlight-blob">
        <feGaussianBlur stdDeviation="10" in="SourceGraphic" />
        <feColorMatrix
          values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 18 -9
    "
          result="blob"
        />
        <feBlend in="SourceGraphic" in2="blob" />
      </filter>
    </svg>
  );
};

export function AppleSpotlight({
  isOpen = false,
  onClose = () => {},
  results = [],
  onSelect = () => {},
  shortcuts = [],
  query = "",
  onQueryChange = () => {},
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input when opened and reset active item
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keep active index in bounds when results list changes
  useEffect(() => {
    if (activeIndex >= results.length) {
      setActiveIndex(Math.max(0, results.length - 1));
    }
  }, [results.length]);

  // Keyboard navigation: Escape, ArrowUp, ArrowDown, Enter
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (results.length > 0) {
          setActiveIndex((prev) => (prev + 1) % results.length);
        }
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (results.length > 0) {
          setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
        }
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (results.length > 0 && results[activeIndex]) {
          onSelect(results[activeIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, activeIndex, onSelect, onClose]);

  // Auto scroll active option into view in dropdown
  useEffect(() => {
    if (listRef.current && results.length > 0) {
      const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const motionVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { opacity: 0, scaleX: 1.05, scaleY: 1.05, y: -8 },
        animate: { opacity: 1, scaleX: 1, scaleY: 1, y: 0 },
        exit: { opacity: 0, scaleX: 1.05, scaleY: 1.05, y: 8 },
        transition: { stiffness: 550, damping: 50, type: "spring" },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...motionVariants}
          role="dialog"
          aria-modal="true"
          aria-label="Search insurance plans"
          className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-md"
          onClick={onClose}
        >
          <SVGFilter />

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ filter: "url(#spotlight-blob)" }}
            className="w-full flex items-center justify-center max-w-2xl relative z-10"
          >
            <motion.div
              layoutId="spotlight-card"
              style={{
                borderRadius: "24px",
                fontFamily: "var(--sans, system-ui)",
                color: "var(--ink, #12345b)",
              }}
              className="w-full flex flex-col items-stretch overflow-hidden bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/80"
            >
              {/* Search Bar Input */}
              <div className="flex items-center w-full px-5 h-15 gap-3 border-b border-[var(--line,#e2e8f0)]">
                <Search
                  className="size-5 shrink-0"
                  style={{ color: "var(--mut, #60748c)" }}
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-autocomplete="list"
                  aria-controls="spotlight-results-list"
                  aria-activedescendant={
                    results[activeIndex] ? `spotlight-item-${results[activeIndex].id}` : undefined
                  }
                  placeholder="Search by insurer, coverage, or e.g. 'under 8500'..."
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none ring-0 text-base sm:text-lg font-medium text-[var(--ink,#12345b)] placeholder-[var(--mut,#60748c)]"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => onQueryChange("")}
                    aria-label="Clear search query"
                    className="p-1 rounded-full text-[var(--mut,#60748c)] hover:bg-slate-100 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono rounded bg-slate-100 text-[var(--mut,#60748c)] border border-slate-200">
                  ESC
                </kbd>
              </div>

              {/* Empty-Query Shortcut Chips */}
              {shortcuts && shortcuts.length > 0 && !query && (
                <div
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-50/70 border-b border-[var(--line,#e2e8f0)] overflow-x-auto text-xs"
                  role="toolbar"
                  aria-label="Quick plan search suggestions"
                >
                  <span className="text-[11px] font-semibold text-[var(--mut,#60748c)] shrink-0 mr-1">
                    Quick filters:
                  </span>
                  {shortcuts.map((sc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onQueryChange(sc.label)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-[var(--ink,#12345b)] border border-[var(--line-strong,rgba(31,92,160,0.2))] hover:bg-blue-50/60 hover:border-[var(--accent,#1e6bf2)] transition-all cursor-pointer shrink-0"
                    >
                      {sc.icon && <span className="size-3.5 inline-flex items-center">{sc.icon}</span>}
                      <span>{sc.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Results List or Empty State */}
              <div
                id="spotlight-results-list"
                ref={listRef}
                role="listbox"
                className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100"
              >
                {results.length === 0 ? (
                  <div
                    className="py-10 px-4 text-center text-sm font-medium"
                    style={{ color: "var(--mut, #60748c)" }}
                    role="status"
                  >
                    No plans match &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  results.map((res, index) => {
                    const isSelected = index === activeIndex;
                    return (
                      <button
                        key={res.id || index}
                        id={`spotlight-item-${res.id}`}
                        data-index={index}
                        role="option"
                        aria-selected={isSelected}
                        type="button"
                        onClick={() => onSelect(res)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          "w-full text-left flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer group",
                          isSelected
                            ? "bg-blue-50/90 text-[var(--accent,#1e6bf2)]"
                            : "hover:bg-slate-50 text-[var(--ink,#12345b)]"
                        )}
                      >
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate text-[var(--ink,#12345b)]">
                              {res.label}
                            </span>
                            {res.tag && (
                              <span
                                className={cn(
                                  "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full",
                                  res.tag === "Sponsored"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-blue-800"
                                )}
                              >
                                {res.tag}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs truncate mt-0.5"
                            style={{ color: "var(--mut, #60748c)" }}
                          >
                            {res.description}
                          </p>
                        </div>
                        <ChevronRight
                          className={cn(
                            "size-4 shrink-0 transition-transform duration-150",
                            isSelected
                              ? "translate-x-0.5 text-[var(--accent,#1e6bf2)]"
                              : "text-slate-300 group-hover:text-slate-400"
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })
                )}
              </div>

              {/* Bottom Instructions Footer */}
              <div className="px-4 py-2 bg-slate-50 border-t border-[var(--line,#e2e8f0)] flex items-center justify-between text-[11px] text-[var(--mut,#60748c)]">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 font-mono">↑</kbd>
                    <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 font-mono ml-1">↓</kbd> navigate
                  </span>
                  <span>
                    <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 font-mono">↵</kbd> select
                  </span>
                </div>
                <span>{results.length} {results.length === 1 ? "plan" : "plans"} available</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AppleSpotlight;
