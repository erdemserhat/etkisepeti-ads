import Link from "next/link";
import type { PlatformAction } from "@/lib/types/platform";

const ALL_KEY = "all";

type Props = {
  platformSlug: string;
  actions: PlatformAction[];
  selectedKey: string;
};

export function PlatformHeroTabs({ platformSlug, actions, selectedKey }: Props) {
  const sorted = [...actions].sort((a, b) => a.orderIndex - b.orderIndex);
  const base = `/platforms/${platformSlug}`;

  const items: { key: string; label: string; href: string }[] = [
    { key: ALL_KEY, label: "Tümü", href: `${base}?action=${ALL_KEY}` },
    ...sorted.map((a) => ({
      key: a.key,
      label: a.name,
      href: `${base}?action=${encodeURIComponent(a.key)}`,
    })),
  ];

  return (
    <div
      className="flex flex-nowrap gap-1 overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-xl bg-neutral-800/70 p-1 [scrollbar-width:thin] sm:gap-1.5 sm:rounded-2xl sm:p-1.5"
      role="tablist"
      aria-label="Hizmet filtreleri"
    >
      {items.map(({ key, label, href }) => {
        const active = selectedKey === key;
        return (
          <Link
            key={key}
            href={href}
            role="tab"
            aria-selected={active}
            className={`min-h-9 shrink-0 rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent sm:min-h-[2.5rem] sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm ${
              active
                ? "bg-brand-primary text-white shadow-md"
                : "text-neutral-300 hover:bg-neutral-700/60 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export { ALL_KEY };
