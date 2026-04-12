import Link from "next/link";
import type { PlatformListItem } from "@/lib/types/platform";

type Props = {
  platform: PlatformListItem;
};

export function PlatformCard({ platform }: Props) {
  return (
    <Link
      href={`/platforms/${platform.slug}`}
      className="platform-card group relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl p-4 text-center shadow-md transition hover:scale-[1.02] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      style={{ backgroundColor: platform.colorCode }}
    >
      <span
        className="platform-card__texture pointer-events-none absolute inset-0 rounded-3xl"
        aria-hidden
      />
      <span
        className="relative z-[1] text-4xl text-white drop-shadow-sm md:text-5xl"
        aria-hidden
      >
        <i className={platform.iconClass} />
      </span>
      <span className="relative z-[1] px-1 text-[11px] font-bold uppercase leading-tight tracking-wide text-white drop-shadow-sm sm:text-xs md:text-sm">
        {platform.name}
      </span>
    </Link>
  );
}
