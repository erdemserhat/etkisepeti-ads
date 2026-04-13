import Link from "next/link";
import type { PlatformListItem } from "@/lib/types/platform";

type Props = {
  platform: PlatformListItem;
};

export function PlatformCard({ platform }: Props) {
  return (
    <Link
      href={`/platforms/${platform.slug}`}
      className="platform-card group relative flex aspect-square w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-[2.1rem] p-6 text-center shadow-[0_18px_34px_rgba(15,23,42,0.14)] transition duration-200 hover:scale-[1.03] hover:shadow-[0_24px_40px_rgba(15,23,42,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-5 sm:p-7"
      style={{ backgroundColor: platform.colorCode }}
    >
      <span
        className="platform-card__texture pointer-events-none absolute inset-0 rounded-[2.1rem]"
        aria-hidden
      />
      <span
        className="relative z-[1] text-6xl text-white drop-shadow-sm sm:text-7xl"
        aria-hidden
      >
        <i className={platform.iconClass} />
      </span>
      <span className="relative z-[1] px-2 text-base font-extrabold uppercase leading-tight tracking-tight text-white drop-shadow-sm sm:text-[1.35rem]">
        {platform.name}
      </span>
    </Link>
  );
}
