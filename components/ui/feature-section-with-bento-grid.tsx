import * as React from "react";
import { ShieldCheck, Wrench, Award, Scale, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface BentoItem {
  title: string;
  description: string;
  icon?: LucideIcon;
  colSpan?: 1 | 2;
}

export interface FeatureProps {
  badgeText?: string;
  heading?: string;
  subheading?: string;
  items?: BentoItem[];
}

const DEFAULT_ITEMS: BentoItem[] = [
  {
    title: "IDV (Insured Declared Value)",
    description:
      "The maximum amount your insurer pays if your vehicle is stolen or damaged beyond repair. It equals the manufacturer's listed price minus standard depreciation. Choosing a slightly higher IDV increases your payout ceiling for a modest premium difference.",
    icon: ShieldCheck,
    colSpan: 2,
  },
  {
    title: "Zero depreciation (Bumper-to-Bumper)",
    description:
      "Standard policies deduct 20%–50% depreciation on plastic, rubber, glass, and metal parts when settling a repair bill. Zero-depreciation removes that deduction so the insurer covers the full value of replaced parts.",
    icon: Wrench,
    colSpan: 1,
  },
  {
    title: "NCB (No Claim Bonus)",
    description:
      "A renewal discount of 20% to 50% on your own-damage premium for every claim-free year. Your NCB belongs to you personally and transfers even if you switch insurers.",
    icon: Award,
    colSpan: 1,
  },
  {
    title: "Third-party vs Comprehensive cover",
    description:
      "Third-party cover is mandatory by law and pays only for injury, death, or property damage caused to others. Comprehensive cover includes mandatory third-party liability plus protection for your own vehicle against accidents, theft, fire, and floods.",
    icon: Scale,
    colSpan: 2,
  },
];

function Feature({
  badgeText = "Insurance Guide",
  heading = "Plain-language insurance explanations",
  subheading = "Understand the key terms before you decide on your vehicle renewal.",
  items = DEFAULT_ITEMS,
}: FeatureProps) {
  const icons = [ShieldCheck, Wrench, Award, Scale];

  return (
    <div className="w-full py-10 lg:py-14">
      <div className="container mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex gap-3 flex-col items-start">
            <div>
              <Badge
                style={{
                  background: "linear-gradient(135deg, #3759a6 0%, #2e4a8b 55%, #1f3463 100%)",
                  color: "#ffffff",
                  borderColor: "rgba(46,74,139,0.3)",
                }}
                className="text-white shadow-xs"
              >
                {badgeText}
              </Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-4xl tracking-tight max-w-2xl font-bold text-left text-[#1b1e28]">
                {heading}
              </h2>
              <p className="text-base md:text-lg max-w-xl lg:max-w-2xl leading-relaxed tracking-tight text-[#5e6678] text-left">
                {subheading}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => {
              const Icon = item.icon || icons[idx % icons.length];
              const isWide =
                item.colSpan ? item.colSpan === 2 : idx === 0 || idx === 3;
              return (
                <div
                  key={item.title}
                  className={
                    isWide
                      ? "bg-[rgba(255,255,255,0.7)] backdrop-blur-md border border-[rgba(46,74,139,0.15)] rounded-2xl h-full lg:col-span-2 p-6 min-h-[210px] flex justify-between flex-col gap-6 shadow-[0_8px_32px_rgba(46,74,139,0.06)]"
                      : "bg-[rgba(255,255,255,0.7)] backdrop-blur-md border border-[rgba(46,74,139,0.15)] rounded-2xl p-6 min-h-[210px] flex justify-between flex-col gap-6 shadow-[0_8px_32px_rgba(46,74,139,0.06)]"
                  }
                >
                  <div className="w-11 h-11 rounded-xl bg-[rgba(46,74,139,0.08)] border border-[rgba(46,74,139,0.18)] flex items-center justify-center text-[#2e4a8b]">
                    <Icon className="w-6 h-6 stroke-[1.85]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold tracking-tight text-[#1b1e28]">
                      {item.title}
                    </h3>
                    <p className="text-[#5e6678] max-w-2xl text-sm md:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
