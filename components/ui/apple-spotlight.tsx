'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  ChevronRight,
  Files,
  Folder,
  Globe,
  Image,
  LayoutGrid,
  Mail,
  MessageSquare,
  Music,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  StickyNote,
  Terminal,
  Car,
  Wrench,
  Percent,
  CheckCircle2,
  X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface Shortcut {
  label: string;
  icon: React.ReactNode;
  link?: string;
  onClick?: () => void;
}

export interface SearchResult {
  icon: React.ReactNode;
  label: string;
  description: string;
  link?: string;
  badge?: string;
  price?: string | number;
  planId?: string;
  onClick?: () => void;
}

const SVGFilter = () => {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none">
      <filter id="blob">
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

interface ShortcutButtonProps {
  icon: React.ReactNode;
  link?: string;
  onClick?: () => void;
  label?: string;
}

const ShortcutButton = ({ icon, link, onClick, label }: ShortcutButtonProps) => {
  const content = (
    <div
      onClick={onClick}
      title={label}
      className="rounded-full cursor-pointer hover:shadow-lg opacity-40 hover:opacity-100 transition-[opacity,shadow] duration-200 bg-white/80 p-2 border border-slate-200"
    >
      <div className="size-12 aspect-square flex items-center justify-center text-slate-800">
        {icon}
      </div>
    </div>
  );

  if (link && !onClick) {
    return (
      <a href={link} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return content;
};

interface SpotlightPlaceholderProps {
  text: string;
  className?: string;
}

const SpotlightPlaceholder = ({ text, className }: SpotlightPlaceholderProps) => {
  return (
    <motion.div
      layout
      className={cn('absolute text-gray-500 flex items-center pointer-events-none z-10', className)}
    >
      <AnimatePresence mode="popLayout">
        <motion.p
          layoutId={`placeholder-${text}`}
          key={`placeholder-${text}`}
          initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

interface SpotlightInputProps {
  placeholder: string;
  hidePlaceholder: boolean;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholderClassName?: string;
}

const SpotlightInput = ({
  placeholder,
  hidePlaceholder,
  value,
  onChange,
  onClear,
  placeholderClassName
}: SpotlightInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center w-full justify-start gap-3 px-6 h-16">
      <motion.div layoutId="search-icon" className="text-slate-700">
        <Search className="size-6 stroke-[2]" />
      </motion.div>
      <div className="flex-1 relative text-xl sm:text-2xl">
        {!hidePlaceholder && (
          <SpotlightPlaceholder text={placeholder} className={placeholderClassName} />
        )}

        <motion.input
          ref={inputRef}
          layout="position"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none ring-0 text-slate-900 font-medium"
        />
      </div>
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="size-5" />
        </button>
      )}
    </div>
  );
};

interface SearchResultCardProps extends SearchResult {
  isLast: boolean;
}

const SearchResultCard = ({
  icon,
  label,
  description,
  link,
  badge,
  price,
  onClick,
  isLast
}: SearchResultCardProps) => {
  const innerContent = (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center text-slate-900 justify-start hover:bg-white gap-3.5 py-3 px-3.5 rounded-xl hover:shadow-md w-full transition-all cursor-pointer',
        isLast && 'rounded-b-3xl'
      )}
    >
      <div className="size-9 [&_svg]:stroke-[1.8] [&_svg]:size-6 aspect-square flex items-center justify-center text-blue-600 bg-blue-50/80 rounded-lg shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-900 text-sm truncate">{label}</p>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 truncate">{description}</p>
      </div>
      {price && (
        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-slate-900">{price}</div>
          <div className="text-[10px] text-slate-400">/year</div>
        </div>
      )}
      <div className="flex items-center justify-end opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 text-slate-400">
        <ChevronRight className="size-5" />
      </div>
    </div>
  );

  if (link && !onClick) {
    return (
      <a href={link} target="_blank" rel="noreferrer" className="overflow-hidden w-full group/card block">
        {innerContent}
      </a>
    );
  }

  return <div className="overflow-hidden w-full group/card">{innerContent}</div>;
};

interface SearchResultsContainerProps {
  searchResults: SearchResult[];
  onHover: (index: number | null) => void;
}

