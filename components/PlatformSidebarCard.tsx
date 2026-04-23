import type { PlatformDetail } from "@/lib/types/platform";

type Props = {
  platform: PlatformDetail;
  categoryCount: number;
  title?: string;
};

const DEFAULT_DESCRIPTION = (name: string) =>
  `${name}'da ihtiyaçlarınıza uygun paketlerle etkileşimi artırmaya ve hesabınızı geliştirmeye hazır mısınız?`;

function HeaderDecor() {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute left-[24%] top-5 h-24 w-12 rotate-[38deg] rounded-full bg-white/[0.18] blur-xl" />
      <span className="absolute right-[18%] top-8 h-28 w-14 rotate-[38deg] rounded-full bg-white/[0.14] blur-xl" />
      <span className="absolute left-1/2 top-14 h-28 w-14 -translate-x-1/2 rotate-[38deg] rounded-full bg-white/[0.16] blur-xl" />
    </span>
  );
}

function StackStatIcon({ color }: { color: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="m12 4.5 7 4-7 4-7-4 7-4Zm7 7L12 15.5 5 11.5M19 15.5 12 19.5 5 15.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlatformSidebarCard({ platform, categoryCount, title }: Props) {
  const color = platform.colorCode || "#0b59d0";
  const description = platform.description || DEFAULT_DESCRIPTION(platform.name);
  const heading = title ?? `${platform.name} Hizmetleri`;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-md border border-white/70 bg-white/95 p-2 shadow-[0_22px_52px_rgba(12,19,51,0.15)] backdrop-blur">
      <div
        className="relative flex h-[176px] flex-col items-center justify-center overflow-hidden rounded-md px-5 pb-6 pt-5 text-center"
        style={{
          background: `linear-gradient(180deg, ${color} 0%, ${color}eb 100%)`,
        }}
      >
        <HeaderDecor />

        <span className="relative z-10 flex h-[4.9rem] w-[4.9rem] items-center justify-center rounded-md bg-white/10 text-[2.4rem] text-white backdrop-blur-sm">
          <i className={platform.iconClass} aria-hidden />
        </span>
        <span className="relative z-10 mt-4 text-[13px] font-semibold uppercase tracking-[0.24em] text-white">
          {platform.name}
        </span>
      </div>

      <div className="px-4 pb-5 pt-5">
        <div
          className="text-[24px] font-bold leading-[1.02] tracking-[-0.03em]"
          style={{ color }}
        >
          {heading}
        </div>
        <p className="mt-3 text-[15px] leading-[1.5] text-[#7b81a0]">
          {description}
        </p>

        <div className="mt-6 border-t border-[#edf0fa] pt-5">
          <div className="flex items-center gap-3 py-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#f4f5fc]">
              <StackStatIcon color={color} />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] leading-tight text-[#8b91ac]">
                Kategori Sayısı
              </div>
              <div className="mt-1 text-[14px] font-semibold leading-tight text-[#454b63]">
                {categoryCount} Kategori
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlatformMobileBanner({ platform, title }: Props) {
  const color = platform.colorCode || "#0b59d0";
  const description = platform.description || DEFAULT_DESCRIPTION(platform.name);
  const heading = title ?? `${platform.name} Hizmetleri`;

  return (
    <div className="overflow-hidden bg-[#eef2ff]">
      <div
        className="relative flex min-h-[190px] flex-col items-center justify-center overflow-hidden px-6 pb-10 pt-8 text-center"
        style={{ backgroundColor: color }}
      >
        <HeaderDecor />

        <span className="relative z-10 mb-3 flex h-16 w-16 items-center justify-center rounded-md bg-white/10 text-[1.85rem] text-white backdrop-blur-sm">
          <i className={platform.iconClass} aria-hidden />
        </span>
        <span className="relative z-10 text-[18px] font-medium uppercase tracking-[0.18em] text-white">
          {platform.name}
        </span>
      </div>

      <div className="-mt-1 bg-white px-5 pb-5 pt-6 shadow-[0_-12px_24px_rgba(15,23,42,0.05)]">
        <h2 className="text-[22px] font-bold leading-tight" style={{ color }}>
          {heading}
        </h2>
        <p className="mt-3 text-[15px] leading-[1.5] text-[#7b81a0]">
          {description}
        </p>
      </div>
    </div>
  );
}
