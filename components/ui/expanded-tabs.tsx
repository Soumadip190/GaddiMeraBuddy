"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { useOnClickOutside } from "usehooks-ts"

import { cn } from "@/lib/utils"

interface Tab {
  title: string
  icon: LucideIcon
  type?: never
}

interface Separator {
  type: "separator"
  title?: never
  icon?: never
}

export type TabItem = Tab | Separator

interface ExpandedTabsProps {
  tabs: TabItem[]
  className?: string
  activeColor?: string
  defaultSelected?: number | null
  selectedIndex?: number | null
  clearOnClickOutside?: boolean
  onChange?: (index: number | null) => void
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
}

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
}

const transition = { delay: 0.1, type: "spring" as const, bounce: 0, duration: 0.6 }

export function ExpandedTabs({
  tabs,
  className,
  activeColor = "!text-white",
  defaultSelected = 0,
  selectedIndex,
  clearOnClickOutside = true,
  onChange,
}: ExpandedTabsProps) {
  const [internalSelected, setInternalSelected] = React.useState<number | null>(defaultSelected)
  const selected = selectedIndex !== undefined ? selectedIndex : internalSelected
  const outsideClickRef = React.useRef<HTMLDivElement>(
    null as unknown as HTMLDivElement
  )

  useOnClickOutside(outsideClickRef, () => {
    if (!clearOnClickOutside) return
    if (selectedIndex === undefined) {
      setInternalSelected(null)
    }
    onChange?.(null)
  })

  const handleSelect = (index: number) => {
    if (selectedIndex === undefined) {
      setInternalSelected(index)
    }
    onChange?.(index)
  }

  const Separator = () => (
    <div className="h-[24px] w-[1.2px] bg-[rgba(46,74,139,0.15)] self-center" aria-hidden="true" />
  )

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-[rgba(46,74,139,0.15)] bg-[rgba(255,255,255,0.7)] backdrop-blur-md p-1.5 shadow-sm",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />
        }

        const Icon = tab.icon
        const isSelected = selected === index
        return (
          <motion.button
            type="button"
            data-tab-btn="true"
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={isSelected}
            onClick={() => handleSelect(index)}
            transition={transition}
            style={
              isSelected
                ? {
                    background: "linear-gradient(135deg, #3759a6 0%, #2e4a8b 55%, #1f3463 100%)",
                    color: "#ffffff",
                    border: "1px solid rgba(46, 74, 139, 0.4)",
                    boxShadow: "0 4px 14px rgba(46, 74, 139, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
                  }
                : {
                    background: "transparent",
                    color: "#1b1e28",
                    border: "1px solid transparent",
                  }
            }
            className={cn(
              "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer",
              isSelected
                ? cn("font-semibold !text-white", activeColor)
                : "hover:bg-[rgba(46,74,139,0.06)] hover:!text-[#2e4a8b]"
            )}
          >
            <Icon
              size={18}
              className="shrink-0"
              style={{
                color: isSelected ? "#ffffff" : "#2e4a8b",
                stroke: isSelected ? "#ffffff" : "#2e4a8b",
              }}
            />
            <AnimatePresence initial={false}>
              {isSelected && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  style={{ color: "#ffffff" }}
                  className="overflow-hidden whitespace-nowrap font-semibold !text-white"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}

export default ExpandedTabs
