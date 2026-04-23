import { FaqSection } from "@/components/FaqSection";
import { HomeHeroBanner } from "@/components/HomeHeroBanner";
import { PlatformCard } from "@/components/PlatformCard";
import { TrustBadgesBanner } from "@/components/TrustBadgesBanner";
import { fetchPlatforms } from "@/lib/etkisepeti-api";
import { filterHomePlatforms } from "@/lib/platform-utils";
import { getEtkisepetiInternalKey } from "@/lib/env";
import { PAGE_CONTENT_GUTTER } from "@/lib/pageLayout";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
          içinde tanımlayın (örnek için{" "}
          <code className="rounded bg-neutral-200 px-1 py-0.5 text-foreground">
            .env.example
          </code>
          ).
        </p>
      </main>
    );
  }

  let platforms;
  let error: string | null = null;
  try {
    platforms = filterHomePlatforms(await fetchPlatforms());
  } catch (e) {
    error = e instanceof Error ? e.message : "İstek tamamlanamadı";
  }

  if (error) {
    return (
      <main
        id="main-content"
        className={`flex flex-1 flex-col py-10 ${PAGE_CONTENT_GUTTER}`}
      >
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col gap-7 pb-6 pt-4 md:gap-8 md:pb-8 md:pt-3"
    >
      <div className={PAGE_CONTENT_GUTTER}>
        <div className="flex flex-col gap-2 md:gap-2.5">
          <HomeHeroBanner />
          <TrustBadgesBanner />
        </div>
      </div>

      <section
        id="platform-section"
        aria-label="Platform listesi"
        className="w-full scroll-mt-[calc(var(--header-height)+0.75rem)]"
      >
        <div className={PAGE_CONTENT_GUTTER}>
          <ul
            id="platform-grid"
            className="mx-auto flex w-full max-w-[84rem] flex-wrap justify-center gap-4 sm:gap-5"
          >
            {platforms!.map((p) => (
              <li
                key={p.id}
                className="min-w-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.833rem)] lg:w-[calc(25%-0.9375rem)] xl:w-[calc(20%-1rem)]"
              >
                <PlatformCard platform={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className={PAGE_CONTENT_GUTTER}>
        <FaqSection />
      </div>
    </main>
  );
}
