"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearActiveTicketId,
  createSupportTicket,
  getActiveTicketId,
  getSupportTicket,
  listSupportTickets,
  replyToSupportTicket,
  setActiveTicketId,
  SupportApiError,
  type SupportTicket,
  type ThreadFlowMessage,
} from "@/lib/support-api";
import { useSupportSSE, type TicketReplyEvent } from "@/lib/use-support-sse";

const WHATSAPP_URL = "https://wa.me/905547123406";
const TELEGRAM_URL = "https://t.me/etkisepeti";

const NOTIFY_SOUND_URL = "/notify.mp3";

function playNotificationSound() {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio(NOTIFY_SOUND_URL);
    audio.volume = 0.5;
    audio.play().catch(() => {
      /* Autoplay engelli olabilir, sessizce geç */
    });
  } catch {
    /* Audio desteklenmiyor */
  }
}

const FAB_GRADIENT =
  "linear-gradient(135deg, #2563eb 0%, #1d4ed8 45%, #0ea5e9 100%)";
const HEADER_GRADIENT =
  "linear-gradient(135deg,#5b5ef3 0%,#5b71ff 48%,#4592ff 100%)";
const BUTTON_GRADIENT = "linear-gradient(135deg,#5b5ef3 0%,#4592ff 100%)";
const USER_BUBBLE_GRADIENT =
  "linear-gradient(135deg,#5b5ef3 0%,#4f86ff 100%)";

const SUPPORT_CREW = [
  { label: "ES", gradient: "linear-gradient(135deg, #ff8aa5 0%, #ffb86b 100%)" },
  { label: "7/24", gradient: "linear-gradient(135deg, #ffd86b 0%, #ff9d5c 100%)" },
  { label: "TR", gradient: "linear-gradient(135deg, #89a8ff 0%, #5b5ef3 100%)" },
] as const;

type Tab = "home" | "messages";

function getActiveTickets(tickets: SupportTicket[] | null): SupportTicket[] {
  if (!tickets) return [];
  return tickets.filter((t) => t.status !== "closed");
}

function sortByUpdatedAtDesc(a: SupportTicket, b: SupportTicket) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

