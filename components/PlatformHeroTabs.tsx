import Link from "next/link";
import type { PlatformAction } from "@/lib/types/platform";

const ALL_KEY = "all";

type Props = {
  platformSlug: string;
  actions: PlatformAction[];
  selectedKey: string;
  accentColor: string;
};

export function PlatformHeroTabs({
  platformSlug,
  actions,
  selectedKey,
  accentColor,
}: Props) {
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
      className="scrollbar-hidden flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-[1.35rem]"
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
            className={`min-h-10 shrink-0 rounded-[1rem] px-3.5 py-2 text-center text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent sm:min-h-[3rem] sm:px-5 sm:py-2.5 sm:text-[0.95rem] ${
              active
                ? "text-white"
                : "bg-transparent text-white/70 hover:bg-white/[0.08] hover:text-white"
            }`}
            style={
              active
                ? {
                    backgroundColor: accentColor,
                    boxShadow: `0 18px 30px -22px ${accentColor}`,
                  }
                : undefined
            }
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export { ALL_KEY };
