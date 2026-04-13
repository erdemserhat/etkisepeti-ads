"use client";

import { sendGoogleAdsCategoryOutboundConversion } from "@/lib/google-ads";
import { getCategoryIconClass } from "@/lib/platform-utils";
import type { CategoryWithAction } from "@/lib/platform-utils";

type Props = {
  category: CategoryWithAction;
  accentColor: string;
};

export function CategoryServiceCard({ category, accentColor }: Props) {
  const iconClass = getCategoryIconClass(category.actionKey);
  const href = `https://etkisepeti.com/${category.slug}`;

  return (
    <a
      href={href}
      onClick={() => sendGoogleAdsCategoryOutboundConversion()}
      className="group relative flex w-full cursor-pointer items-stretch gap-3 overflow-hidden rounded-[1.85rem] border border-[#e7e9f3] bg-white p-2.5 text-left font-inherit text-inherit no-underline shadow-[0_24px_50px_-38px_rgba(15,23,42,0.42)] transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_30px_60px_-36px_rgba(15,23,42,0.38)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary md:gap-4 md:p-3"
      aria-label={category.name}
    >
      <span
        className="pointer-events-none absolute inset-x-8 bottom-0 h-16 bg-[radial-gradient(circle_at_center,rgba(226,232,240,0.55),transparent_72%)]"
        aria-hidden
      />
      <span
        className="relative flex w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] px-3 py-6 text-2xl text-white sm:w-24 sm:text-[1.9rem]"
        style={{
          backgroundColor: accentColor,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.26), 0 18px 35px -28px ${accentColor}`,
        }}
        aria-hidden
      >
        <span className="platform-card__texture absolute inset-0 rounded-[inherit]" />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_56%)]" />
        <i className={`${iconClass} relative z-[1] drop-shadow-sm`} />
      </span>
      <span className="relative flex min-w-0 flex-1 items-center gap-3 py-1 pl-1 sm:gap-4">
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-black leading-tight tracking-tight text-neutral-900 transition group-hover:text-brand-primary sm:text-[1.55rem]">
            {category.name}
          </span>
          <span className="mt-1 block text-sm font-medium text-neutral-500 sm:text-base">
            {category.actionName} Paketleri
          </span>
        </span>
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] bg-[#eef1fb] text-neutral-500 transition group-hover:bg-neutral-900 group-hover:text-white md:h-14 md:w-14 md:rounded-[1.25rem]"
          aria-hidden
        >
          <i className="fa-solid fa-arrow-right text-sm md:text-base" />
        </span>
      </span>
      <span
        className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/60"
        aria-hidden
      />
    </a>
  );
}
