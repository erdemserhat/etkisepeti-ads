"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HomeHeroBanner.module.css";

type Variant = "minimal" | "rich";

type Props = {
  code: string;
  variant?: Variant;
};

export function HeroCouponCopy({ code, variant = "minimal" }: Props) {
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetRef.current) clearTimeout(resetRef.current);
    };
  }, []);

  const copy = useCallback(async () => {
    const done = () => {
      setCopied(true);
      if (resetRef.current) clearTimeout(resetRef.current);
      resetRef.current = setTimeout(() => setCopied(false), 2000);
    };

    try {
      await navigator.clipboard.writeText(code);
      done();
      return;
    } catch {
      /* fall through */
    }

    try {
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done();
    } catch {
      /* ignore */
    }
  }, [code]);

  const ariaLabel = copied ? "Kupon kodu kopyalandı" : "Kupon kodunu kopyala";

  if (variant === "rich") {
    return (
      <button
        type="button"
        onClick={copy}
        className={styles.copyButtonRich}
        aria-label={ariaLabel}
      >
        <span
          className={`${styles.copyIconRich} transition-colors duration-200 ${
            copied ? styles.copyIconSuccess : "text-white/92"
          }`}
        >
          {copied ? (
            <i className="fa-solid fa-check" aria-hidden />
          ) : (
            <i className="fa-regular fa-copy" aria-hidden />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={styles.copyButtonMinimal}
      aria-label={ariaLabel}
    >
      <span
        className={`inline-flex items-center justify-center text-[0.85rem] transition-colors duration-200 ${
          copied ? styles.copyIconSuccess : ""
        }`}
      >
        {copied ? (
          <i className="fa-solid fa-check" aria-hidden />
        ) : (
          <i className="fa-regular fa-copy" aria-hidden />
        )}
      </span>
      <span className="ml-1.5 text-[11px] font-semibold uppercase tracking-wider">
        {copied ? "Kopyalandı" : "Kopyala"}
      </span>
    </button>
  );
}
