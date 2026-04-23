"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Subscribes to the `/v1/support/events` SSE stream so support replies arrive
 * in real time instead of via polling. Ported from the main site's
 * `useSupportSSE` hook — simplified to only handle `ticketReply`, which is
 * all the ads landing modal needs.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_ETKISEPETI_API_BASE?.replace(/\/$/, "") ||
  "https://api.etkisepeti.com";

const EVENTS_URL = `${API_BASE}/v1/support/events`;

const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

export interface TicketReplyEvent {
  ticketId: string;
  message: string;
  timestamp: string;
  userId?: string | null;
  guestId?: string | null;
}

interface SSEMessageData {
  type: "ticketReply" | "ping";
  data?: TicketReplyEvent | string;
  timestamp?: string;
}

interface UseSupportSSEOptions {
  enabled?: boolean;
  onReply?: (event: TicketReplyEvent) => void;
  onConnectionChange?: (isConnected: boolean) => void;
}

interface UseSupportSSEReturn {
  isConnected: boolean;
  lastError: string | null;
}

export function useSupportSSE(
  options: UseSupportSSEOptions = {}
): UseSupportSSEReturn {
  const { enabled = true, onReply, onConnectionChange } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isConnectingRef = useRef(false);
  const enabledRef = useRef(enabled);
  const connectRef = useRef<(() => void) | null>(null);

  const onReplyRef = useRef(onReply);
  const onConnectionChangeRef = useRef(onConnectionChange);

  useEffect(() => {
    onReplyRef.current = onReply;
  }, [onReply]);

  useEffect(() => {
    onConnectionChangeRef.current = onConnectionChange;
  }, [onConnectionChange]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const updateConnectionStatus = useCallback((connected: boolean) => {
    setIsConnected(connected);
    onConnectionChangeRef.current?.(connected);
  }, []);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    isConnectingRef.current = false;
  }, []);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!enabledRef.current) return;
    if (
      isConnectingRef.current ||
      eventSourceRef.current?.readyState === EventSource.OPEN
    ) {
      return;
    }

    isConnectingRef.current = true;
    cleanup();

    try {
      const eventSource = new EventSource(EVENTS_URL, {
        withCredentials: true,
      });

      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        isConnectingRef.current = false;
        reconnectAttemptsRef.current = 0;
        setLastError(null);
        updateConnectionStatus(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);

          let message: SSEMessageData;

          if (parsed.success !== undefined && parsed.data?.type) {
            message = parsed.data as SSEMessageData;
          } else if (parsed.type) {
            message = parsed as SSEMessageData;
          } else {
            return;
          }

          if (message.type === "ticketReply") {
            let replyData: TicketReplyEvent;

            if (typeof message.data === "string") {
              replyData = JSON.parse(message.data) as TicketReplyEvent;
            } else if (message.data) {
              replyData = message.data as TicketReplyEvent;
            } else {
              return;
            }

            onReplyRef.current?.(replyData);
          }
        } catch {
          // ignore parse errors
        }
      };

      eventSource.onerror = () => {
        isConnectingRef.current = false;
        updateConnectionStatus(false);
        eventSource.close();
        eventSourceRef.current = null;

        if (!enabledRef.current) return;

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          const delay =
            RECONNECT_DELAY_MS *
            Math.pow(2, reconnectAttemptsRef.current - 1);

          setLastError(
            `Bağlantı koptu. ${Math.round(delay / 1000)} sn içinde yeniden denenecek.`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connectRef.current?.();
          }, delay);
        } else {
          setLastError("Canlı bağlantı kurulamadı. Sayfayı yenilemeyi deneyin.");
        }
      };
    } catch {
      isConnectingRef.current = false;
      setLastError("Canlı bağlantı başlatılamadı.");
      updateConnectionStatus(false);
    }
  }, [cleanup, updateConnectionStatus]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    if (enabled) {
      reconnectAttemptsRef.current = 0;
      const timeoutId = setTimeout(() => connect(), 0);
      return () => {
        clearTimeout(timeoutId);
        cleanup();
      };
    }
    cleanup();
    queueMicrotask(() => {
      setIsConnected(false);
      onConnectionChangeRef.current?.(false);
    });
    return cleanup;
  }, [enabled, connect, cleanup]);

  return {
    isConnected,
    lastError,
  };
}
