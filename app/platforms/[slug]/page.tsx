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
      className={`flex flex-1 flex-col gap-6 pb-10 pt-4 md:gap-8 md:pb-12 md:pt-6 ${PAGE_CONTENT_GUTTER}`}
    >
      <section
        className="relative isolate overflow-hidden rounded-[2rem] border border-neutral-800/10 bg-[#131526] px-4 py-5 text-neutral-50 shadow-[0_32px_80px_-46px_rgba(15,23,42,0.8)] sm:px-6 sm:py-6 md:px-7 md:py-8"
        aria-labelledby="platform-hero-title"
      >
        <span className="platform-card__texture pointer-events-none absolute inset-0 opacity-[0.09]" />
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(255,255,255,0.1),transparent_28%)]" />
        <span
          className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full blur-3xl"
          style={{ backgroundColor: accentColor, opacity: 0.2 }}
        />
        <span className="pointer-events-none absolute -right-14 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-5">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <span
              className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.08] text-4xl text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-sm sm:h-24 sm:w-24 sm:text-5xl"
              aria-hidden
            >
              <span
                className="absolute inset-3 rounded-[1.2rem]"
                style={{ backgroundColor: accentColor }}
              />
              <span className="platform-card__texture absolute inset-3 rounded-[1.2rem] opacity-30" />
              <i
                className={`${platform.iconClass} relative z-[1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.24)]`}
              />
            </span>
            <div className="min-w-0 flex-1">
              <h1
                id="platform-hero-title"
                className="mt-2 text-2xl font-black leading-tight tracking-tight text-white sm:text-[2.2rem] md:text-[2.85rem]"
              >
                {heroTitle}
              </h1>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-2 backdrop-blur-sm">
            <PlatformHeroTabs
              platformSlug={platform.slug}
              actions={actions}
              selectedKey={selectedKey}
              accentColor={accentColor}
            />
          </div>
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
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
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
