import { FaqSection } from "@/components/FaqSection";
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
          Set{" "}
          <code className="rounded bg-neutral-200 px-1 py-0.5 text-foreground">
            ETKISEPETI_INTERNAL_KEY
          </code>{" "}
          in{" "}
          <code className="rounded bg-neutral-200 px-1 py-0.5 text-foreground">
            .env
          </code>{" "}
          (see{" "}
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
    error = e instanceof Error ? e.message : "Request failed";
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
      className={`flex flex-1 flex-col gap-6 py-6 md:py-8 ${PAGE_CONTENT_GUTTER}`}
    >
      <ul
        className="mx-auto grid w-full place-content-center justify-center gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,10rem),10rem))] sm:[grid-template-columns:repeat(auto-fill,minmax(10.5rem,10.5rem))]"
      >
        {platforms!.map((p) => (
          <li key={p.id} className="min-w-0">
            <PlatformCard platform={p} />
          </li>
        ))}
      </ul>
      <FaqSection />
    </main>
  );
}
