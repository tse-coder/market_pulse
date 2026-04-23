import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ClusterItem } from "../page";

type SignalType = "startup" | "discussion" | "prediction";

type Signal = {
  type: SignalType;
};

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type ClusterAiSidebarProps = {
  cluster: ClusterItem;
  signals: Signal[];
  isOpen: boolean;
};

const DEFAULT_WIDTH = 380;
const MIN_WIDTH = 300;
const MAX_WIDTH = 640;

export default function ClusterAiSidebar({
  cluster,
  signals,
  isOpen,
}: ClusterAiSidebarProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [dragging, setDragging] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const startupCount = useMemo(
    () => signals.filter((s) => s.type === "startup").length,
    [signals],
  );
  const discussionCount = useMemo(
    () => signals.filter((s) => s.type === "discussion").length,
    [signals],
  );
  const predictionCount = useMemo(
    () => signals.filter((s) => s.type === "prediction").length,
    [signals],
  );

  useEffect(() => {
    setChatMessages([
      {
        id: `welcome-${cluster.id}`,
        role: "assistant",
        content: `Ask me anything about ${cluster.name}. I can summarize sentiment, risks, and startup opportunities.`,
      },
    ]);
    setChatInput("");
    setChatLoading(false);
  }, [cluster.id, cluster.name]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    if (!dragging || !isOpen) return;

    const onMouseMove = (event: MouseEvent) => {
      const viewportWidth = window.innerWidth;
      const nextWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, viewportWidth - event.clientX),
      );
      setWidth(nextWidth);
    };

    const onMouseUp = () => setDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, isOpen]);

  const buildFakeAssistantReply = (question: string) => {
    const q = question.toLowerCase();
    const opportunity = Math.round(cluster.opportunity_score);
    const pain = Math.round(cluster.pain_score);
    const sentiment =
      cluster.avg_sentiment > 0.1
        ? "positive"
        : cluster.avg_sentiment < -0.1
          ? "negative"
          : "neutral";

    if (q.includes("risk") || q.includes("concern") || q.includes("warning")) {
      return `Simulated risk readout: execution friction is elevated (${pain}% pain score), but social demand signals are still active. Suggested next move: test one narrow workflow and track retention by cohort.`;
    }

    if (q.includes("startup") || q.includes("founder") || q.includes("build")) {
      return `Simulated startup insight: we see ${startupCount} startup signals and ${discussionCount} discussion threads. Promising wedge: tools that reduce repetitive operator tasks for teams in this space.`;
    }

    if (q.includes("sentiment") || q.includes("mood") || q.includes("feeling")) {
      return `Simulated sentiment snapshot: tone is ${sentiment} with ${discussionCount} discussion signals shaping narrative momentum. Framing is practical, with users asking for usable implementation guidance.`;
    }

    if (q.includes("summary") || q.includes("overview") || q.includes("tldr")) {
      return `Simulated cluster summary: ${cluster.name} shows opportunity ${opportunity}, total signals ${cluster.total_signals} (${startupCount} startup, ${discussionCount} discussion, ${predictionCount} prediction). Demand appears real, differentiation still matters.`;
    }

    return `Simulated answer: ${cluster.name} currently shows meaningful market pull (opportunity ${opportunity}) with non-trivial user friction (${pain}% pain score). Ask for risk, sentiment, or startup opportunity for deeper detail.`;
  };

  const handleSendChat = (message: string) => {
    const cleanMessage = message.trim();
    if (!cleanMessage || chatLoading || !isOpen) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: cleanMessage,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: buildFakeAssistantReply(cleanMessage),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
      setChatLoading(false);
    }, 600);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      className="relative hidden h-full border-l border-zinc-200/80 bg-[#fbfbfa] lg:flex"
      style={{ width }}
    >
      <button
        type="button"
        onMouseDown={() => setDragging(true)}
        className="absolute left-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-zinc-300/60"
        aria-label="Resize AI panel"
      />

      <div className="flex h-full w-full flex-col">
        <div className="flex h-11 items-center justify-between border-b border-zinc-200 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700">
              Market-Pulse AI
            </span>
          </div>
        </div>

        <div className="border-b border-zinc-200 p-2">
          <div className="flex flex-wrap gap-1.5">
            {["Quick summary", "Key risks", "Startup ideas"].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSendChat(prompt)}
                className="rounded border border-zinc-200 bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="scrollbar-minimal min-h-0 flex-1 space-y-2 overflow-y-auto px-2 py-3">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`rounded px-2.5 py-2 text-sm leading-relaxed ${
                message.role === "assistant"
                  ? "border border-teal-200/80 bg-teal-50/60 text-zinc-700"
                  : "border border-zinc-200 bg-white text-zinc-900"
              }`}
            >
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {message.role === "assistant" ? "AI" : "You"}
              </div>
              {message.content}
            </div>
          ))}

          {chatLoading && (
            <div className="inline-flex items-center gap-2 rounded border border-teal-200/80 bg-teal-50/60 px-2 py-1.5 text-xs text-zinc-600">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-teal-200 border-t-teal-700" />
              Simulating response...
            </div>
          )}
          <div ref={messageEndRef} />
        </div>

        <form
          className="border-t border-zinc-200 p-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleSendChat(chatInput);
          }}
        >
          <div className="flex items-center gap-2">
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask about this Topic..."
              className="w-full rounded border border-zinc-200 bg-white px-2.5 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-400"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="rounded bg-zinc-900 px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-100 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
