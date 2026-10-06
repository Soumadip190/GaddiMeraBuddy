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
                  background: "linear-gradient(135deg, #2c2d30 0%, #18191b 55%, #0f1012 100%)",
                  color: "#ffffff",
                  borderColor: "#2c2d30",
                }}
                className="text-white shadow-xs"
              >
                {badgeText}
              </Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-4xl tracking-tighter max-w-2xl font-semibold text-left text-[#141414]">
                {heading}
              </h2>
              <p className="text-base md:text-lg max-w-xl lg:max-w-2xl leading-relaxed tracking-tight text-[#6e6e68] text-left">
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
                      ? "bg-[#ffffff] border-[1.5px] border-[#d8d7cf] rounded-2xl h-full lg:col-span-2 p-6 min-h-[210px] flex justify-between flex-col gap-6 shadow-xs"
                      : "bg-[#ffffff] border-[1.5px] border-[#d8d7cf] rounded-2xl p-6 min-h-[210px] flex justify-between flex-col gap-6 shadow-xs"
                  }
                >
                  <div className="w-11 h-11 rounded-xl bg-[#f4f3ee] border border-[#d8d7cf] flex items-center justify-center text-[#141414]">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold tracking-tight text-[#141414]">
                      {item.title}
                    </h3>
                    <p className="text-[#6e6e68] max-w-2xl text-sm md:text-base leading-relaxed">
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
