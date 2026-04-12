import type {
  PlatformAction,
  PlatformCategory,
  PlatformListItem,
} from "./types/platform";

/** Home grid: only these networks, in this order (`x` fills the Twitter slot if `twitter` is missing). */
const HOME_PLATFORM_SLUG_ORDER: (string | string[])[] = [
  "instagram",
  ["twitter", "x"],
  "tiktok",
  "facebook",
  "youtube",
];

export function filterHomePlatforms(
  items: PlatformListItem[]
): PlatformListItem[] {
  const bySlug = new Map(items.map((p) => [p.slug, p]));
  const out: PlatformListItem[] = [];
  for (const def of HOME_PLATFORM_SLUG_ORDER) {
    const slugs = Array.isArray(def) ? def : [def];
    const found = slugs.map((s) => bySlug.get(s)).find(Boolean);
    if (found) out.push(found);
  }
  return out;
}

export type CategoryWithAction = PlatformCategory & { actionKey: string };

const ACTION_ICON_CLASS: Record<string, string> = {
  follow: "fa-solid fa-user",
  like: "fa-solid fa-heart",
  view: "fa-solid fa-eye",
  engagement: "fa-solid fa-chart-line",
};

export function getCategoryIconClass(actionKey: string): string {
  return ACTION_ICON_CLASS[actionKey] ?? "fa-solid fa-layer-group";
}

export function flattenCategoriesWithActions(
  actions: PlatformAction[]
): CategoryWithAction[] {
  const sorted = [...actions].sort((a, b) => a.orderIndex - b.orderIndex);
  const out: CategoryWithAction[] = [];
  for (const action of sorted) {
    for (const cat of action.categories) {
      out.push({ ...cat, actionKey: action.key });
    }
  }
  return out.sort((a, b) => a.orderIndex - b.orderIndex);
}
