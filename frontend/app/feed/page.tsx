"use client";
import { useState, useEffect, useRef } from "react";
import { fetchSignalsPage } from "@/lib/api";
import DetailSection from "./sections/detail";
import FeedCard from "./sections/feedCard";

type FeedItem = {
  id: string;
  source: "hacker_news" | "product_hunt" | "reddit";
  feedTitle?: string;
  time?: string;
  content: string;
  score?: number;
  total_score?: number;
  trend_score?: number;
  sentiment_score?: number;
  ai_summary?: string;
  ai_sentiment?: string;
  ai_topics?: string[];
  metadata?: any;
  tags?: string[];
  link?: { text: string; url: string };
};

export default function FeedPage() {
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const selectedFeed = feeds.find((f) => f.id === selectedFeedId);
  const LIMIT = 25;

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchSignalsPage(1, LIMIT)
      .then((data) => {
        if (!mounted) return;
        const mapped: FeedItem[] = data.map((s: any) => ({
          id: s.id,
          source: s.platform as "hacker_news" | "product_hunt" | "reddit",
          feedTitle: s.title,
          content: s.content,
          score: s.score,
          total_score: s.total_score,
          trend_score: s.trend_score,
          sentiment_score: s.sentiment_score,
          ai_summary: s.ai_summary,
          ai_sentiment: s.ai_sentiment,
          ai_topics: s.ai_topics,
          metadata: s.metadata,
          time: s.time,
          link: s.url ? { text: s.url, url: s.url } : undefined,
        }));
        setFeeds(mapped);
        setHasMore(data.length === LIMIT);
        setPage(1);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(String(err));
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // IntersectionObserver to load next page when loader visible
  useEffect(() => {
    if (!loaderRef.current) return;
    const node = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetchingMore && hasMore && !loading) {
          const nextPage = page + 1;
          setIsFetchingMore(true);
          fetchSignalsPage(nextPage, LIMIT)
            .then((data) => {
              const mapped: FeedItem[] = data.map((s: any) => ({
                id: s.id,
                source: s.platform as "hacker_news" | "product_hunt" | "reddit",
                feedTitle: s.title,
                content: s.content,
                score: s.score,
                total_score: s.total_score,
                trend_score: s.trend_score,
                sentiment_score: s.sentiment_score,
                ai_summary: s.ai_summary,
                ai_sentiment: s.ai_sentiment,
                ai_topics: s.ai_topics,
                metadata: s.metadata,
                time: s.time,
                link: s.url ? { text: s.url, url: s.url } : undefined,
              }));
              setFeeds((prev) => [...prev, ...mapped]);
              setHasMore(data.length === LIMIT);
              setPage(nextPage);
            })
            .catch((err) => setError(String(err)))
            .finally(() => setIsFetchingMore(false));
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loaderRef.current, page, isFetchingMore, hasMore, loading]);

  return (
    <div className="flex h-screen bg-white text-zinc-900 font-sans overflow-hidden">
      {/* List Column */}
      <aside className="w-[400px] flex flex-col border-r border-zinc-100 bg-white shadow-sm">
        <div className="p-6 border-b border-zinc-50 flex items-center gap-4">
          <img
            src="/market_pulse.png"
            alt="Market Pulse"
            className="w-8 h-8 rounded-lg opacity-80"
          />
          <h1 className="text-sm font-black uppercase italic tracking-[0.2em] text-zinc-900">
            pulse
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-minimal">
          {loading && feeds.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-5 h-5 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="p-6 text-red-600 text-[10px] font-bold bg-red-50 border-y border-red-100">
              {error}
            </div>
          )}

          <div className="divide-y divide-zinc-50">
            {feeds.map((feed) => (
              <FeedCard
                key={feed.id}
                feed={feed}
                selectedFeedId={selectedFeedId}
                setSelectedFeedId={setSelectedFeedId}
              />
            ))}
          </div>

          {hasMore && (
            <div ref={loaderRef} className="py-12 text-center">
              <div className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.3em]">
                {isFetchingMore ? "• • •" : "End of Feed"}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Detail Column */}
      <main className="flex-1 overflow-y-auto bg-white">
        {selectedFeed ? (
          <DetailSection
            selectedFeed={selectedFeed}
            setSelectedFeedId={setSelectedFeedId}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-zinc-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="max-w-xs space-y-1">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">
                Intelligence Selected Needed
              </h2>
              <p className="text-xs text-zinc-400">
                Choose a signal from the left pane to analyze its market impact
                and sentiment pulse.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
