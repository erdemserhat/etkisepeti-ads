"use client";

import { getCategoryIconClass } from "@/lib/platform-utils";
import type { CategoryWithAction } from "@/lib/platform-utils";

type Props = {
  category: CategoryWithAction;
  accentColor: string;
};

export function CategoryServiceCard({ category, accentColor }: Props) {
  const iconClass = getCategoryIconClass(category.actionKey);

  const openEtkisepetiCategory = () => {
    window.open(
      `https://etkisepeti.com/${category.slug}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <button
      type="button"
      onClick={openEtkisepetiCategory}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3 text-left font-inherit shadow-sm transition hover:border-brand-primary/30 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary md:gap-4 md:p-4"
      aria-label={`${category.name}: Etkisepeti sitesinde yeni sekmede aç`}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg text-white md:h-14 md:w-14 md:text-xl"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      >
        <i className={iconClass} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold leading-tight text-neutral-900 transition group-hover:text-brand-primary md:text-base">
          {category.name}
        </p>
        <p className="mt-0.5 text-xs text-neutral-500">Paket bilgisi</p>
        <p className="mt-1 text-xs text-neutral-400">
          {category.hasPackage ? "Ana sitede" : "Paket yok"}
        </p>
      </div>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-200 text-neutral-600 transition group-hover:bg-brand-primary group-hover:text-white md:h-11 md:w-11"
        aria-hidden
      >
        <i className="fa-solid fa-arrow-right text-sm" />
      </span>
    </button>
  );
}
