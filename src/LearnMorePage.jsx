import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  Car,
  Sparkles,
  Award,
  IndianRupee,
  SlidersHorizontal,
  Layers,
  Wrench,
  Cog,
  Receipt,
  UserCheck,
  FileCheck2,
  RefreshCw,
  Building2,
  MapPin,
  AlertCircle,
  Wallet,
  Scale,
  Search,
  X,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Scale as CompareIcon,
} from "lucide-react";

// =========================================================================
// STRUCTURED INSURANCE TOPICS DATA
// =========================================================================
export const INSURANCE_CATEGORIES = [
  "All",
  "Basics",
  "Coverage",
  "Add-ons",
  "Claims",
  "Renewal",
  "Policy Terms",
];

export const FEATURED_TOPICS = [
  {
    id: "no-claim-bonus",
    badge: "Up to 50% Savings",
    title: "No Claim Bonus (NCB)",
    category: "Renewal",
    icon: "award",
    shortDescription: "A renewal discount earned for every year you drive without making a claim.",
    explanation:
      "No Claim Bonus (NCB) is a reward offered by insurance companies on your Own Damage premium when you do not raise any claim during the previous policy year. The discount starts at 20% after your first claim-free year and can grow up to 50% after five consecutive claim-free years.",
    whyItMatters:
      "The longer you stay claim-free, the larger your discount becomes—cutting your own-damage premium by up to half. Importantly, NCB belongs to you (the vehicle owner), not the car, so you can transfer it when upgrading to a new car or switching insurers.",
    example:
      "Suppose your eligible Own Damage premium at renewal is ₹10,000 and you have accumulated a 35% NCB over three claim-free years. You receive a ₹3,500 discount directly on the Own Damage component, bringing that part down to ₹6,500.",
    whatToCheck:
      "Verify the exact NCB percentage printed on your expiring policy schedule and ensure it is accurately carried forward when comparing renewal quotes. Also note that if your policy lapses for more than 90 days after expiry, insurers may reset your accumulated NCB to zero.",
    tip: "NCB applies only to the Own Damage portion of your premium—never to the mandatory Third-Party liability portion. For minor scratches that cost less than your NCB discount, paying out of pocket often saves more money at renewal.",
  },
  {
    id: "comprehensive-vs-third-party",
    badge: "Core Decision",
    title: "Comprehensive vs Third-Party",
    category: "Coverage",
    icon: "compare",
    shortDescription: "How full protection for your car differs from the legal minimum cover.",
    explanation:
      "In India, Third-Party insurance is the legal minimum required to drive on public roads and covers only damage or injury you cause to someone else. Comprehensive insurance includes that mandatory Third-Party cover plus Own Damage protection for your own car against accidents, theft, fire, floods, and cyclones.",
    whyItMatters:
      "If your car is damaged in a collision, stolen, or caught in monsoon waterlogging, a Third-Party policy pays nothing toward your car's repairs. A Comprehensive policy protects your own vehicle's value and unlocks access to cashless network garages and add-on covers.",
    example:
      "If you accidentally rear-end another car in traffic resulting in ₹25,000 damage to their bumper and ₹40,000 damage to your bonnet: Third-Party cover only handles their ₹25,000 claim. Comprehensive cover pays for both their third-party claim and your ₹40,000 car repair (minus deductibles).",
    whatToCheck:
      "Check the top of your policy schedule for 'Package Policy' or 'Comprehensive Policy' versus 'Liability Only / Act Only'. Also check whether you hold a standalone Own Damage policy paired with a multi-year Third-Party policy (common for cars bought after September 2018).",
    tip: "Comprehensive policies allow you to attach helpful add-ons like Zero Depreciation and Roadside Assistance, which cannot be attached to a Third-Party Only policy.",
  },
  {
    id: "zero-depreciation",
    badge: "Most Popular Add-on",
    title: "Zero Depreciation",
    category: "Add-ons",
    icon: "sparkles",
    shortDescription: "Covers the full replacement cost of car parts without age-based deductions.",
    explanation:
      "Under a standard comprehensive policy, when car parts are replaced after an accident, the insurer deducts standard depreciation (ranging from 5% to 50% on metal, plastic, nylon, and fibre parts) based on the car's age. Zero Depreciation (also called Bumper-to-Bumper cover) waives these depreciation deductions so the insurer pays the full part replacement bill.",
    whyItMatters:
      "Modern cars have expensive plastic bumpers, LED headlamps, and fibre panels where standard policies deduct up to 50% or 30% during claims. Zero Depreciation drastically lowers your out-of-pocket bill at the workshop.",
    example:
      "Your car's front bumper and headlamp assembly are replaced after an accident, costing ₹24,000. Under a standard policy, plastic and fibre depreciation might require you to pay ₹8,000–₹10,000 out of pocket. With Zero Depreciation, the insurer covers the full ₹24,000 part cost, and you only pay the mandatory ₹1,000 policy deductible.",
    whatToCheck:
      "Check the policy wording for whether there is a cap on the number of Zero Depreciation claims allowed per year (some insurers allow 2 claims per year, while others offer unlimited claims). Also note that most insurers offer Zero Dep only for cars up to 5 to 7 years old.",
    tip: "Even with Zero Depreciation, routine consumables like engine oil, coolant, nuts, bolts, and brake oil are excluded unless you also have a Consumables cover or a combined add-on package.",
  },
  {
    id: "insured-declared-value",
    badge: "Your Car's Valuation",
    title: "Insured Declared Value (IDV)",
    category: "Policy Terms",
    icon: "indian-rupee",
    shortDescription: "The maximum compensation your insurer will pay if your car is stolen or totalled.",
    explanation:
      "Insured Declared Value (IDV) is the current market valuation of your car fixed by the insurer at the start of the policy period. It is calculated as the manufacturer's listed ex-showroom selling price minus standard age-based depreciation set by Indian motor tariff guidelines.",
    whyItMatters:
      "IDV acts as the maximum payout ceiling if your car is stolen and unrecovered, or damaged beyond repair (Constructive Total Loss). It also directly influences your Own Damage premium—a higher IDV means a slightly higher premium but a larger payout if the worst happens.",
    example:
      "If your 3-year-old hatchback has an IDV of ₹4,10,000 and is stolen with no recovery, the insurer's maximum settlement liability is ₹4,10,000 (minus compulsory deductibles). If you artificially lowered the IDV to ₹3,40,000 just to save ₹600 on your annual premium, you would lose ₹70,000 in final claim payout.",
    whatToCheck:
      "When comparing two insurance quotes, never look at the annual price alone—always compare the IDV offered by each insurer. A quote that looks ₹500 cheaper might simply be insuring your car for ₹45,000 less in IDV.",
    tip: "Aim to set your IDV close to your car's realistic market value rather than picking the lowest possible slider value. Specific IDV flexibility bands vary by insurer.",
  },
];

