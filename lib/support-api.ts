/**
 * Client-side support ticket API calls.
 *
 * Hits the same `/v1/support` endpoints as `etkisepeti-frontend` so guests and
 * logged-in users on this landing site can open / continue tickets directly
 * from the live-support modal (no redirect to the main app).
 *
 * Authentication: cookie-based (httpOnly). Requests use `credentials: "include"`
 * so any auth cookies issued by `api.etkisepeti.com` flow with each call. Guests
 * are identified by the backend's own guest-session cookie.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_ETKISEPETI_API_BASE?.replace(/\/$/, "") ||
  "https://api.etkisepeti.com";

export type SupportTicketStatus = "pending" | "answered" | "closed";

export interface ThreadFlowMessage {
  sender: "USER" | "SUPPORT";
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: SupportTicketStatus;
  threadFlow: ThreadFlowMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  /** min 1, max 100 */
  subject: string;
  /** min 10, max 1000 */
  message: string;
}

export interface ReplyTicketDto {
  /** min 10, max 1000 */
  message: string;
}

export class SupportApiError extends Error {
  statusCode: number;
  code?: string;
  localizedMessage?: string;

  constructor(
    message: string,
    statusCode: number,
    code?: string,
    localizedMessage?: string
  ) {
    super(message);
    this.name = "SupportApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.localizedMessage = localizedMessage;
  }
}

type ApiEnvelope<T> =
  | { success: true; data: T }
  | {
      success: false;
      data?: {
        message?: string;
        code?: string;
        localizedMessage?: string;
      };
      message?: string;
      code?: string;
    };

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  let body: ApiEnvelope<T> | T | null = null;
  try {
    body = (await res.json()) as ApiEnvelope<T> | T;
  } catch {
    body = null;
  }

  if (!res.ok) {
    const envelope = body as Exclude<ApiEnvelope<T>, { success: true }> | null;
    const msg =
      envelope?.data?.localizedMessage ||
      envelope?.data?.message ||
      envelope?.message ||
      `İstek başarısız (${res.status})`;
    throw new SupportApiError(
      msg,
      res.status,
      envelope?.data?.code || envelope?.code,
      envelope?.data?.localizedMessage
    );
  }

  if (body && typeof body === "object" && "success" in body) {
    const envelope = body as ApiEnvelope<T>;
    if (!envelope.success) {
      throw new SupportApiError(
        envelope.data?.localizedMessage ||
          envelope.data?.message ||
          envelope.message ||
          "İstek başarısız",
        res.status,
        envelope.data?.code || envelope.code,
        envelope.data?.localizedMessage
      );
    }
    return envelope.data as T;
  }

  return body as T;
}

export function listSupportTickets(signal?: AbortSignal) {
  return apiFetch<SupportTicket[]>("/v1/support", { method: "GET", signal });
}

export function getSupportTicket(id: string, signal?: AbortSignal) {
  return apiFetch<SupportTicket>(`/v1/support/${encodeURIComponent(id)}`, {
    method: "GET",
    signal,
  });
}

export function createSupportTicket(dto: CreateTicketDto) {
  return apiFetch<SupportTicket>("/v1/support", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function replyToSupportTicket(id: string, dto: ReplyTicketDto) {
  return apiFetch<SupportTicket>(
    `/v1/support/${encodeURIComponent(id)}/reply`,
    {
      method: "POST",
      body: JSON.stringify(dto),
    }
  );
}

const ACTIVE_TICKET_STORAGE_KEY = "support-active-ticket";
const ACTIVE_TICKET_EXPIRY_DAYS = 7;

export function getActiveTicketId(): string | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(ACTIVE_TICKET_STORAGE_KEY);
  if (!stored) return null;
  try {
    const { id, expiry } = JSON.parse(stored) as {
      id: string;
      expiry: number;
    };
    if (expiry && Date.now() < expiry) return id;
    localStorage.removeItem(ACTIVE_TICKET_STORAGE_KEY);
    return null;
  } catch {
    localStorage.removeItem(ACTIVE_TICKET_STORAGE_KEY);
    return null;
  }
}

export function setActiveTicketId(id: string): void {
  if (typeof window === "undefined") return;
  const expiry =
    Date.now() + ACTIVE_TICKET_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(
    ACTIVE_TICKET_STORAGE_KEY,
    JSON.stringify({ id, expiry })
  );
}

export function clearActiveTicketId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_TICKET_STORAGE_KEY);
}
