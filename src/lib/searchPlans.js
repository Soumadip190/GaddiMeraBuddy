/**
 * Pure search function for InsureDrive plans.
 * 
 * Rules:
 * - Match every query word against insurer, plan name, badge and highlights (p.hl), case-insensitive.
 * - Support numeric intent ("under 8500" filters by getPrice(p) <= 8500). Use getPrice(p), not p.premium.
 * - Result shape: { id, label: p.name, description: `${p.insurer} · ₹${price}/year`, tag: p.badge, plan: p }.
 * - The sponsored plan must never outrank an equally relevant organic plan, and always shows a "Sponsored" tag.
 * - An empty query returns all plans in their current order.
 */
export function searchPlans(plans = [], query = "", getPrice = (p) => p.premium) {
  if (!plans || !Array.isArray(plans)) return [];

  const trimmed = (query || "").trim();

  // Helper to construct output item
  const mapToResult = (p, isSponsoredBadge = false) => {
    const priceVal = getPrice ? getPrice(p) : p.premium;
    const formattedPrice = Number(priceVal || 0).toLocaleString("en-IN");
    return {
      id: p.id,
      label: p.name,
      description: `${p.insurer} · ₹${formattedPrice}/year`,
      tag: isSponsoredBadge || p.sponsored ? "Sponsored" : p.badge,
      plan: p,
      isSponsored: !!p.sponsored
    };
  };

  if (!trimmed) {
    return plans.map((p) => mapToResult(p));
  }

  // Parse numeric intent (e.g. "under 8500", "below 9000", "< 8000")
  let maxPrice = null;
  const underMatch = trimmed.match(/(?:under|below|<|<=)\s*₹?\s*(\d+)/i);
  if (underMatch) {
    maxPrice = parseInt(underMatch[1], 10);
  }

  // Extract non-numeric words (remove the "under XXXX" part from word matching if matched)
  let cleanedForWords = trimmed;
  if (underMatch) {
    cleanedForWords = cleanedForWords.replace(underMatch[0], " ").trim();
  }

  const words = cleanedForWords
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const matched = plans.filter((p) => {
    // Check numeric constraint if present
    if (maxPrice !== null) {
      const curPrice = getPrice ? getPrice(p) : p.premium;
      if (curPrice > maxPrice) {
        return false;
      }
    }

    // If query was only a numeric condition like "under 8500"
    if (words.length === 0) {
      return true;
    }

    // Match every word against insurer, name, badge, and highlights
    const searchableCorpus = [
      p.insurer || "",
      p.name || "",
      p.badge || "",
      ...(p.hl || [])
    ]
      .join(" ")
      .toLowerCase();

    return words.every((word) => searchableCorpus.includes(word));
  });

  // Ranking:
  // - Organic plans preserve or rank ahead of sponsored plan
  // - "The sponsored plan must never outrank an equally relevant organic plan"
  // If relevance is equal (both matched), keep organic plans ahead of sponsored ones.
  const organic = matched.filter((p) => !p.sponsored);
  const sponsored = matched.filter((p) => !!p.sponsored);

  const sortedPlans = [...organic, ...sponsored];

  return sortedPlans.map((p) => mapToResult(p));
}