export const INSURANCE_TOPICS = [
  {
    id: "what-is-car-insurance",
    title: "What is Car Insurance?",
    category: "Basics",
    icon: "car",
    shortDescription: "Financial and legal protection against road accidents, theft, and liabilities.",
    explanation:
      "Car insurance is a contract between you and an insurance company where you pay an annual premium, and in return, the insurer protects you against financial losses caused by road accidents, vehicle theft, fire, natural calamities, and legal liabilities toward third parties.",
    whyItMatters:
      "A single road accident can lead to repair bills running into tens of thousands of rupees or legal compensation claims in lakhs. Car insurance shields your savings and ensures you comply with the Motor Vehicles Act in India.",
    example:
      "You pay an annual premium of ₹8,420 for your hatchback. Three months later, a fallen tree branch during a storm damages your windshield and roof, costing ₹42,000 to repair. Instead of paying ₹42,000 from your savings, your insurer settles the workshop bill minus a small compulsory deductible.",
    whatToCheck:
      "Always check the policy validity dates, vehicle registration number, engine/chassis numbers, and type of coverage (Comprehensive vs Third-Party) on your policy certificate.",
    tip: "Under the Motor Vehicles Act, driving without at least a valid Third-Party insurance policy on Indian roads is a punishable traffic offence.",
  },
  {
    id: "third-party-insurance",
    title: "Third-Party Insurance",
    category: "Coverage",
    icon: "shield",
    shortDescription: "Mandatory legal cover that pays for injury or damage your car causes to others.",
    explanation:
      "Third-Party Liability insurance (also called 'Act Only' cover) is the compulsory minimum insurance required by law for every motor vehicle in India. In this arrangement, you are the first party, the insurer is the second party, and anyone else on the road (pedestrians, other drivers, or property owners) is the third party.",
    whyItMatters:
      "It keeps your vehicle legally road-worthy and protects you from devastating legal and financial liabilities if your car injures someone or damages another person's vehicle or property.",
    example:
      "If your car skids and damages a neighbour's boundary wall or another motorist's door, your Third-Party policy covers the legal compensation for their repair or medical treatment (property damage is typically covered up to ₹7.5 Lakh, while bodily injury liability is determined by court/tribunal awards).",
    whatToCheck:
      "Remember that a Third-Party policy provides zero coverage for repairs to your own car or if your car is stolen. Check if your policy also includes the mandatory ₹15 Lakh Personal Accident cover for the owner-driver.",
    tip: "Third-Party premium rates in India are regulated and standardized by IRDAI based on your car's engine cubic capacity (cc) or battery kilowatt (kW) rating, meaning the base third-party rate is the same across insurers.",
  },
  {
    id: "comprehensive-insurance",
    title: "Comprehensive Insurance",
    category: "Coverage",
    icon: "shield-check",
    shortDescription: "Complete protection covering both third-party liabilities and damage to your own car.",
    explanation:
      "Comprehensive car insurance (often labelled as a 'Package Policy') combines mandatory Third-Party liability cover with Own Damage cover in a single policy. It protects your car against accidental collisions, theft, fire, explosions, vandalism, and natural disasters like floods, storms, and earthquakes.",
    whyItMatters:
      "It gives you complete peace of mind on the road and lets you customize your protection with add-on covers like Zero Depreciation, Engine Protection, and 24x7 Roadside Assistance.",
    example:
      "During heavy monsoon rains, your parked car suffers bumper damage from a minor collision and water damage to the interior. A Comprehensive policy steps in to cover the repair costs at a cashless network garage, whereas a Third-Party policy would not cover any of it.",
    whatToCheck:
      "Check the Insured Declared Value (IDV), included add-ons, compulsory deductible amount, and the list of nearby cashless network garages before purchasing or renewing.",
    tip: "Even a Comprehensive policy has standard exclusions (such as normal wear and tear or depreciation on parts) unless you pair it with relevant add-on covers.",
  },
  {
    id: "own-damage-cover",
    title: "Own Damage Cover",
    category: "Coverage",
    icon: "layers",
    shortDescription: "The part of your policy that specifically pays to repair or replace your own vehicle.",
    explanation:
      "Own Damage (OD) cover protects your insured car against physical damage caused by accidents, fire, theft, riots, and natural calamities. You can hold Own Damage cover either as part of a Comprehensive policy or as a Standalone Own Damage policy (if you already have an active multi-year Third-Party policy).",
    whyItMatters:
      "Since September 2018, new cars in India are sold with a mandatory 3-year Third-Party bundle. When renewing after Year 1 or Year 2, car owners only need to buy a Standalone Own Damage policy to keep their car protected—and they can switch insurers freely for the OD portion.",
    example:
      "You bought a new car in 2024 with a 3-year Third-Party policy and a 1-year Own Damage cover. In 2025, your Third-Party cover is still active for two more years, so you simply purchase a 1-year Standalone Own Damage policy to continue protecting your car against accidents and theft.",
    whatToCheck:
      "If buying a Standalone Own Damage policy, ensure your underlying Third-Party policy number and validity dates are accurately recorded in the new policy document.",
    tip: "All discounts—including your No Claim Bonus (NCB) and voluntary deductible discounts—are calculated specifically on the Own Damage premium.",
  },
  {
    id: "zero-depreciation",
    title: "Zero Depreciation",
    category: "Add-ons",
    icon: "sparkles",
    shortDescription: "Covers the full replacement cost of car parts without age-based deductions.",
    explanation:
      "Under a standard comprehensive policy, when car parts are replaced after an accident, the insurer deducts standard depreciation (ranging from 5% to 50% on metal, plastic, nylon, and fibre parts) based on the car's age. Zero Depreciation (also called Bumper-to-Bumper cover) waives these depreciation deductions so the insurer pays the full part replacement bill.",
    whyItMatters:
      "Modern cars have expensive plastic bumpers, LED headlamps, and fibre panels where standard policies deduct up to 50% or 30% during claims. Zero Depreciation drastically lowers your out-of-pocket bill at the workshop.",
    example:
      "Your car's front bumper and headlamp assembly are replaced after an accident, costing ₹24,000. Under a standard policy, plastic and fibre depreciation might require you to pay ₹8,000–₹10,000 out of pocket. With Zero Depreciation, the insurer covers the full ₹24,000 part cost, and you only pay the mandatory ₹1,000 policy deductible.",
    whatToCheck:
      "Check the policy wording for whether there is a cap on the number of Zero Depreciation claims allowed per year (some insurers allow 2 claims per year, while others offer unlimited claims). Also note that most insurers offer Zero Dep only for cars up to 5 to 7 years old.",
    tip: "Even with Zero Depreciation, routine consumables like engine oil, coolant, nuts, bolts, and brake oil are excluded unless you also have a Consumables cover or a combined add-on package.",
  },
  {
    id: "no-claim-bonus",
    title: "No Claim Bonus (NCB)",
    category: "Renewal",
    icon: "award",
    shortDescription: "A reward discount for staying claim-free during your policy year.",
    explanation:
      "No Claim Bonus (NCB) is a discount offered on your Own Damage insurance premium when you don't make a claim during the policy period. It follows a standard slab in India: 20% after 1 claim-free year, 25% after 2 years, 35% after 3 years, 45% after 4 years, and 50% after 5 consecutive claim-free years.",
    whyItMatters:
      "The longer you stay claim-free, the larger your potential discount can become—saving you up to 50% on your Own Damage premium year after year.",
    example:
      "Suppose your eligible Own Damage premium is ₹10,000 and you qualify for a 35% NCB. You receive a ₹3,500 discount on the eligible premium, reducing it to ₹6,500.",
    whatToCheck:
      "Check whether your current policy shows your NCB percentage and whether it can be carried forward during renewal. Declaring an incorrect NCB while switching insurers can lead to claim rejection later if the previous insurer does not confirm it.",
    tip: "NCB generally applies to the Own Damage component rather than Third-Party insurance, and lapses if you do not renew your policy within 90 days after the expiry date.",
  },
  {
    id: "insured-declared-value",
    title: "Insured Declared Value (IDV)",
    category: "Policy Terms",
    icon: "indian-rupee",
    shortDescription: "The maximum amount your insurer pays if your car is stolen or damaged beyond repair.",
    explanation:
      "Insured Declared Value (IDV) is the agreed current market value of your vehicle covered under a Comprehensive or Own Damage policy. It is calculated by taking the manufacturer's ex-showroom price of your car model and subtracting standard depreciation based on the vehicle's age.",
    whyItMatters:
      "If your car is stolen or suffers total damage exceeding 75% of its IDV, the insurer treats it as a Total Loss and compensates you up to the IDV amount. Setting your IDV too low to save a small amount on premium reduces your safety net.",
    example:
      "Your 2022 Maruti Suzuki Swift has an IDV of ₹4,10,000. If the car is stolen and police issue a non-traceable certificate, your claim settlement is based on ₹4,10,000 (minus compulsory deductible).",
    whatToCheck:
      "Check the IDV figure prominently printed on your quotation and policy schedule. Ensure any non-factory fitted electrical or CNG accessories are declared separately if you want them covered.",
    tip: "When comparing plans across insurers, try to match the IDV across quotes so you are comparing prices on an equal footing.",
  },
  {
    id: "deductible",
    title: "Deductible",
    category: "Policy Terms",
    icon: "sliders",
    shortDescription: "The small fixed amount you pay first out of pocket whenever a claim is settled.",
    explanation:
      "A deductible (also known as ' Policy Excess') is the portion of a repair claim that you pay from your own pocket before the insurance company pays the remaining bill. In India, there are two types: Compulsory Deductible (fixed by regulations at ₹1,000 for private cars up to 1500cc, and ₹2,000 for cars above 1500cc) and Voluntary Deductible (an optional extra amount you choose to lower your annual premium).",
    whyItMatters:
      "Knowing your deductible prevents surprises when picking up your car from a cashless workshop. Choosing a high voluntary deductible lowers your yearly premium slightly, but increases what you must pay during every claim.",
    example:
      "Your approved cashless repair bill is ₹18,000 and your policy has a ₹1,000 compulsory deductible. The insurer pays ₹17,000 directly to the workshop, and you pay the ₹1,000 deductible (plus any applicable depreciation or consumables if not covered by add-ons).",
    whatToCheck:
      "Check the 'Deductible / Excess' section on your policy schedule to ensure an unintended Voluntary Deductible wasn't added just to make the quote look cheaper.",
    tip: "Compulsory deductibles apply to every Own Damage claim, even if you have the Zero Depreciation add-on.",
  },
  {
    id: "addon-covers",
    title: "Add-on Covers",
    category: "Add-ons",
    icon: "layers",
    shortDescription: "Optional upgrades that plug coverage gaps in a standard comprehensive policy.",
    explanation:
      "Add-on covers (or riders) are optional protection boosters you can attach to a Comprehensive or Standalone Own Damage policy for an additional premium. Popular add-ons include Zero Depreciation, Engine Protect, 24x7 Roadside Assistance, Return to Invoice, Consumables Cover, Tyre Protect, and NCB Protection.",
    whyItMatters:
      "A standard comprehensive policy has built-in limitations—it deducts part depreciation, excludes hydrostatic engine lock in floods, and resets your NCB after a single claim. Add-ons let you tailor coverage to your car's age and city driving conditions.",
    example:
      "A driver in Kolkata who parks in a flood-prone neighbourhood adds Zero Depreciation (₹1,150) and Engine Protect (₹890) to their base ₹8,420 policy. For ~₹2,000 extra per year, they are protected against ₹1.5 Lakh+ monsoon engine repair bills.",
    whatToCheck:
      "Review each add-on's eligibility (many are restricted to vehicles under 5 to 7 years old) and check individual add-on pricing and claim limits in your policy wordings.",
    tip: "You don't need every add-on. New cars under 3 years benefit most from Zero Depreciation, Return to Invoice, and Engine Protect, while older cars benefit most from Roadside Assistance.",
  },
  {
    id: "roadside-assistance",
    title: "Roadside Assistance",
    category: "Add-ons",
    icon: "wrench",
    shortDescription: "24x7 emergency breakdown help for flat tyres, dead batteries, and towing.",
    explanation:
      "24x7 Roadside Assistance (RSA) is an add-on service that provides on-the-spot mechanical and emergency support if your car breaks down on city roads or highways. Services typically include battery jump-start, flat tyre changing, emergency fuel delivery, minor on-spot repairs, lost key assistance, and flatbed/crane towing to the nearest workshop.",
    whyItMatters:
      "Breakdowns rarely happen at convenient times. RSA ensures you have a single toll-free helpline to call day or night without hunting for local towing operators or worrying about using a claim.",
    example:
      "Your car battery dies late in the evening or a tyre punctures on a highway trip. You call your insurer's RSA helpline, and a technician arrives within 45–60 minutes to jump-start the battery or mount your spare wheel at no service charge.",
    whatToCheck:
      "Check the free towing distance limit (commonly 40 km to 100 km from the breakdown spot) and the maximum number of RSA callouts covered per policy year in your insurer's terms.",
    tip: "Using Roadside Assistance for a breakdown or towing generally does not count as an insurance claim and does not affect your No Claim Bonus (NCB).",
  },
  {
    id: "engine-protection",
    title: "Engine Protection",
    category: "Add-ons",
    icon: "cog",
    shortDescription: "Covers expensive engine and gearbox damage caused by waterlogging or oil leakage.",
    explanation:
      "Standard car insurance policies cover engine damage only if it is the direct result of an external collision—they exclude 'consequential damage' caused by driving through waterlogged streets (hydrostatic lock) or undercarriage oil/coolant leakage. The Engine Protection add-on specifically covers repair or replacement of internal engine parts, gearbox, and differential in these scenarios.",
    whyItMatters:
      "Engine and automatic gearbox overhauls are among the costliest repairs in modern cars, easily costing ₹60,000 to ₹2,50,000+. If you live in a city with heavy monsoon rains and waterlogged underpasses, this add-on is critical.",
    example:
      "During a sudden downpour, water enters the air intake of your sedan on a flooded road and stalls the engine. If the connecting rods or pistons are damaged, a standard policy may reject the internal engine bill as hydrostatic lock, whereas Engine Protection covers the repair.",
    whatToCheck:
      "If your car stalls in deep water, never try to crank or restart the engine repeatedly—doing so can worsen damage and violate policy precautions. Call Roadside Assistance to tow the car instead.",
    tip: "Engine Protection is especially important for low-slung sedans, turbo-petrol engines, automatic transmissions, and electric vehicle battery/motor assemblies (where EV-specific add-ons apply).",
  },
  {
    id: "return-to-invoice",
    title: "Return to Invoice",
    category: "Add-ons",
    icon: "receipt",
    shortDescription: "Bridges the gap between your car's depreciated IDV and its original on-road invoice price.",
    explanation:
      "If your car is stolen or declared a Total Loss, a standard comprehensive policy only pays up to the depreciated Insured Declared Value (IDV)—which is lower than what you originally paid and excludes road tax and registration charges. Return to Invoice (RTI) covers that gap and pays the full original on-road invoice price (or current replacement price of the same model), including road tax and registration fees.",
    whyItMatters:
      "The moment a new car leaves the showroom, its IDV is already 5% below the ex-showroom price, plus you lose the 10%–15% paid toward RTO road tax and registration. RTI ensures you can buy a brand-new replacement car without losing lakh of rupees to depreciation.",
    example:
      "You bought a car for an on-road price of ₹9,20,000, and in Year 2 its IDV is ₹6,80,000. If the car is stolen and unrecovered, a standard policy pays ₹6,80,000, leaving you ₹2,40,000 short. With Return to Invoice, the insurer reimburses the full ₹9,20,000 on-road invoice value.",
    whatToCheck:
      "Return to Invoice is generally offered only for newer cars (typically up to 3 years from initial registration). Check your policy wording to see exact eligibility and whether first-year insurance cost is included in the RTI payout.",
    tip: "Keep your original showroom purchase invoice and RTO tax receipt safely stored digitally, as insurers require them to process an RTI claim.",
  },
  {
    id: "personal-accident-cover",
    title: "Personal Accident Cover",
    category: "Coverage",
    icon: "user-check",
    shortDescription: "Mandatory ₹15 Lakh financial protection for the registered vehicle owner-driver.",
    explanation:
      "Compulsory Personal Accident (CPA) cover for the Owner-Driver is a statutory requirement mandated by IRDAI in India. It provides financial compensation of up to ₹15 Lakh to the registered owner of the car (or their legal nominee) in the event of accidental death or permanent total/partial disability while driving, mounting, or dismounting the insured vehicle.",
    whyItMatters:
      "While Third-Party cover protects other people on the road, Personal Accident cover ensures the car's owner-driver and their family have direct financial support in case of a severe road accident.",
    example:
      "If a registered car owner holds a CPA cover, a ₹15 Lakh benefit is active across their policy period. If you already own two vehicles in your name, you do not need to buy a separate CPA cover for the second car—a single ₹15 Lakh CPA cover suffices across multiple vehicles owned by the same individual.",
    whatToCheck:
      "Ensure the nominee name and relationship are filled in on your policy schedule. Also note that CPA is only valid if the registered owner holds a valid driving licence; you can also opt for paid Passenger PA cover to protect family members or co-passengers.",
    tip: "You can legally opt out of buying CPA cover on a renewal policy if you already have an existing ₹15 Lakh+ standalone Personal Accident policy or CPA cover on another vehicle registered in your name.",
  },
  {
    id: "claim-process",
    title: "Claim Process",
    category: "Claims",
    icon: "file-check",
    shortDescription: "Step-by-step workflow from reporting an accident to getting your car repaired.",
    explanation:
      "A motor insurance claim is the formal request you submit to your insurer to pay for vehicle repairs after an accident or loss. In India, claims work in two ways: Cashless Claims (where your car is repaired at an insurer's Network Garage and the insurer settles its share directly with the workshop) or Reimbursement Claims (where you repair the car at any non-network garage, pay the bill first, and submit invoices for reimbursement).",
    whyItMatters:
      "Knowing the right sequence—especially informing your insurer before dismantling or repairing the vehicle—prevents avoidable delays or claim disputes.",
    example:
      "After a minor bumper collision: (1) Take clear photos of the damage on the spot, (2) Intimate the insurer via app/helpline within 24–48 hours, (3) Drop the car at a Cashless Network Garage, (4) The insurer's surveyor inspects via video/in-person and approves the estimate, (5) You pay only your deductible and collect your repaired car.",
    whatToCheck:
      "Never authorize a workshop to start dismantling or repairing the car before the insurer's surveyor has inspected the damage and issued approval. For theft or third-party injury claims, a police FIR is mandatory.",
    tip: "Most insurers now use instant smartphone video self-inspection for minor dents and scratches, allowing repair approvals within a few hours.",
  },
  {
    id: "policy-renewal",
    title: "Policy Renewal",
    category: "Renewal",
    icon: "refresh",
    shortDescription: "Extending your car insurance before expiry to stay road-legal and protect your NCB.",
    explanation:
      "Policy renewal is the process of continuing your car insurance coverage before your current policy expires (usually every 12 months for Own Damage or Comprehensive plans). Renewing on time ensures continuous financial protection without any break-in period.",
    whyItMatters:
      "If you let your policy expire even by a single day, your car is uninsured during the gap, and the insurer may require a physical or video 'break-in inspection' before reactivating Own Damage cover. Worse, if the policy remains expired for more than 90 days, you lose your entire accumulated No Claim Bonus (NCB).",
    example:
      "Your policy expires on 31st October. By comparing quotes and renewing 15 days early (around 16th October), your new policy automatically starts on 1st November at 00:00 hrs—with zero physical inspection required and your 35% NCB intact.",
    whatToCheck:
      "You can renew with your existing insurer or switch to any new insurer at renewal time without losing your NCB. Always double-check that your previous policy number and NCB slab are entered accurately.",
    tip: "Setting reminders 45, 30, and 15 days before expiry gives you plenty of time to compare IDV and add-on prices across insurers without last-minute rush.",
  },
  {
    id: "cashless-garage",
    title: "Cashless Garage",
    category: "Claims",
    icon: "building",
    shortDescription: "An authorized workshop where the insurer pays the approved repair bill directly.",
    explanation:
      "A Cashless Garage is an automobile workshop that has a direct tie-up with your insurance company. When you get your car repaired at a cashless garage after an approved accident claim, the insurer pays its share of the repair invoice directly to the workshop—so you don't have to arrange large sums of cash upfront.",
    whyItMatters:
      "During a major repair costing ₹50,000 or ₹1,00,000, a cashless facility saves you from paying out of pocket and waiting weeks for reimbursement paperwork.",
    example:
      "Your total approved repair bill at a partner Maruti or Hyundai workshop in Kolkata is ₹35,000. Because it is a cashless garage and you have Zero Depreciation cover, the insurer transfers ₹34,000 directly to the workshop, and you simply pay the ₹1,000 compulsory deductible at the counter to take delivery.",
    whatToCheck:
      "'Cashless' does not mean '₹0 payable'. You still pay the compulsory deductible, any applicable part depreciation (if you don't have Zero Dep), and non-covered consumables.",
    tip: "Before buying a plan, check how many cashless garages the insurer has in your city and whether your preferred authorized brand service centre is on their list.",
  },
  {
    id: "network-garage",
    title: "Network Garage",
    category: "Claims",
    icon: "map-pin",
    shortDescription: "Pre-vetted workshops partnered with your insurer for quality repairs and direct billing.",
    explanation:
      "Network Garages are workshops—ranging from authorized brand dealerships (OEM workshops) to certified multi-brand service centres—that have signed service-level agreements with an insurance company regarding repair quality, genuine spare parts, agreed labour rates, and cashless claim settlement.",
    whyItMatters:
      "A wider garage network in your area means shorter towing distances, faster digital survey approvals, genuine parts usage, and seamless cashless billing.",
    example:
      "Insurer A has 38 network garages across Kolkata (including Salt Lake, Kasba, and Behala), while Insurer B has 21. Choosing an insurer that includes the authorized service centre near your home makes claim drop-offs far more convenient.",
    whatToCheck:
      "Verify whether the insurer's network list includes authorized manufacturer dealerships for your car's make—especially if your car is still under manufacturer warranty.",
    tip: "You are still allowed to get your car repaired at a non-network garage in an emergency, though the claim will be processed on a reimbursement basis rather than cashless.",
  },
  {
    id: "exclusions",
    title: "Exclusions",
    category: "Policy Terms",
    icon: "alert",
    shortDescription: "Specific situations and damages that a car insurance policy will not cover.",
    explanation:
      "Exclusions are the specific conditions, scenarios, or types of damage listed in your policy wording for which the insurance company will not pay a claim. Standard exclusions apply across motor insurance policies in India to prevent misuse and keep premiums fair.",
    whyItMatters:
      "Most claim rejections happen because car owners aren't aware of standard exclusions. Knowing what isn't covered helps you drive responsibly and pick the right add-ons where needed.",
    example:
      "Common exclusions include: driving without a valid driving licence, driving under the influence of alcohol or drugs, using a private car for commercial taxi hire, normal wear and tear (worn brake pads or clutch plates), electrical/mechanical breakdowns not caused by an accident, and consequential engine damage from cranking a waterlogged car (unless Engine Protect is added).",
    whatToCheck:
      "Always review the 'What is not covered / General Exclusions' summary before purchasing a policy, and check whether an add-on (like Zero Depreciation or Engine Protect) is needed to waive certain standard deductions.",
    tip: "Pre-existing dents or damages that were already on the car before the policy started (or noted during a break-in inspection) are also excluded from future claims.",
  },
  {
    id: "premium",
    title: "Premium",
    category: "Basics",
    icon: "wallet",
    shortDescription: "The yearly amount you pay to keep your car insurance policy active.",
    explanation:
      "Your car insurance premium is the total price you pay (typically once a year) to keep your policy active. A comprehensive premium is made up of four parts: Base Own Damage (OD) Premium + Selected Add-on Premiums − Discounts (like No Claim Bonus) + Mandatory Third-Party & Personal Accident Premium + 18% GST.",
    whyItMatters:
      "Understanding how your premium is built helps you see exactly what you are paying for—so you can save money through smart levers (like transferring your NCB) rather than cutting essential protection.",
    example:
      "A comprehensive quote of ₹8,420 might consist of: ₹4,300 Own Damage premium (after 35% NCB discount) + ₹1,150 Zero Dep add-on + ₹3,416 statutory Third-Party premium + 18% GST (minus package bundling adjustments).",
    whatToCheck:
      "Check whether the quoted price on screen includes or excludes 18% GST, and look at the itemized price breakdown before checkout.",
    tip: "On InsureDrive, all displayed plan prices include taxes upfront so there is no surprise jump at the payment screen.",
  },
  {
    id: "why-insurance-prices-differ",
    title: "Why Insurance Prices Differ",
    category: "Basics",
    icon: "scale",
    shortDescription: "Why two insurers quote different prices for the exact same car.",
    explanation:
      "While the Third-Party component of car insurance is fixed by IRDAI across all insurers, the Own Damage (OD) rate and add-on prices are 'de-tariffed'—meaning each insurance company prices them independently based on their own underwriting experience, claim ratios, and target vehicle segments.",
    whyItMatters:
      "A higher price doesn't automatically mean a better policy, and the lowest price isn't always the best deal. Price differences usually come down to differences in IDV, included add-ons, compulsory/voluntary deductibles, and local cashless garage networks.",
    example:
      "For the same 2022 Swift VXi, Insurer A quotes ₹8,420 (with ₹4.10L IDV, Zero Depreciation included, and 38 local garages) while Insurer B quotes ₹7,980 (with ₹3.85L IDV, no Zero Depreciation, and a ₹2,000 deductible). The ₹440 difference buys ₹25,000 more IDV and full Zero Dep cover.",
    whatToCheck:
      "When comparing two quotes side-by-side, always check four things: (1) Is the IDV the same? (2) Are Zero Depreciation and Roadside Assistance included? (3) What is the deductible at claim time? (4) How many cashless garages are in your city?",
    tip: "Use the side-by-side Compare view on the Plans page to spot these exact differences in seconds.",
  },
];

