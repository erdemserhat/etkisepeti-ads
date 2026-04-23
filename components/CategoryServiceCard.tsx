"use client";

import { sendGoogleAdsCategoryOutboundConversion } from "@/lib/google-ads";
import { resolveCategoryIconClass } from "@/lib/platform-utils";
import type { CategoryWithAction } from "@/lib/platform-utils";

type Props = {
  category: CategoryWithAction;
  accentColor: string;
};

const CARD_STRIPES = `
  radial-gradient(circle at 18px 18px, rgba(255,255,255,0.16) 0, rgba(255,255,255,0.16) 2px, transparent 2.5px),
  radial-gradient(circle at 55px 30px, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 2px, transparent 2.5px),
  radial-gradient(circle at 36px 62px, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 3px, transparent 3.5px),
  repeating-linear-gradient(135deg, rgba(255,255,255,0.09) 0 2px, transparent 2px 18px),
  repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 22px)
`;

export function CategoryServiceCard({ category, accentColor }: Props) {
  const iconClass = resolveCategoryIconClass(
    category.name,
    category.actionKey,
    category.actionName
  );
  const href = `https://etkisepeti.com/${category.slug}`;

  return (
    <a
      href={href}
      onClick={() => sendGoogleAdsCategoryOutboundConversion()}
      aria-label={category.name}
      className="group relative flex min-h-[110px] w-full min-w-0 items-center justify-between gap-3 overflow-hidden rounded-md border border-white/75 bg-white/95 p-2.5 shadow-[0_16px_38px_rgba(17,25,52,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(17,25,52,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--platform-color)]"
      style={{ ["--platform-color" as string]: accentColor }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <span
          className="relative flex h-[5.4rem] w-[4.8rem] shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/15"
          style={{
            background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}f0 100%)`,
          }}
          aria-hidden
        >
          <span
            className="absolute inset-0 opacity-70"
            style={{ backgroundImage: CARD_STRIPES }}
          />
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0))]" />
          <span className="absolute inset-0 flex -rotate-[16deg] scale-[1.95] items-center justify-center opacity-[0.18]">
            <i className={`${iconClass} text-[1.4rem] text-white`} />
          </span>
          <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10 text-[1.05rem] text-white backdrop-blur-sm">
            <i className={iconClass} />
          </span>
        </span>

        <span className="min-w-0 flex-1 py-0.5">
          <span className="block truncate text-[18px] font-semibold leading-tight tracking-[-0.02em] text-[#3c435d] transition-colors duration-200 group-hover:text-[var(--platform-color)]">
            {category.name}
          </span>
          <span className="mt-0.5 block text-[14px] font-medium text-[#7d84a4]">
            Satın Al
          </span>
          <span className="mt-2 block h-px w-full bg-[#e9ecf6]" />
          <span className="block pt-2 text-[14px] text-[#7a809d]">
            Paketleri Gör
          </span>
        </span>
      </div>

      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[#e7ebf7] bg-[#f2f4fd] text-[#7c84a5] transition-all duration-300 group-hover:translate-x-1 group-hover:border-transparent group-hover:bg-[var(--platform-color)] group-hover:text-white"
        aria-hidden
      >
        <i className="fa-solid fa-arrow-right text-[1rem]" />
      </span>
    </a>
  );
}
