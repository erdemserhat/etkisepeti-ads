import Image from "next/image";
import Link from "next/link";
import { PAGE_CONTENT_GUTTER } from "@/lib/pageLayout";

const PHONE_DISPLAY = "+90 554 712 34 07";
const PHONE_TEL = "+905547123407";
const SUPPORT_EMAIL = "destek@etkisepeti.com";
const WHATSAPP_HREF = "https://wa.me/905547123407";
const TELEGRAM_HREF = "https://t.me/etkisepeti";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full">
      <div className={PAGE_CONTENT_GUTTER}>
        <div
          className="mb-0 h-1 min-h-[4px] w-full rounded-full bg-brand-primary"
          aria-hidden
        />
        <div className="w-full overflow-hidden rounded-t-3xl bg-neutral-900 shadow-xl">
          <div className="flex w-full flex-col items-center gap-5 px-5 py-7 text-center sm:px-8 sm:py-8">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2.5 rounded-lg outline-none ring-offset-2 ring-offset-neutral-900 focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <Image
                src="/favicon.svg"
                alt=""
                width={40}
                height={40}
                className="h-9 w-9 brightness-0 invert"
              />
              <span className="text-xl font-bold tracking-tight md:text-2xl">
                <span className="text-neutral-50">Etki</span>
                <span className="text-brand-primary">sepeti</span>
              </span>
            </Link>

            <h2 className="text-lg font-semibold tracking-tight text-neutral-50">
              Etkisepeti
            </h2>

            <div className="flex w-full max-w-md flex-col items-center gap-3 text-sm text-neutral-300">
              <a
                href={`tel:${PHONE_TEL}`}
                className="rounded-md outline-none transition hover:text-neutral-50 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
              >
                {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="rounded-md outline-none transition hover:text-neutral-50 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
              >
                {SUPPORT_EMAIL}
              </a>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#20bd5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
                >
                  <i className="fa-brands fa-whatsapp text-lg" aria-hidden />
                  Canlı destek
                </a>
                <a
                  href={TELEGRAM_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#229ED9] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f8fc7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#229ED9]"
                >
                  <i className="fa-brands fa-telegram text-lg" aria-hidden />
                  @etkisepeti
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-50/10 px-5 py-3 text-center sm:px-8">
            <p className="text-xs text-neutral-400">
              © 2017–{year} Etkisepeti. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