// =========================================================================
// ICON HELPER
// =========================================================================
function TopicIcon({ name, size = 18 }) {
  const props = { width: size, height: size, strokeWidth: 2 };
  switch (name) {
    case "car":
      return <Car {...props} />;
    case "shield":
      return <Shield {...props} />;
    case "shield-check":
      return <ShieldCheck {...props} />;
    case "layers":
      return <Layers {...props} />;
    case "sparkles":
      return <Sparkles {...props} />;
    case "award":
      return <Award {...props} />;
    case "indian-rupee":
      return <IndianRupee {...props} />;
    case "sliders":
      return <SlidersHorizontal {...props} />;
    case "wrench":
      return <Wrench {...props} />;
    case "cog":
      return <Cog {...props} />;
    case "receipt":
      return <Receipt {...props} />;
    case "user-check":
      return <UserCheck {...props} />;
    case "file-check":
      return <FileCheck2 {...props} />;
    case "refresh":
      return <RefreshCw {...props} />;
    case "building":
      return <Building2 {...props} />;
    case "map-pin":
      return <MapPin {...props} />;
    case "alert":
      return <AlertCircle {...props} />;
    case "wallet":
      return <Wallet {...props} />;
    case "scale":
      return <Scale {...props} />;
    case "compare":
      return <CompareIcon {...props} />;
    default:
      return <BookOpen {...props} />;
  }
}

