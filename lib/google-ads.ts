export const GOOGLE_ADS_ID = "AW-11040631498";

/** Conversion action send_to for outbound category clicks to etkisepeti.com */
export const GOOGLE_ADS_CONVERSION_SEND_TO =
  "AW-11040631498/kQIvCJPc2dQZEMrVypAp";

export function sendGoogleAdsCategoryOutboundConversion(): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;
  w.gtag("event", "conversion", { send_to: GOOGLE_ADS_CONVERSION_SEND_TO });
}
