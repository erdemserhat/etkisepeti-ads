import Image from "next/image";
import Link from "next/link";
import { PAGE_CONTENT_GUTTER } from "@/lib/pageLayout";

export function SiteHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b border-neutral-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
      style={{ height: "var(--header-height)" }}
    >
      <div className={`relative h-full ${PAGE_CONTENT_GUTTER}`}>
        <div className="grid h-full grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-center gap-2 md:hidden">
          <a
            href="#platform-section"
            aria-label="Hizmetler listesine git"
            className="flex h-8 w-8 items-center justify-center justify-self-start rounded-[0.75rem] bg-[#f6f7fc] text-[#556a96] outline-none transition-colors hover:bg-[#eef1fb] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <i className="fa-solid fa-bars text-[0.92rem]" aria-hidden />
          </a>

          <Link
            href="/"
            className="flex min-w-0 items-center justify-center gap-1.5 rounded-2xl px-1 py-0.5 outline-none ring-ring transition focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Image
              src="/icon.png"
              alt="Etkisepeti logosu"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 object-contain"
              priority
            />

            <span className="min-w-0 truncate text-[1.52rem] leading-none font-black tracking-[-0.06em] text-neutral-900 lowercase sm:text-[1.68rem]">
              etkisepeti
            </span>
          </Link>

          <div aria-hidden className="h-8 w-8 justify-self-end" />
        </div>

        <div className="hidden h-full items-center md:flex">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3 rounded-2xl px-2 py-1 outline-none ring-ring transition focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Image
              src="/icon.png"
              alt="Etkisepeti logosu"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 object-contain transition duration-300 group-hover:-translate-y-0.5"
              priority
            />

            <span className="min-w-0 truncate text-[1.65rem] leading-none font-black tracking-[-0.05em] text-neutral-900 lowercase transition-colors group-hover:text-neutral-700 lg:text-[1.82rem]">
              etkisepeti
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