const SearchResultsContainer = ({ searchResults, onHover }: SearchResultsContainerProps) => {
  return (
    <motion.div
      layout
      onMouseLeave={() => onHover(null)}
      className="px-2 border-t border-slate-200 flex flex-col bg-slate-50/90 max-h-96 overflow-y-auto w-full py-2"
    >
      {searchResults.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">
          No matching insurance plans or filters found. Try searching by insurer, model, or add-on.
        </div>
      ) : (
        searchResults.map((result, index) => {
          return (
            <motion.div
              key={`search-result-${index}-${result.label}`}
              onMouseEnter={() => onHover(index)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.15,
                ease: 'easeOut'
              }}
            >
              <SearchResultCard
                icon={result.icon}
                label={result.label}
                description={result.description}
                link={result.link}
                badge={result.badge}
                price={result.price}
                onClick={result.onClick}
                isLast={index === searchResults.length - 1}
              />
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
};

export interface AppleSpotlightProps {
  shortcuts?: Shortcut[];
  searchResults?: SearchResult[];
  isOpen?: boolean;
  handleClose?: () => void;
  onSelectResult?: (result: SearchResult) => void;
  placeholder?: string;
  vehicleModel?: string;
}

const DEFAULT_SHORTCUTS: Shortcut[] = [
  {
    label: 'All Plans',
    icon: <LayoutGrid className="size-6" />,
    link: '#plans'
  },
  {
    label: 'Zero Depreciation',
    icon: <ShieldCheck className="size-6" />,
    link: '#zerodep'
  },
  {
    label: 'Cashless Garages',
    icon: <Wrench className="size-6" />,
    link: '#garages'
  },
  {
    label: 'Best NCB Bonus',
    icon: <Percent className="size-6" />,
    link: '#ncb'
  }
];

const DEFAULT_RESULTS: SearchResult[] = [
  {
    icon: <Shield className="size-5" />,
    label: 'Eastern General — Comprehensive Shield Plus',
    description: 'Best match for Swift & Creta: Zero depreciation + 38 cashless garages',
    badge: 'Best Match',
    price: '₹8,420'
  },
  {
    icon: <Car className="size-5" />,
    label: 'Metro Assure — Standard Smart Cover',
    description: 'Lowest price: Basic accident & third-party cover with standard parts',
    badge: 'Lowest Price',
    price: '₹7,980'
  },
  {
    icon: <CheckCircle2 className="size-5" />,
    label: 'Bengal Crown — Zero-Dep Elite Care',
    description: 'High IDV value, ₹500 claim deductible with doorstep pickup & drop',
    badge: 'Elite Cover',
    price: '₹8,890'
  },
  {
    icon: <ShieldCheck className="size-5" />,
    label: 'National Liability Pool — Third Party Only',
    description: 'Statutory legal minimum cover for third-party injury & property',
    badge: 'Legal Minimum',
    price: '₹3,416'
  }
];

const AppleSpotlight = ({
  shortcuts = DEFAULT_SHORTCUTS,
  searchResults = DEFAULT_RESULTS,
  isOpen = true,
  handleClose = () => {},
  placeholder = 'Search insurance plans, models or add-ons...',
  vehicleModel
}: AppleSpotlightProps) => {
  const [hovered, setHovered] = useState(false);
  const [hoveredSearchResult, setHoveredSearchResult] = useState<number | null>(null);
  const [hoveredShortcut, setHoveredShortcut] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Filter results dynamically when query is present
  const rawFiltered = searchValue.trim()
    ? searchResults.filter((r) => {
        const q = searchValue.toLowerCase();
        return (
          r.label.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.badge && r.badge.toLowerCase().includes(q))
        );
      })
    : searchResults;

  const filteredResults = rawFiltered.map((r) => ({
    ...r,
    onClick: () => {
      if (r.onClick) r.onClick();
      if (onSelectResult) onSelectResult(r);
      handleClose();
    }
  }));

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            scaleX: 1.15,
            scaleY: 1.08,
            y: -10
          }}
          animate={{
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scaleX: 1.15,
            scaleY: 1.08,
            y: 10
          }}
          transition={{
            stiffness: 550,
            damping: 50,
            type: 'spring'
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-20 sm:pt-28 px-4 bg-black/40 backdrop-blur-md"
          onClick={handleClose}
        >
          <SVGFilter />

          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
              setHovered(false);
              setHoveredShortcut(null);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ filter: 'url(#blob)' }}
            className={cn(
              'w-full flex items-center justify-end gap-3 z-20 group',
              '[&>div]:bg-white/95 [&>div]:text-slate-900 [&>div]:rounded-full [&>div]:backdrop-blur-2xl',
              '[&_svg]:size-6 [&_svg]:stroke-[1.6]',
              'max-w-3xl'
            )}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                layoutId="search-input-container"
                transition={{
                  layout: {
                    duration: 0.4,
                    type: 'spring',
                    bounce: 0.15
                  }
                }}
                style={{
                  borderRadius: '28px'
                }}
                className="h-full w-full flex flex-col items-center justify-start z-10 relative shadow-2xl overflow-hidden border border-white/60 bg-white"
              >
                <SpotlightInput
                  placeholder={
                    hoveredShortcut !== null
                      ? shortcuts[hoveredShortcut].label
                      : hoveredSearchResult !== null && filteredResults[hoveredSearchResult]
                      ? filteredResults[hoveredSearchResult].label
                      : vehicleModel
                      ? `Search plans for ${vehicleModel} (e.g. Zero-Dep, Price)...`
                      : placeholder
                  }
                  placeholderClassName={
                    hoveredSearchResult !== null ? 'text-slate-900 font-semibold' : 'text-slate-400'
                  }
                  hidePlaceholder={!(hoveredSearchResult !== null || !searchValue)}
                  value={searchValue}
                  onChange={handleSearchValueChange}
                  onClear={() => setSearchValue('')}
                />

                {/* Always show results or quick matching list */}
                <SearchResultsContainer
                  searchResults={filteredResults}
                  onHover={setHoveredSearchResult}
                />
              </motion.div>

              {hovered &&
                !searchValue &&
                shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={`shortcut-${index}-${shortcut.label}`}
                    onMouseEnter={() => setHoveredShortcut(index)}
                    layout
                    initial={{ scale: 0.7, x: -1 * (48 * (index + 1)) }}
                    animate={{ scale: 1, x: 0 }}
                    exit={{
                      scale: 0.7,
                      x:
                        1 *
                        (16 * (shortcuts.length - index - 1) + 48 * (shortcuts.length - index - 1))
                    }}
                    transition={{
                      duration: 0.5,
                      type: 'spring',
                      bounce: 0.2,
                      delay: index * 0.04
                    }}
                    className="rounded-full cursor-pointer shrink-0"
                  >
                    <ShortcutButton
                      icon={shortcut.icon}
                      link={shortcut.link}
                      onClick={shortcut.onClick}
                      label={shortcut.label}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Quick keyboard hint */}
          <div className="mt-4 flex items-center gap-3 text-xs text-white/80 font-medium">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">ESC</kbd> to exit</span>
            <span>·</span>
            <span>Tap any plan to select &amp; compare</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { AppleSpotlight };
export default AppleSpotlight;
