import Image from "next/image";
import { HeroCouponCopy } from "@/components/HeroCouponCopy";
import { TrustStripContent } from "@/components/TrustBadgesBanner";
import styles from "./HomeHeroBanner.module.css";

const COUPON_CODE = "ETKI100";

export function HomeHeroBanner() {
  return (
    <section
      id="ozel-firsatlar"
      aria-label="Nisan ayına özel %30 indirim"
    >
      <HeroBannerMobile />
      <HeroBannerDesktop />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile (<= md): minimal banner                                     */
/* ------------------------------------------------------------------ */

function HeroBannerMobile() {
  return (
    <div
      className={`${styles.heroMobile} px-5 py-6 text-white md:hidden`}
    >
      <div className="relative z-[1] flex w-full flex-col items-center text-center">
        <span
          className={`${styles.promoPillMobile} inline-flex items-center px-3 py-1 text-[11px] font-semibold uppercase`}
        >
          %30 İndirim
        </span>

        <h1 className="mt-3 text-[1.65rem] font-bold tracking-[-0.02em] text-white sm:text-[1.9rem]">
          Nisan Ayına Özel
        </h1>

        <p className="mt-1.5 max-w-[26rem] text-[0.9rem] leading-[1.45] text-white/60">
          Kupon kodunu kullanarak alışverişinde %30 indirim kazan.
        </p>

        <div className="mt-4 flex w-full max-w-[28rem] flex-col gap-2 sm:flex-row sm:items-center">
          <div
            className={`${styles.couponCardMobile} flex h-11 items-center overflow-hidden sm:flex-1`}
          >
            <div className="flex min-w-0 flex-1 items-baseline gap-2 px-3">
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
                Kupon
              </span>
              <span className="truncate text-[0.95rem] font-semibold tracking-[-0.01em] text-white">
                {COUPON_CODE}
              </span>
            </div>
            <HeroCouponCopy code={COUPON_CODE} variant="minimal" />
          </div>

          <a
            href="#platform-section"
            className={`${styles.ctaButtonMobile} inline-flex h-11 w-full items-center justify-center gap-1.5 px-4 text-[0.88rem] font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:w-auto`}
          >
            Hizmetleri incele
            <i className="fa-solid fa-arrow-down text-[0.7rem]" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop (>= md): original rich banner with ribbons + visuals       */
/* ------------------------------------------------------------------ */

function HeroBannerDesktop() {
  return (
    <div
      className={`${styles.heroDesktop} hidden px-7 py-5 text-white md:block md:px-7 md:py-5 lg:px-9 lg:py-5`}
    >
      <div className={styles.heroGlow} aria-hidden />
      <div className={styles.ribbonPrimary} aria-hidden />
      <div className={styles.ribbonSecondary} aria-hidden />
      <div className={styles.ribbonTertiary} aria-hidden />

      <div className="relative z-[1] grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] lg:gap-6">
        <div className="flex flex-col">
          <div className="mx-auto flex w-full max-w-[38rem] flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
            <span
              className={`${styles.promoPillDesktop} inline-flex items-center px-3.5 py-[3px] text-[0.68rem] font-extrabold uppercase tracking-tight text-white`}
            >
              %30 İNDİRİM
            </span>

            <h2 className="mt-2.5 max-w-none text-[2.15rem] font-black uppercase tracking-[-0.035em] leading-[1] text-white">
              NİSAN AYINA ÖZEL!
            </h2>

            <p className="mt-1.5 max-w-[25rem] text-[0.82rem] font-medium leading-[1.4] text-white/66">
              %30 indirim kupon kodu ile alışverişin tadını çıkarmaya başlayın.
            </p>

            <div className="mt-3.5 flex w-full max-w-[34rem] flex-col gap-2 md:flex-row md:items-stretch">
              <div
                className={`${styles.couponCardDesktop} grid min-h-[3.4rem] grid-cols-[minmax(0,1fr)_3.25rem] overflow-hidden md:max-w-[18rem] md:flex-1`}
              >
                <div className="flex min-w-0 flex-col justify-center px-3.5 py-2">
                  <p className="text-[10px] font-medium text-white/38 md:text-[0.68rem]">
                    Kupon Kodu
                  </p>
                  <p className="mt-0.5 truncate text-[1.05rem] font-black uppercase tracking-[-0.03em] text-white md:text-[1.2rem]">
                    {COUPON_CODE}
                  </p>
                </div>
                <HeroCouponCopy code={COUPON_CODE} variant="rich" />
              </div>

              <a
                href="#platform-section"
                className={`${styles.ctaButtonDesktop} inline-flex min-h-[3.4rem] w-full items-center justify-center gap-2 px-4 py-2.5 text-[0.84rem] font-black uppercase tracking-[-0.03em] text-white transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:min-w-[12.5rem] md:w-auto md:px-5 md:text-[0.88rem]`}
              >
                HİZMETLERİ İNCELE
                <i className="fa-solid fa-arrow-down text-[0.65rem]" aria-hidden />
              </a>
            </div>
          </div>

          <div className="mt-5 border-t border-white/10 pt-4 lg:mt-6 lg:pt-5">
            <TrustStripContent />
          </div>
        </div>

        <div className="relative flex items-stretch justify-end lg:self-stretch">
          <div className={styles.figureAccentPrimary} aria-hidden />
          <div className={styles.figureAccentSecondary} aria-hidden />
          <div className={styles.visualShell} aria-hidden>
            <div className={styles.imageGlow} />
            <Image
              src="/hero-single.webp"
              alt=""
              fill
              sizes="(max-width: 1023px) 70vw, 22rem"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