export function LiveSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"inbox" | "conversation">("inbox");
  const [tab, setTab] = useState<Tab>("home");

  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [ticketLoading, setTicketLoading] = useState(false);

  const [unreadTicketIds, setUnreadTicketIds] = useState<Set<string>>(
    () => new Set()
  );

  useEffect(() => {
    const stored = getActiveTicketId();
    if (stored) setSelectedTicketId(stored);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setView("inbox");
    setTab("home");
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);

  const refreshTickets = useCallback(async (signal?: AbortSignal) => {
    try {
      setTicketsLoading(true);
      const list = await listSupportTickets(signal);
      setTickets(Array.isArray(list) ? list : []);
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      setTickets((prev) => prev ?? []);
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  const refreshTicket = useCallback(
    async (id: string, signal?: AbortSignal, withSpinner = false) => {
      if (withSpinner) setTicketLoading(true);
      try {
        const data = await getSupportTicket(id, signal);
        setTicket(data);
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
        if (err instanceof SupportApiError && err.statusCode === 403) {
          clearActiveTicketId();
          setSelectedTicketId(null);
          setTicket(null);
          setView("inbox");
        }
      } finally {
        if (withSpinner) setTicketLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    refreshTickets(controller.signal);
    return () => controller.abort();
  }, [isOpen, refreshTickets]);

  useEffect(() => {
    if (!isOpen || !selectedTicketId || view !== "conversation") return;
    const controller = new AbortController();
    refreshTicket(selectedTicketId, controller.signal, true);
    return () => controller.abort();
  }, [isOpen, selectedTicketId, view, refreshTicket]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible" || !isOpen) return;
      refreshTickets();
      if (selectedTicketId && view === "conversation") {
        refreshTicket(selectedTicketId);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [isOpen, selectedTicketId, view, refreshTickets, refreshTicket]);

  const activeTickets = getActiveTickets(tickets);

  const activeTicketIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    activeTicketIdsRef.current = new Set(activeTickets.map((t) => t.id));
  }, [activeTickets]);

  const selectedTicketIdRef = useRef<string | null>(selectedTicketId);
  useEffect(() => {
    selectedTicketIdRef.current = selectedTicketId;
  }, [selectedTicketId]);

  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const handleSSEReply = useCallback(
    (event: TicketReplyEvent) => {
      const relevant =
        activeTicketIdsRef.current.has(event.ticketId) ||
        event.ticketId === selectedTicketIdRef.current;
      if (!relevant) return;

      refreshTickets();

      const isActivelyViewing =
        isOpenRef.current &&
        viewRef.current === "conversation" &&
        event.ticketId === selectedTicketIdRef.current;

      if (isActivelyViewing) {
        refreshTicket(event.ticketId);
        return;
      }

      setUnreadTicketIds((prev) => {
        if (prev.has(event.ticketId)) return prev;
        const next = new Set(prev);
        next.add(event.ticketId);
        return next;
      });
      playNotificationSound();
    },
    [refreshTickets, refreshTicket]
  );

  useSupportSSE({
    enabled: isOpen || activeTickets.length > 0 || !!selectedTicketId,
    onReply: handleSSEReply,
  });

  useEffect(() => {
    if (!isOpen) return;
    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeChat]);

  const clearUnread = useCallback((id: string) => {
    setUnreadTicketIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const openConversation = useCallback(
    (id: string | null) => {
      if (id) {
        setSelectedTicketId(id);
        setActiveTicketId(id);
        clearUnread(id);
      } else {
        setSelectedTicketId(null);
        clearActiveTicketId();
        setTicket(null);
      }
      setView("conversation");
    },
    [clearUnread]
  );

  const backToInbox = useCallback(() => {
    setView("inbox");
  }, []);

  const handleTicketCreated = useCallback(
    (newTicket: SupportTicket) => {
      setSelectedTicketId(newTicket.id);
      setActiveTicketId(newTicket.id);
      setTicket(newTicket);
      setTickets((prev) => {
        const next = prev ? [newTicket, ...prev.filter((t) => t.id !== newTicket.id)] : [newTicket];
        return next;
      });
    },
    []
  );

  const handleTicketUpdated = useCallback((updated: SupportTicket) => {
    setTicket(updated);
    setTickets((prev) => {
      if (!prev) return [updated];
      const filtered = prev.filter((t) => t.id !== updated.id);
      return [updated, ...filtered];
    });
  }, []);

  const unreadCount = unreadTicketIds.size;

  return (
    <>
      {!isOpen && <SupportFab onClick={openChat} unreadCount={unreadCount} />}
      {isOpen && (
        <SupportModal
          view={view}
          tab={tab}
          setTab={setTab}
          onClose={closeChat}
          tickets={tickets}
          activeTickets={activeTickets}
          ticketsLoading={ticketsLoading}
          selectedTicketId={selectedTicketId}
          ticket={ticket}
          ticketLoading={ticketLoading}
          openConversation={openConversation}
          backToInbox={backToInbox}
          onTicketCreated={handleTicketCreated}
          onTicketUpdated={handleTicketUpdated}
          unreadTicketIds={unreadTicketIds}
          unreadCount={unreadCount}
        />
      )}
    </>
  );
}

function SupportFab({
  onClick,
  unreadCount,
}: {
  onClick: () => void;
  unreadCount: number;
}) {
  const hasUnread = unreadCount > 0;
  const label = hasUnread
    ? `Canlı Destek (${unreadCount} yeni mesaj)`
    : "Canlı Destek";

  return (
    <div className="fixed bottom-6 right-3 z-40 flex pointer-events-none md:bottom-6 md:right-6 md:z-50">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto relative flex h-16 w-16 items-center justify-center rounded-full shadow-[0_22px_60px_rgba(37,99,235,0.35)] transition-all duration-300 hover:scale-[1.04] focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2"
        style={{ background: FAB_GRADIENT }}
        aria-label={label}
        aria-haspopup="dialog"
      >
        <span className="absolute inset-[1px] rounded-full border border-white/20" />
        <span className="absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0))]" />
        <span className="absolute -inset-3 rounded-full bg-[radial-gradient(circle,_rgba(37,99,235,0.30)_0%,_rgba(37,99,235,0)_70%)] blur-xl" />
        <i
          className="fa-regular fa-comment-dots text-[1.5rem] text-white"
          aria-hidden
        />

        {hasUnread ? (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-[1.5rem] items-center justify-center px-1">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/60" />
            <span className="relative inline-flex h-full min-w-[1.5rem] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white shadow-[0_0_0_4px_rgba(239,68,68,0.18)]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        ) : (
          <span className="absolute -right-0.5 top-1 flex h-5 w-5 items-center justify-center">
            <span className="absolute inline-flex h-5 w-5 animate-ping rounded-full bg-emerald-400/45" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_0_5px_rgba(34,197,94,0.18)]" />
          </span>
        )}
      </button>
    </div>
  );
}

type ModalProps = {
  view: "inbox" | "conversation";
  tab: Tab;
  setTab: (t: Tab) => void;
  onClose: () => void;

  tickets: SupportTicket[] | null;
  activeTickets: SupportTicket[];
  ticketsLoading: boolean;

  selectedTicketId: string | null;
  ticket: SupportTicket | null;
  ticketLoading: boolean;

  openConversation: (id: string | null) => void;
  backToInbox: () => void;
  onTicketCreated: (t: SupportTicket) => void;
  onTicketUpdated: (t: SupportTicket) => void;

  unreadTicketIds: Set<string>;
  unreadCount: number;
};

function SupportModal(props: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white md:inset-auto md:bottom-6 md:right-6 md:h-[720px] md:w-[400px] md:rounded-[2rem] md:border md:border-[#dbe3ff] md:shadow-[0_28px_90px_rgba(67,78,200,0.32)]"
      role="dialog"
      aria-label="Canlı Destek Sohbeti"
      aria-modal="true"
    >
      {props.view === "conversation" ? (
        <ConversationScreen
          onClose={props.onClose}
          onBack={props.backToInbox}
          selectedTicketId={props.selectedTicketId}
          ticket={props.ticket}
          ticketLoading={props.ticketLoading}
          onTicketCreated={props.onTicketCreated}
          onTicketUpdated={props.onTicketUpdated}
        />
      ) : (
        <div className="relative flex min-h-0 flex-1 flex-col bg-white">
          {props.tab === "home" && (
            <HomeTab
              onClose={props.onClose}
              latestTicket={props.activeTickets.slice().sort(sortByUpdatedAtDesc)[0]}
              onCompose={() => props.openConversation(null)}
              onOpenTicket={(id) => props.openConversation(id)}
            />
          )}
          {props.tab === "messages" && (
            <MessagesTab
              onClose={props.onClose}
              tickets={(props.tickets ?? []).slice().sort(sortByUpdatedAtDesc)}
              isLoading={props.ticketsLoading}
              onCompose={() => props.openConversation(null)}
              onOpenTicket={(id) => props.openConversation(id)}
              unreadTicketIds={props.unreadTicketIds}
            />
          )}
          <BottomNav
            tab={props.tab}
            setTab={props.setTab}
            unreadCount={props.unreadCount}
          />
        </div>
      )}
    </div>
  );
}

function HomeTab({
  onClose,
  latestTicket,
  onCompose,
  onOpenTicket,
}: {
  onClose: () => void;
  latestTicket?: SupportTicket;
  onCompose: () => void;
  onOpenTicket: (id: string) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div
        className="relative overflow-hidden px-5 pb-12 pt-[max(1.25rem,env(safe-area-inset-top))] text-white"
        style={{ background: HEADER_GRADIENT }}
      >
        <span className="pointer-events-none absolute -left-10 -top-6 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <span className="pointer-events-none absolute -right-8 top-16 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <span className="pointer-events-none absolute bottom-6 right-10 h-20 w-20 rounded-[2rem] border border-white/10" />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
              <i className="fa-solid fa-life-ring text-[1.05rem] text-white" aria-hidden />
            </span>
            <div className="flex -space-x-2">
              {SUPPORT_CREW.map((member) => (
                <span
                  key={member.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/30 text-[10px] font-bold text-white shadow-[0_6px_18px_rgba(15,23,42,0.25)]"
                  style={{ background: member.gradient }}
                >
                  {member.label}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
            aria-label="Kapat"
          >
            <i className="fa-solid fa-xmark text-[0.9rem]" aria-hidden />
          </button>
        </div>

        <div className="relative mt-10">
          <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-white/70">
            Merhaba <span className="text-white">👋</span>
          </h1>
          <h2 className="mt-1 text-[2rem] font-semibold tracking-[-0.03em] leading-[1.15]">
            Nasıl yardımcı
            <br />
            olabiliriz?
          </h2>
        </div>
      </div>

      <div className="relative -mt-6 flex flex-1 flex-col gap-3 px-4 pb-28">
        <button
          type="button"
          onClick={onCompose}
          className="group flex w-full items-center justify-between rounded-[1.25rem] bg-white p-4 text-left shadow-[0_14px_34px_rgba(15,23,42,0.10)] ring-1 ring-[#eef1ff] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
        >
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-slate-900">Bize mesaj gönderin</div>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] text-slate-500">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Genellikle 5 dakika içinde yanıtlıyoruz
            </div>
          </div>
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-[0_10px_22px_rgba(91,94,243,0.35)] transition group-hover:brightness-105"
            style={{ background: BUTTON_GRADIENT }}
          >
            <i className="fa-regular fa-paper-plane text-[0.9rem]" aria-hidden />
          </span>
        </button>

        {latestTicket && (
          <button
            type="button"
            onClick={() => onOpenTicket(latestTicket.id)}
            className="group flex w-full items-start gap-3 rounded-[1.25rem] bg-white p-4 text-left shadow-[0_10px_28px_rgba(15,23,42,0.08)] ring-1 ring-[#eef1ff] transition hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#5b5ef3]">
              <i className="fa-regular fa-comments text-[1.05rem]" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[13px] font-semibold uppercase tracking-[0.14em] text-[#8890bf]">
                  Son konuşmanız
                </span>
                <span className="shrink-0 text-[11px] text-slate-400">
                  {formatInboxTime(latestTicket.updatedAt)}
                </span>
              </div>
              <p className="mt-1 truncate text-[15px] font-semibold text-slate-900">
                {getTicketTitle(latestTicket)}
              </p>
              <p className="mt-0.5 truncate text-[13px] text-slate-500">
                {formatLastMessagePreview(latestTicket)}
              </p>
            </div>
            <i
              className="fa-solid fa-chevron-right mt-1 text-[0.75rem] shrink-0 text-slate-300 transition group-hover:text-slate-500"
              aria-hidden
            />
          </button>
        )}

        <div className="rounded-[1.25rem] bg-[linear-gradient(135deg,#f8fafe_0%,#eef2ff_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(91,94,243,0.08)]">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#5b5ef3]">
            <i className="fa-solid fa-bolt text-[0.75rem]" aria-hidden />
            Hızlı erişim
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 rounded-[1rem] bg-white px-2 py-3 text-center shadow-sm ring-1 ring-[#e6eaff] transition hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7f8ee] text-emerald-600">
                <i className="fa-brands fa-whatsapp text-[1.1rem]" aria-hidden />
              </span>
              <span className="text-[12px] font-semibold text-slate-800">WhatsApp</span>
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 rounded-[1rem] bg-white px-2 py-3 text-center shadow-sm ring-1 ring-[#e6eaff] transition hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5f0ff] text-sky-600">
                <i className="fa-brands fa-telegram text-[1.1rem]" aria-hidden />
              </span>
              <span className="text-[12px] font-semibold text-slate-800">Telegram</span>
            </a>
            <button
              type="button"
              onClick={onCompose}
              className="flex flex-col items-center gap-1.5 rounded-[1rem] bg-white px-2 py-3 text-center shadow-sm ring-1 ring-[#e6eaff] transition hover:-translate-y-0.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2eefd] text-[#5b5ef3]">
                <i className="fa-solid fa-headset text-[1rem]" aria-hidden />
              </span>
              <span className="text-[12px] font-semibold text-slate-800">Destek</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessagesTab({
  onClose,
  tickets,
  isLoading,
  onCompose,
  onOpenTicket,
  unreadTicketIds,
}: {
  onClose: () => void;
  tickets: SupportTicket[];
  isLoading: boolean;
  onCompose: () => void;
  onOpenTicket: (id: string) => void;
  unreadTicketIds: Set<string>;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-white">
      <div className="relative flex items-center justify-center border-b border-slate-100 bg-white px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900">
          Mesajlar
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Kapat"
        >
          <i className="fa-solid fa-xmark text-[0.95rem]" aria-hidden />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-40">
        {tickets.length === 0 ? (
          isLoading ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 pt-16 text-center">
              <i
                className="fa-solid fa-spinner animate-spin text-[1.5rem] text-slate-400"
                aria-hidden
              />
              <p className="mt-3 text-[13px] text-slate-500">Yükleniyor…</p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 pt-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-[#eef2ff] text-[#5b5ef3]">
                <i className="fa-regular fa-comments text-[1.4rem]" aria-hidden />
              </div>
              <p className="mt-4 text-[15px] font-semibold text-slate-900">
                Henüz mesajınız yok
              </p>
              <p className="mt-1 max-w-[18rem] text-[13px] leading-5 text-slate-500">
                Yeni bir sohbet başlatarak destek ekibimizle iletişime geçebilirsiniz.
              </p>
            </div>
          )
        ) : (
          <ul className="divide-y divide-slate-100">
            {tickets.map((item) => {
              const lastMessage = item.threadFlow?.[item.threadFlow.length - 1];
              const preview = formatLastMessagePreview(item);
              const hasUnread = unreadTicketIds.has(item.id);
              const lastSenderIsUser = lastMessage?.sender === "USER";

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onOpenTicket(item.id)}
                    className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-slate-50"
                  >
                    {lastSenderIsUser ? (
                      <span
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold uppercase tracking-wide text-white"
                        style={{ background: BUTTON_GRADIENT }}
                        aria-label="Siz"
                      >
                        Siz
                      </span>
                    ) : (
                      <span
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[#e6eaff]"
                        aria-label="Etkisepeti Destek"
                      >
                        <Image
                          src="/icon.png"
                          alt="Etki Sepeti"
                          width={28}
                          height={28}
                          className="h-7 w-7 object-contain"
                        />
                      </span>
                    )}

                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span className="flex items-center gap-1.5 truncate">
                          <span className="truncate text-[15px] font-semibold text-slate-900">
                            {getTicketTitle(item)}
                          </span>
                          {hasUnread && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff4d4f]" />
                          )}
                        </span>
                        <span className="shrink-0 text-[12px] text-slate-400">
                          {formatShortTime(item.updatedAt)}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[13px] leading-5 text-slate-500">
                        {preview}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-[72px] left-0 right-0 flex justify-center px-4 pb-3">
        <button
          type="button"
          onClick={onCompose}
          className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-[14px] font-semibold text-white shadow-[0_14px_32px_rgba(91,94,243,0.40)] transition hover:brightness-105 active:scale-[0.98]"
          style={{ background: BUTTON_GRADIENT }}
        >
          Bize mesaj gönderin
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <i className="fa-regular fa-paper-plane text-[0.7rem]" aria-hidden />
          </span>
        </button>
      </div>
    </div>
  );
}

function BottomNav({
  tab,
  setTab,
  unreadCount,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  unreadCount: number;
}) {
  const items: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: "home", label: "Ana Sayfa", icon: "fa-solid fa-house" },
    {
      id: "messages",
      label: "Mesajlar",
      icon: "fa-regular fa-comment",
      badge: unreadCount,
    },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex items-stretch justify-around border-t border-[#eef1ff] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md">
      {items.map((item) => {
        const isActive = tab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition ${
              isActive ? "text-[#5b5ef3]" : "text-slate-400 hover:text-slate-600"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="relative">
              <i className={`${item.icon} text-[1.05rem]`} aria-hidden />
              {typeof item.badge === "number" && item.badge > 0 && (
                <span className="absolute -right-1.5 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ff4d4f] px-1 text-[9px] font-bold text-white">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </span>
            <span
              className={`text-[11px] ${isActive ? "font-semibold" : "font-medium"}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ConversationScreen({
  onClose,
  onBack,
  selectedTicketId,
  ticket,
  ticketLoading,
  onTicketCreated,
  onTicketUpdated,
}: {
  onClose: () => void;
  onBack: () => void;
  selectedTicketId: string | null;
  ticket: SupportTicket | null;
  ticketLoading: boolean;
  onTicketCreated: (t: SupportTicket) => void;
  onTicketUpdated: (t: SupportTicket) => void;
}) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messages: ThreadFlowMessage[] = ticket?.threadFlow ?? [];
  const isClosed = ticket?.status === "closed";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isSending]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!inputRef.current) return;
    if (!input) {
      inputRef.current.style.height = "auto";
    }
  }, [input]);

  const showError = useCallback((msg: string) => {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setInlineError(msg);
    errorTimerRef.current = setTimeout(() => setInlineError(null), 5000);
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setInput("");
    setInlineError(null);
    setIsSending(true);

    try {
      if (!selectedTicketId) {
        const subject = text.length > 40 ? text.slice(0, 40) + "…" : text;
        const created = await createSupportTicket({ subject, message: text });
        onTicketCreated(created);
      } else {
        const updated = await replyToSupportTicket(selectedTicketId, {
          message: text,
        });
        onTicketUpdated(updated);
      }
    } catch (error: unknown) {
      const err = error as SupportApiError;
      if (err?.statusCode === 401) {
        showError(
          "Destek talebi açmak için hesabınıza giriş yapmanız gerekiyor. WhatsApp veya Telegram üzerinden ulaşabilirsiniz."
        );
      } else if (err?.statusCode === 403) {
        showError(
          "Bu destek talebine erişiminiz yok. Yeni bir sohbet başlatabilirsiniz."
        );
      } else {
        showError(err?.message || "Mesaj gönderilemedi. Lütfen tekrar deneyin.");
      }
      setInput(text);
    } finally {
      setIsSending(false);
    }
  }, [
    input,
    isSending,
    selectedTicketId,
    onTicketCreated,
    onTicketUpdated,
    showError,
  ]);

  const canSend = !!input.trim() && !isSending;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="relative z-10 flex items-center gap-2 border-b border-slate-100 bg-white px-2 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
          aria-label="Geri"
        >
          <i className="fa-solid fa-chevron-left text-[0.95rem]" aria-hidden />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-slate-100">
            <Image
              src="/icon.png"
              alt="Etki Sepeti"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold text-slate-900">
              Etkisepeti Destek Ekibi
            </h3>
            <p className="truncate text-[11px] text-slate-500">
              <span className="mr-1 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-emerald-500" />
              Çevrimiçi · Genellikle dakikalar içinde yanıtlar
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Kapat"
        >
          <i className="fa-solid fa-xmark text-[0.95rem]" aria-hidden />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-white">
        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
          {selectedTicketId && ticketLoading && !ticket && (
            <div className="flex h-full items-center justify-center">
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-[13px] text-slate-500">
                <i
                  className="fa-solid fa-spinner animate-spin text-[0.85rem] text-slate-400"
                  aria-hidden
                />
                Mesajlar yükleniyor...
              </div>
            </div>
          )}

          {messages.length === 0 && !isSending && !(selectedTicketId && ticketLoading) && (
            <div className="flex h-full flex-col items-center justify-center px-5 text-center">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-slate-100">
                <Image
                  src="/icon.png"
                  alt="Etki Sepeti"
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
              </span>
              <p className="mt-4 text-[15px] font-semibold text-slate-900">
                {selectedTicketId ? "Sohbet hazır" : "Yeni sohbet"}
              </p>
              <p className="mt-1 max-w-[18rem] text-[13px] leading-5 text-slate-500">
                {selectedTicketId
                  ? "Bu destek talebi için mesajınızı yazmaya devam edebilirsiniz."
                  : "Yardım ihtiyacınızı detaylı yazın. Destek ekibimiz en kısa sürede dönüş yapacak."}
              </p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isUser = msg.sender === "USER";
            const prev = idx > 0 ? messages[idx - 1] : null;
            const sameSenderAsPrev = prev && prev.sender === msg.sender;
            return (
              <div
                key={idx}
                className={`flex ${isUser ? "justify-end" : "justify-start"} ${
                  sameSenderAsPrev ? "mt-1" : "mt-3 first:mt-0"
                }`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 text-[14px] leading-5 rounded-[1.25rem] ${
                    isUser ? "text-white" : "bg-slate-100 text-slate-800"
                  }`}
                  style={isUser ? { background: USER_BUBBLE_GRADIENT } : undefined}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="mt-1 flex justify-end">
              <div
                className="rounded-[1.25rem] px-4 py-3"
                style={{ background: USER_BUBBLE_GRADIENT }}
              >
                <i
                  className="fa-solid fa-spinner animate-spin text-[0.8rem] text-white"
                  aria-hidden
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {isClosed && (
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-center">
            <p className="text-[12px] text-slate-500">Bu görüşme kapatıldı.</p>
          </div>
        )}

        {inlineError && (
          <div className="flex items-start gap-2 border-t border-red-100 bg-red-50 px-4 py-2.5">
            <i
              className="fa-solid fa-circle-exclamation mt-0.5 text-[0.95rem] shrink-0 text-red-500"
              aria-hidden
            />
            <p className="flex-1 text-[12px] text-red-600">{inlineError}</p>
            <button
              type="button"
              onClick={() => setInlineError(null)}
              className="shrink-0 text-red-400 transition hover:text-red-600"
              aria-label="Kapat"
            >
              <i className="fa-solid fa-xmark text-[0.8rem]" aria-hidden />
            </button>
          </div>
        )}

        {!isClosed && (
          <div className="bg-white px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
            <div
              className={`rounded-[1.5rem] border bg-white p-2 transition ${
                input ? "border-[#5b5ef3]" : "border-slate-200"
              } focus-within:border-[#5b5ef3] focus-within:shadow-[0_0_0_3px_rgba(91,94,243,0.10)]`}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  selectedTicketId
                    ? "Mesaj..."
                    : "Yardım ihtiyacınızı detaylı yazın..."
                }
                className="block max-h-[140px] w-full resize-none overflow-y-auto border-0 bg-transparent px-2 py-1.5 text-[14px] leading-5 text-slate-900 placeholder:text-slate-400 focus:outline-none"
                disabled={isSending}
                aria-label="Mesaj"
              />
              <div className="flex items-center justify-end px-1">
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                    canSend
                      ? "text-white shadow-[0_6px_14px_rgba(91,94,243,0.30)] hover:brightness-105"
                      : "bg-slate-100 text-slate-400"
                  }`}
                  style={
                    canSend ? { background: USER_BUBBLE_GRADIENT } : undefined
                  }
                  aria-label="Gönder"
                >
                  {isSending ? (
                    <i
                      className="fa-solid fa-spinner animate-spin text-[0.85rem]"
                      aria-hidden
                    />
                  ) : (
                    <i
                      className="fa-solid fa-arrow-up text-[0.85rem]"
                      aria-hidden
                    />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <span className="flex h-3 w-3 items-center justify-center overflow-hidden rounded-full">
                <Image
                  src="/icon.png"
                  alt=""
                  width={12}
                  height={12}
                  className="h-3 w-3 object-contain"
                />
              </span>
              <span>Etki Sepeti Destek</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getTicketTitle(ticket: SupportTicket): string {
  const subject = ticket.subject?.trim();
  if (!subject) return `Destek #${ticket.id.slice(0, 6)}`;
  return subject.length > 34 ? subject.slice(0, 34) + "…" : subject;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

function formatLastMessagePreview(ticket: SupportTicket): string {
  const last = ticket.threadFlow?.[ticket.threadFlow.length - 1];
  if (!last) {
    return ticket.status === "answered"
      ? "Destek ekibi mesajınızı bekliyor."
      : "Konuşma açıldı, detayları görmek için dokunun.";
  }
  const who = last.sender === "USER" ? "Siz" : "Destek";
  return `${who}: ${truncateText(last.message, 60)}`;
}

function formatShortTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) return "şimdi";
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}dk`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}sa`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day}g`;
    const week = Math.floor(day / 7);
    if (week < 5) return `${week}hf`;
    const month = Math.floor(day / 30);
    if (month < 12) return `${month}ay`;
    const year = Math.floor(day / 365);
    return `${year}y`;
  } catch {
    return "";
  }
}

function formatInboxTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const isSameDay =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isSameDay) {
      return date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}
