import Image from "next/image";
import Link from "next/link";
import { PAGE_CONTENT_GUTTER } from "@/lib/pageLayout";

export function SiteHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b border-border bg-neutral-50/95 backdrop-blur"
      style={{ height: "var(--header-height)" }}
    >
      <div
        className={`flex h-full items-center justify-between gap-4 ${PAGE_CONTENT_GUTTER}`}
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <Image
            src="/favicon.svg"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 md:h-10 md:w-10"
            priority
          />
          <span className="truncate text-xl font-bold tracking-tight text-brand-primary lowercase md:text-2xl">
            etkisepeti
          </span>
        </Link>
      </div>
    </header>
  );
}
