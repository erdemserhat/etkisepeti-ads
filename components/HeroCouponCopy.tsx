"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HomeHeroBanner.module.css";

type Props = {
  code: string;
};

export function HeroCouponCopy({ code }: Props) {
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

  return (
    <button
      type="button"
      onClick={copy}
      className={styles.copyPanelButton}
      aria-label={copied ? "Copied" : "Copy coupon code"}
    >
      <span
        className={`${styles.copyIcon} flex items-center justify-center text-[1.35rem] transition-colors duration-200 ${
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
