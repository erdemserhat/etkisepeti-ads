import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryServiceCard } from "@/components/CategoryServiceCard";
import { ALL_KEY, PlatformHeroTabs } from "@/components/PlatformHeroTabs";
import {
  PlatformMobileBanner,
  PlatformSidebarCard,
} from "@/components/PlatformSidebarCard";
import { fetchPlatform } from "@/lib/etkisepeti-api";
import { getEtkisepetiInternalKey } from "@/lib/env";
import {
  flattenCategoriesWithActions,
  type CategoryWithAction,
} from "@/lib/platform-utils";
import { PAGE_CONTENT_GUTTER } from "@/lib/pageLayout";

/** Shown under every platform hero title (not API `description`). */
const PLATFORM_HERO_TAGLINE = "Hizmet kategorileri ve yönlendirmeler";

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
      description: platform.description || PLATFORM_HERO_TAGLINE,
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
  const selectedAction =
    selectedKey === ALL_KEY
      ? null
      : actions.find((action) => action.key === selectedKey) ?? null;

  let categories: CategoryWithAction[];
  if (selectedKey === ALL_KEY) {
    categories = flattenCategoriesWithActions(actions);
  } else {
    categories = (selectedAction?.categories ?? []).map((c) => ({
      ...c,
      actionKey: selectedKey,
      actionName: selectedAction?.name ?? "",
    }));
    categories.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  categories = categories.filter((c) => c.hasPackage);

  const accentColor = platform.colorCode || "#0b59d0";
  const heroTitle = `${platform.name} Hizmetleri`;

  return (
    <main
      id="main-content"
      className="relative flex flex-1 flex-col text-neutral-100"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[240px] overflow-hidden lg:h-[300px]"
        style={{
          background:
            "linear-gradient(135deg, #141425 0%, #1a1c31 52%, #18192a 100%)",
        }}
      >
        <span
          className="absolute -left-20 top-10 block h-48 w-48 rounded-full blur-3xl"
          style={{ backgroundColor: accentColor, opacity: 0.16 }}
        />
        <span className="absolute -right-16 top-16 block h-56 w-56 rounded-full bg-[#2d7bff]/10 blur-3xl" />
      </span>

      <div
        className={`relative z-[1] flex flex-1 flex-col pb-10 pt-4 lg:pb-16 lg:pt-6 ${PAGE_CONTENT_GUTTER}`}
      >
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,17.5rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-height)+1rem)]">
              <PlatformSidebarCard
                platform={platform}
                categoryCount={categories.length}
                title={heroTitle}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <h1 className="sr-only">{heroTitle}</h1>

            <div className="-mx-4 -mt-4 mb-4 md:-mx-5 lg:hidden">
              <PlatformMobileBanner
                platform={platform}
                categoryCount={categories.length}
                title={heroTitle}
              />
            </div>

            <PlatformHeroTabs
              platformSlug={platform.slug}
              actions={actions}
              selectedKey={selectedKey}
              accentColor={accentColor}
            />

            <section aria-labelledby="categories-grid-heading">
              <h2 id="categories-grid-heading" className="sr-only">
                Hizmet kategorileri
              </h2>
              {categories.length === 0 ? (
                <p className="text-sm text-neutral-600">
                  Bu görünümde kategori yok.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <CategoryServiceCard
                        category={cat}
                        accentColor={accentColor}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
