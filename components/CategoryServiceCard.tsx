import Link from "next/link";
import { getCategoryIconClass } from "@/lib/platform-utils";
import type { CategoryWithAction } from "@/lib/platform-utils";

type Props = {
  category: CategoryWithAction;
  accentColor: string;
};

export function CategoryServiceCard({ category, accentColor }: Props) {
  const href = `https://etkisepeti.com/${category.slug}`;
  const iconClass = getCategoryIconClass(category.actionKey);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-sm transition hover:border-brand-primary/30 hover:shadow-md md:gap-4 md:p-4"
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
        <p className="mt-0.5 text-xs text-neutral-500">Paketler</p>
        <p className="mt-1 text-xs text-neutral-400">
          {category.hasPackage ? "Mevcut" : "Çok yakında"}
        </p>
      </div>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-200 text-neutral-600 transition group-hover:bg-brand-primary group-hover:text-white md:h-11 md:w-11"
        aria-hidden
      >
        <i className="fa-solid fa-arrow-right text-sm" />
      </span>
    </Link>
  );
}
