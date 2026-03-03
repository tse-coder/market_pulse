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
    <div className="flex h-screen bg-white text-zinc-900 font-sans">
      <div
        className={`
          flex-shrink-0 border-r border-zinc-100 overflow-y-auto scrollbar-minimal
          ${selectedFeedId ? "hidden md:block w-96" : "w-full"}
        `}
      >
        {loading && (
          <div className="p-6 text-zinc-500 text-sm">Loading signals...</div>
        )}
        {error && <div className="p-6 text-red-500 text-sm">{error}</div>}
        <div className="flex flex-col">
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
          <div
            ref={loaderRef}
            className="p-10 text-center text-zinc-400 text-xs"
          >
            {isFetchingMore ? "Fetching more..." : "End of feed"}
          </div>
        )}
      </div>

      {selectedFeedId && selectedFeed && (
        <div className="flex-1 min-w-0 h-screen overflow-y-auto scrollbar-minimal bg-white">
          <DetailSection
            selectedFeed={selectedFeed}
            setSelectedFeedId={setSelectedFeedId}
          />
        </div>
      )}
    </div>
  );
}
