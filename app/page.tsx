import { FaqSection } from "@/components/FaqSection";
import { HomeHeroBanner } from "@/components/HomeHeroBanner";
import { PlatformCard } from "@/components/PlatformCard";
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
      className={`flex flex-1 flex-col gap-7 pb-6 pt-4 md:gap-8 md:pb-8 md:pt-3 ${PAGE_CONTENT_GUTTER}`}
    >
      <HomeHeroBanner />

      <section
        id="platform-section"
        aria-label="Platform listesi"
        className="scroll-mt-[calc(var(--header-height)+0.75rem)]"
      >
        <ul
          id="platform-grid"
          className="mx-auto grid w-full max-w-[84rem] grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6"
        >
          {platforms!.map((p) => (
            <li key={p.id} className="min-w-0">
              <PlatformCard platform={p} />
            </li>
          ))}
        </ul>
      </section>
      <FaqSection />
    </main>
  );
}
