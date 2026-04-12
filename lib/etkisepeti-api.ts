import { getEtkisepetiApiBase, getEtkisepetiInternalKey } from "./env";
import type {
  ApiDetailResponse,
  ApiListResponse,
  PlatformDetail,
  PlatformListItem,
} from "./types/platform";

function headers(): HeadersInit {
  const key = getEtkisepetiInternalKey();
  const h: Record<string, string> = {
    accept: "application/json",
    "Content-Type": "application/json",
  };
  if (key) {
    h["x-internal-key"] = key;
  }
  return h;
}

export async function fetchPlatforms(): Promise<PlatformListItem[]> {
  const base = getEtkisepetiApiBase();
  const res = await fetch(`${base}/v1/platforms`, {
    headers: headers(),
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Platformlar isteği başarısız: ${res.status}`);
  }
  const json = (await res.json()) as ApiListResponse<PlatformListItem>;
  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Geçersiz platformlar yanıtı");
  }
  return [...json.data].sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function fetchPlatform(
  slug: string
): Promise<PlatformDetail | null> {
  const base = getEtkisepetiApiBase();
  const res = await fetch(`${base}/v1/platforms/${encodeURIComponent(slug)}`, {
    headers: headers(),
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Platform isteği başarısız: ${res.status}`);
  }
  const json = (await res.json()) as ApiDetailResponse<PlatformDetail>;
  if (!json.success || !json.data) {
    throw new Error("Geçersiz platform yanıtı");
  }
  return json.data;
}
