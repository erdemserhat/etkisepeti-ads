import Image from "next/image";
import styles from "./TrustBadgesBanner.module.css";

type RatingCard = {
  id: string;
  label: string;
  stars: number;
  hideStars?: boolean;
  renderLogo: () => React.ReactNode;
};

const RATINGS: RatingCard[] = [
  {
    id: "google",
    label: "Google",
    stars: 5,
    renderLogo: () => (
      <Image
        src="/google.svg"
        alt="Google"
        width={72}
        height={24}
        className="h-[1.1rem] w-auto object-contain"
      />
    ),
  },
  {
    id: "sikayetvar",
    label: "Şikayetvar",
    stars: 5,
    renderLogo: () => (
      <Image
        src="/sikayetvar.svg"
        alt="Şikayetvar"
        width={120}
        height={24}
        className="h-[1.1rem] w-auto object-contain"
      />
    ),
  },
  {
    id: "trustpilot",
    label: "Trustpilot",
    stars: 4,
    hideStars: true,
    renderLogo: () => (
      <Image
        src="/trustpilot.png"
        alt="Trustpilot"
        width={200}
        height={86}
        className="h-[2.25rem] w-auto object-contain"
      />
    ),
  },
];

function StarRow({ filled = 5 }: { filled?: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <i
          key={i}
          className={`fa-solid fa-star text-[0.78rem] ${
            i < filled ? "text-amber-400" : "text-neutral-300"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}

function AvatarCluster() {
  const avatars = [
    { id: "a", src: "/avatars/a.jpg" },
    { id: "b", src: "/avatars/b.jpg" },
    { id: "c", src: "/avatars/c.jpg" },
  ];

  return (
    <div className={styles.avatarCluster} aria-hidden>
      {avatars.map((av, idx) => (
        <div
          key={av.id}
          className={styles.avatarWrap}
          style={{ zIndex: 10 - idx }}
        >
          <div className={styles.avatar}>
            <Image
              src={av.src}
              alt=""
              width={56}
              height={56}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <span className={styles.chatBubble}>
            <i className="fa-solid fa-message text-[0.55rem] text-[#2563EB]" />
          </span>
        </div>
      ))}
    </div>
  );
}

export function TrustRatingsRow({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <ul
      className={`${styles.ratings}${className ? ` ${className}` : ""}`}
      role="list"
      style={style}
    >
      {RATINGS.map((r) => (
        <li key={r.id} className={styles.ratingCard}>
          <div className="flex min-w-0 flex-col items-center gap-1">
            {!r.hideStars && <StarRow filled={r.stars} />}
            {r.renderLogo()}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TrustStripContent({
  hideRatings = false,
}: {
  hideRatings?: boolean;
} = {}) {
  return (
    <div className={styles.inner}>
      <div className={styles.leftGroup}>
        <AvatarCluster />
        <h2 className={styles.heading}>
          <span>Sektörde Müşteri Desteği</span>
          <span>En Kaliteli Firmayız.</span>
        </h2>
      </div>

      {!hideRatings && <TrustRatingsRow />}
    </div>
  );
}

export function TrustBadgesBanner() {
  return (
    <section
      aria-label="Müşteri memnuniyeti ve değerlendirmeler"
      className={styles.banner}
    >
      <TrustStripContent />
    </section>
  );
}
