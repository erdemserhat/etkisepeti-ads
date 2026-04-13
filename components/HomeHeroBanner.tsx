import Image from "next/image";
import { HeroCouponCopy } from "@/components/HeroCouponCopy";
import styles from "./HomeHeroBanner.module.css";

const COUPON_CODE = "ETKI100";

export function HomeHeroBanner() {
  return (
    <section
      id="ozel-firsatlar"
      aria-labelledby="home-hero-heading"
      className={`${styles.hero} rounded-[2rem] px-5 py-5 text-white md:px-8 md:py-6 lg:px-10 lg:py-7`}
    >
      <div className={styles.heroGlow} aria-hidden />
      <div className={styles.ribbonPrimary} aria-hidden />
      <div className={styles.ribbonSecondary} aria-hidden />
      <div className={styles.ribbonTertiary} aria-hidden />

      <div className="relative z-[1] grid items-center gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,20rem)] lg:gap-6">
        <div className="mx-auto flex w-full max-w-[41rem] flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
          <span
            className={`${styles.promoPill} inline-flex items-center px-5 py-1.5 text-[11px] font-extrabold uppercase tracking-tight text-white md:text-[0.8rem]`}
          >
            %30 İNDİRİM
          </span>

          <h1
            id="home-hero-heading"
            className="mt-3.5 max-w-none text-[2.1rem] font-black uppercase tracking-[-0.04em] text-white sm:text-[2.5rem] md:text-[3rem] md:leading-[0.98]"
          >
            NİSAN AYINA ÖZEL!
          </h1>

          <p className="mt-2 max-w-[28rem] text-[0.93rem] font-medium leading-[1.38] text-white/66 md:text-[0.9rem]">
            %30 indirim kupon kodu ile alışverişin tadını çıkarmaya başlayın.
          </p>

          <div className="mt-4.5 flex w-full max-w-[39rem] flex-col gap-2.5 md:flex-row md:items-stretch">
            <div className={`${styles.couponCard} grid min-h-[4.55rem] grid-cols-[minmax(0,1fr)_4.3rem] overflow-hidden md:max-w-[21.5rem] md:flex-1`}>
              <div className="flex min-w-0 flex-col justify-center px-4 py-3 md:px-[1.125rem]">
                <p className="text-[11px] font-medium text-white/38 md:text-[0.8rem]">
                  Kupon Kodu
                </p>
                <p className="mt-1 truncate text-[1.38rem] font-black uppercase tracking-[-0.03em] text-white md:text-[1.62rem]">
                  {COUPON_CODE}
                </p>
              </div>
              <HeroCouponCopy code={COUPON_CODE} />
            </div>

            <a
              href="#platform-section"
              className={`${styles.ctaButton} inline-flex min-h-[4.55rem] w-full items-center justify-center gap-2 px-5 py-3 text-[0.98rem] font-black uppercase tracking-[-0.03em] text-white transition hover:translate-y-[-1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:min-w-[15.5rem] md:w-auto md:px-6 md:text-[1.04rem]`}
            >
              HİZMETLERİ İNCELE
              <i className="fa-solid fa-arrow-down text-xs" aria-hidden />
            </a>
          </div>
        </div>

        <div className="relative flex items-end justify-end max-md:hidden lg:min-h-[24rem]">
          <div className={styles.figureAccentPrimary} aria-hidden />
          <div className={styles.figureAccentSecondary} aria-hidden />
          <div className={styles.visualShell} aria-hidden>
            <div className={styles.imageGlow} />
            <Image
              src="/hero-single.webp"
              alt=""
              fill
              preload
              sizes="(max-width: 767px) 78vw, (max-width: 1023px) 58vw, 24rem"
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