// =========================================================================
// REUSABLE COMPONENT: InsuranceSearch
// =========================================================================
export function InsuranceSearch({ query, onQueryChange, totalCount }) {
  return (
    <div className="lm-search-wrap">
      <div className="lm-search-box">
        <Search className="lm-search-ic" width={18} height={18} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search insurance terms... (e.g. NCB, depreciation, IDV, claim, third party)"
          aria-label="Search insurance terms"
          className="lm-search-input"
        />
        {query && (
          <button
            type="button"
            className="lm-search-clear"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
          >
            <X width={15} height={15} />
          </button>
        )}
      </div>
      <div className="lm-search-meta">
        <span>
          Showing <b>{totalCount}</b> {totalCount === 1 ? "topic" : "topics"}
        </span>
      </div>
    </div>
  );
}

// =========================================================================
// REUSABLE COMPONENT: InsuranceCategoryFilter
// =========================================================================
export function InsuranceCategoryFilter({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="chips lm-cat-bar" role="tablist" aria-label="Filter by insurance category">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`chip ${isActive ? "on" : ""}`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

// =========================================================================
// REUSABLE COMPONENT: InsuranceTopicCard
// =========================================================================
export function InsuranceTopicCard({ topic, onSelect, featured = false }) {
  return (
    <article
      className={`glass lm-card ${featured ? "lm-card-featured" : ""}`}
      onClick={() => onSelect(topic)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(topic);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Learn more about ${topic.title}`}
    >
      <div className="lm-card-top">
        <span className="lm-card-ic" aria-hidden="true">
          <TopicIcon name={topic.icon} size={featured ? 20 : 18} />
        </span>
        <span className="lm-card-cat">{featured && topic.badge ? topic.badge : topic.category}</span>
      </div>

      <h3 className="lm-card-title">{topic.title}</h3>
      <p className="lm-card-desc">{topic.shortDescription}</p>

      <div className="lm-card-cta">
        <span>Learn more</span>
        <ArrowRight className="lm-card-arrow" width={15} height={15} aria-hidden="true" />
      </div>
    </article>
  );
}

// =========================================================================
// REUSABLE COMPONENT: InsuranceTermModal
// =========================================================================
export function InsuranceTermModal({ topic, onClose, onNavigateToPlans }) {
  // Close on Escape key & lock background scroll while open
  useEffect(() => {
    if (!topic) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [topic, onClose]);

  if (!topic) return null;

  return (
    <div
      className="lm-modal-scrim on"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lm-modal-title"
    >
      <div className="lm-modal-window">
        {/* Top Close Button */}
        <button
          type="button"
          className="lm-modal-close"
          onClick={onClose}
          aria-label="Close explanation window"
        >
          <X width={18} height={18} />
        </button>

        {/* Modal Header */}
        <div className="lm-modal-head">
          <div className="lm-modal-kicker">
            <span className="lm-modal-ic">
              <TopicIcon name={topic.icon} size={20} />
            </span>
            <span className="lm-modal-cat">{topic.category}</span>
          </div>
          <h2 id="lm-modal-title">{topic.title}</h2>
          <p className="lm-modal-sub">{topic.shortDescription}</p>
        </div>

        {/* Scrollable Content Body */}
        <div className="lm-modal-body">
          {/* 1. Simple Explanation */}
          <div className="lm-section lm-section-lead">
            <div className="lm-sec-label">In plain language</div>
            <p className="lm-sec-text">{topic.explanation}</p>
          </div>

          {/* 2. Why It Matters */}
          <div className="lm-section">
            <div className="lm-sec-label">Why it matters</div>
            <p className="lm-sec-text">{topic.whyItMatters}</p>
          </div>

          {/* 3. Example */}
          <div className="lm-section lm-section-example">
            <div className="lm-sec-label">Real-world example</div>
            <p className="lm-sec-text">{topic.example}</p>
          </div>

          {/* 4. What to Check in Your Policy */}
          <div className="lm-section">
            <div className="lm-sec-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 width={15} height={15} style={{ color: "var(--t-brown-900)" }} />
              <span>What to check in your policy</span>
            </div>
            <p className="lm-sec-text">{topic.whatToCheck}</p>
          </div>

          {/* 5. Optional Good to Know Tip */}
          {topic.tip && (
            <div className="lm-section lm-section-tip">
              <div className="lm-sec-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Lightbulb width={15} height={15} style={{ color: "var(--t-warn)" }} />
                <span>Good to know</span>
              </div>
              <p className="lm-sec-text">{topic.tip}</p>
            </div>
          )}

          <p className="lm-disclaimer">
            Note: Specific coverage terms, add-on eligibility, and claim conditions can vary by insurer. Always review your policy schedule and wording for exact details.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="lm-modal-foot">
          <button type="button" className="btn ghost sm" onClick={onClose}>
            Done reading
          </button>
          {onNavigateToPlans && (
            <button
              type="button"
              className="btn sm"
              onClick={() => {
                onClose();
                onNavigateToPlans();
              }}
            >
              See how this applies to my plans →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN PAGE COMPONENT: LearnMorePage
// =========================================================================
export function LearnMorePage({ car, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState(null);

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return INSURANCE_TOPICS.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [
        item.title,
        item.category,
        item.shortDescription,
        item.explanation,
        item.whyItMatters,
        item.example,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedCategory, searchQuery]);

  const isFiltering = searchQuery.trim().length > 0 || selectedCategory !== "All";

  return (
    <div className="view on lm-page">
      {/* Page Hero Header */}
      <section className="glass hero lm-hero">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span className="lm-kicker-tag">Insurance Guide · Plain-English Handbook</span>
          </div>
          <h1>Understand your car insurance.</h1>
          <p style={{ maxWidth: "62ch" }}>
            Insurance can be confusing. Learn what your policy actually means, what you're paying for, and which benefits matter for your car.
          </p>
        </div>

        <div className="lm-hero-aside">
          <div className="lm-hero-stat">
            <b>20</b>
            <span>Key concepts explained clearly</span>
          </div>
          <div className="lm-hero-actions">
            <button type="button" className="btn ghost sm" onClick={() => onNavigate("plans")}>
              Compare plans for {car?.plate || "your car"} →
            </button>
          </div>
        </div>
      </section>

      {/* Featured Section: "Most people check these first" */}
      {!isFiltering && (
        <section className="lm-featured-section" aria-labelledby="lm-featured-heading">
          <div className="lm-section-bar">
            <div>
              <span className="lm-eyebrow">Essential starting points</span>
              <h2 id="lm-featured-heading" style={{ fontSize: "clamp(19px, 2.2vw, 23px)", marginTop: 2 }}>
                Most people check these first
              </h2>
            </div>
            <span className="mut" style={{ fontSize: 13.5 }}>
              Click any card to open a clear breakdown
            </span>
          </div>

          <div className="lm-featured-grid">
            {FEATURED_TOPICS.map((topic) => (
              <InsuranceTopicCard
                key={topic.id}
                topic={topic}
                onSelect={setActiveTopic}
                featured
              />
            ))}
          </div>
        </section>
      )}

      {/* Search & Category Filter Bar */}
      <section className="lm-controls-section" aria-label="Search and filter insurance topics">
        <div className="lm-controls-header">
          <div>
            <h2>All insurance topics</h2>
            <p className="mut" style={{ fontSize: 14.5 }}>
              Browse by category or search for a specific policy term, add-on, or claim rule.
            </p>
          </div>
        </div>

        <InsuranceSearch
          query={searchQuery}
          onQueryChange={setSearchQuery}
          totalCount={filteredTopics.length}
        />

        <InsuranceCategoryFilter
          categories={INSURANCE_CATEGORIES}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <section className="lm-grid" aria-label="Insurance topics">
          {filteredTopics.map((topic) => (
            <InsuranceTopicCard
              key={topic.id}
              topic={topic}
              onSelect={setActiveTopic}
            />
          ))}
        </section>
      ) : (
        <div className="glass lm-empty">
          <h3>No matching insurance terms found</h3>
          <p className="mut" style={{ maxWidth: 440, margin: "6px auto 16px" }}>
            We couldn't find any topic matching "{searchQuery}" in {selectedCategory === "All" ? "all categories" : selectedCategory}.
          </p>
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
          >
            Reset search &amp; filters
          </button>
        </div>
      )}

      {/* Floating Information Window (Modal) */}
      <InsuranceTermModal
        topic={activeTopic}
        onClose={() => setActiveTopic(null)}
        onNavigateToPlans={() => onNavigate("plans")}
      />
    </div>
  );
}
