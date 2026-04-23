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

  const cssVar = { ["--platform-color" as string]: accentColor };

  return (
    <div className="mb-4 sm:mb-6">
      <div className="scrollbar-hidden overflow-x-auto">
        <div
          className="inline-flex min-w-max items-center gap-2 rounded-md border border-white/10 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_38px_rgba(7,10,24,0.12)] backdrop-blur-md"
          style={{
            ...cssVar,
            background:
              "linear-gradient(135deg, #141425 0%, #1a1c31 52%, #18192a 100%)",
          }}
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
                className={
                  active
                    ? "whitespace-nowrap rounded-md bg-[var(--platform-color)] px-5 py-3 text-[14px] font-semibold tracking-[-0.01em] text-white shadow-[0_14px_28px_rgba(0,0,0,0.28)] transition-all duration-200 sm:px-6 sm:py-3.5 sm:text-[15px]"
                    : "whitespace-nowrap rounded-md px-5 py-3 text-[14px] font-semibold tracking-[-0.01em] text-white/70 transition-all duration-200 hover:bg-white/[0.06] hover:text-white sm:px-6 sm:py-3.5 sm:text-[15px]"
                }
                style={cssVar}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { ALL_KEY };
