import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryServiceCard } from "@/components/CategoryServiceCard";
import { ALL_KEY, PlatformHeroTabs } from "@/components/PlatformHeroTabs";
import { fetchPlatform } from "@/lib/etkisepeti-api";
import { getEtkisepetiInternalKey } from "@/lib/env";
import {
  flattenCategoriesWithActions,
  type CategoryWithAction,
} from "@/lib/platform-utils";
import { PAGE_CONTENT_GUTTER } from "@/lib/pageLayout";

/** Shown under every platform hero title (not API `description`). */
const PLATFORM_HERO_TAGLINE = "Etkisepeti Profesyonel Hizmetleri";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ action?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const key = getEtkisepetiInternalKey();
  if (!key) {
    return { title: "Platformlar" };
  }
  try {
    const platform = await fetchPlatform(slug);
    if (!platform) return { title: "Bulunamadı" };
    return {
      title: platform.name,
      description: PLATFORM_HERO_TAGLINE,
    };
  } catch {
    return { title: "Platformlar" };
  }
}

function resolveSelectedKey(
  actionParam: string | undefined,
  actionKeys: Set<string>
): string {
  if (!actionParam || actionParam === ALL_KEY) return ALL_KEY;
  if (actionKeys.has(actionParam)) return actionParam;
  return ALL_KEY;
}

export default async function PlatformPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { action: actionParam } = await searchParams;
  const key = getEtkisepetiInternalKey();

  if (!key) {
    return (
      <main
        id="main-content"
        className={`flex flex-1 flex-col py-10 ${PAGE_CONTENT_GUTTER}`}
      >
        <p className="max-w-xl text-sm text-neutral-600">
          <code className="rounded bg-neutral-200 px-1 py-0.5 text-foreground">
            ETKISEPETI_INTERNAL_KEY
          </code>{" "}
          değerini{" "}
          <code className="rounded bg-neutral-200 px-1 py-0.5 text-foreground">
            .env
          </code>{" "}
          dosyasında ayarlayın.
        </p>
      </main>
    );
  }

  let platform;
  let loadError: string | null = null;
  try {
    platform = await fetchPlatform(slug);
  } catch (e) {
    loadError = e instanceof Error ? e.message : "İstek başarısız oldu";
  }

  if (loadError) {
    return (
      <main
        id="main-content"
        className={`flex flex-1 flex-col py-10 ${PAGE_CONTENT_GUTTER}`}
      >
        <p className="text-sm text-error" role="alert">
          {loadError}
        </p>
      </main>
    );
  }

  if (!platform) {
    notFound();
  }

  const actions = [...platform.actions].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );
  const actionKeys = new Set(actions.map((a) => a.key));
  const selectedKey = resolveSelectedKey(actionParam, actionKeys);

  let categories: CategoryWithAction[];
  if (selectedKey === ALL_KEY) {
    categories = flattenCategoriesWithActions(actions);
  } else {
    const selectedAction = actions.find((a) => a.key === selectedKey);
    categories = (selectedAction?.categories ?? []).map((c) => ({
      ...c,
      actionKey: selectedKey,
    }));
    categories.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  categories = categories.filter((c) => c.hasPackage);

  const accentColor = platform.colorCode || "#0b59d0";

  return (
    <main
      id="main-content"
      className={`flex flex-1 flex-col gap-6 pb-10 pt-4 md:gap-8 md:pb-12 md:pt-6 ${PAGE_CONTENT_GUTTER}`}
    >
      <section
        className="overflow-hidden rounded-2xl bg-neutral-900 px-4 py-4 text-neutral-50 shadow-xl sm:rounded-3xl sm:px-7 sm:py-8"
        aria-labelledby="platform-hero-title"
      >
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl text-white shadow-inner sm:h-[4.5rem] sm:w-[4.5rem] sm:rounded-2xl sm:text-4xl"
            style={{ backgroundColor: accentColor }}
            aria-hidden
          >
            <i className={platform.iconClass} />
          </span>
          <div className="min-w-0 flex-1">
            <h1
              id="platform-hero-title"
              className="text-lg font-bold leading-snug tracking-tight sm:text-2xl md:text-3xl sm:leading-tight"
            >
              {platform.title}
            </h1>
            <p className="mt-1 text-xs leading-snug text-neutral-300 sm:mt-2 sm:text-base sm:leading-relaxed">
              {PLATFORM_HERO_TAGLINE}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-neutral-700/80 pt-4 sm:mt-8 sm:pt-6">
          <PlatformHeroTabs
            platformSlug={platform.slug}
            actions={actions}
            selectedKey={selectedKey}
          />
        </div>
      </section>

      <section aria-labelledby="categories-grid-heading">
        <h2 id="categories-grid-heading" className="sr-only">
          Hizmet kategorileri
        </h2>
        {categories.length === 0 ? (
          <p className="text-sm text-neutral-600">
            Bu görünümde kategori yok.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {categories.map((cat) => (
              <li key={cat.id}>
                <CategoryServiceCard category={cat} accentColor={accentColor} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
