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

export type CategoryWithAction = PlatformCategory & {
  actionKey: string;
  actionName: string;
};

const ACTION_ICON_CLASS: Record<string, string> = {
  follow: "fa-solid fa-user",
  like: "fa-solid fa-heart",
  view: "fa-solid fa-eye",
  engagement: "fa-solid fa-chart-line",
};

export function getCategoryIconClass(actionKey: string): string {
  return ACTION_ICON_CLASS[actionKey] ?? "fa-solid fa-layer-group";
}

type IconMatchRule = { terms: string[]; icon: string };

const CATEGORY_ICON_RULES: IconMatchRule[] = [
  {
    terms: [
      "follow",
      "follower",
      "followers",
      "takip",
      "takipci",
      "abone",
      "subscriber",
      "member",
    ],
    icon: "fa-solid fa-user",
  },
  {
    terms: ["like", "likes", "begeni", "favorite", "favourite", "heart"],
    icon: "fa-solid fa-heart",
  },
  {
    terms: ["view", "views", "izlen", "watch", "stream", "play", "dinlen"],
    icon: "fa-solid fa-play",
  },
  {
    terms: ["save", "saved", "kaydet", "bookmark"],
    icon: "fa-solid fa-bookmark",
  },
  {
    terms: ["comment", "comments", "yorum", "reply"],
    icon: "fa-solid fa-comment",
  },
  {
    terms: ["share", "shares", "paylas", "paylasim"],
    icon: "fa-solid fa-share-nodes",
  },
  {
    terms: ["repost", "retweet", "yeniden"],
    icon: "fa-solid fa-retweet",
  },
  {
    terms: ["download", "downloads", "indir", "indirme"],
    icon: "fa-solid fa-download",
  },
];

function normalizeForMatch(value?: string | null): string {
  return (value || "")
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u");
}

export function resolveCategoryIconClass(
  categoryName: string,
  actionKey?: string,
  actionName?: string
): string {
  const fromName = normalizeForMatch(categoryName);
  const matchedByName = CATEGORY_ICON_RULES.find((rule) =>
    rule.terms.some((term) => fromName.includes(term))
  );
  if (matchedByName) return matchedByName.icon;

  for (const source of [actionKey, actionName]) {
    if (!source) continue;
    const normalized = normalizeForMatch(source);
    const matched = CATEGORY_ICON_RULES.find((rule) =>
      rule.terms.some((term) => normalized.includes(term))
    );
    if (matched) return matched.icon;
  }

  if (actionKey && ACTION_ICON_CLASS[actionKey]) {
    return ACTION_ICON_CLASS[actionKey];
  }

  return "fa-solid fa-layer-group";
}

export function flattenCategoriesWithActions(
  actions: PlatformAction[]
): CategoryWithAction[] {
  const sorted = [...actions].sort((a, b) => a.orderIndex - b.orderIndex);
  const out: CategoryWithAction[] = [];
  for (const action of sorted) {
    for (const cat of action.categories) {
      out.push({
        ...cat,
        actionKey: action.key,
        actionName: action.name,
      });
    }
  }
  return out.sort((a, b) => a.orderIndex - b.orderIndex);
}
