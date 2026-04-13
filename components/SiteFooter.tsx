import Image from "next/image";
import Link from "next/link";
import { PAGE_CONTENT_GUTTER } from "@/lib/pageLayout";

const PHONE_LOCAL_DISPLAY = "0 554 712 34 07";
const WHATSAPP_HREF = "https://wa.me/905547123407";
const TELEGRAM_DISPLAY = "@etkisepeti";
const TELEGRAM_HREF = "https://t.me/etkisepeti";
const SUPPORT_EMAIL = "destek@etkisepeti.com";

const SECONDARY_CONTACTS = [
  {
    label: "WhatsApp",
    value: PHONE_LOCAL_DISPLAY,
    href: WHATSAPP_HREF,
    iconClass: "fa-brands fa-whatsapp",
    hoverClass: "hover:border-[#25D366]/40 hover:bg-[#25D366]/12",
  },
  {
    label: "Telegram",
    value: TELEGRAM_DISPLAY,
    href: TELEGRAM_HREF,
    iconClass: "fa-brands fa-telegram",
    hoverClass: "hover:border-[#229ED9]/40 hover:bg-[#229ED9]/12",
  },
  {
    label: "E-posta",
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    iconClass: "fa-regular fa-envelope",
    hoverClass: "hover:border-white/20 hover:bg-white/8",
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full pt-8">
      <div className="relative overflow-hidden bg-[#10152C] pt-6">
        <div
          className="absolute inset-x-0 top-0 h-1 bg-brand-primary"
          aria-hidden
        />

        <div className={`relative z-10 pb-6 ${PAGE_CONTENT_GUTTER}`}>
          <div className="bg-[#10152C] px-4 py-7 sm:px-6 md:rounded-t-[2rem] md:px-8 md:py-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Link
                    href="/"
                    className="flex shrink-0 items-center gap-2.5 rounded-lg outline-none ring-offset-2 ring-offset-[#10152C] focus-visible:ring-2 focus-visible:ring-brand-accent"
                  >
                    <Image
                      src="/favicon.svg"
                      alt=""
                      width={48}
                      height={48}
                      className="h-9 w-9 brightness-0 invert md:h-11 md:w-11"
                    />
                  </Link>
                  <span
                    className="truncate text-[1.45rem] font-bold tracking-tight text-white md:text-[1.8rem]"
                  >
                    Etkisepeti
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {SECONDARY_CONTACTS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("https://") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("https://")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/88 outline-none transition focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#10152C] ${item.hoverClass}`}
                  >
                    <i className={item.iconClass} aria-hidden />
                    <span className="text-white/65">{item.label}</span>
                    <span className="font-medium text-white">{item.value}</span>
                  </a>
                ))}
              </div>

              <div className="border-t border-white/10 pt-5 text-left">
                <p className="text-xs text-[#7E8298] md:text-sm">
                  © Copyright 2017 - {year}. Tüm Hakları Saklıdır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
