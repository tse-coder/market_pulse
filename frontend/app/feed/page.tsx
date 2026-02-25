"use client";
import { useState, useEffect } from "react";
import { fetchSignals } from "@/lib/api";
import DetailSection from "./sections/detail";
import FeedCard from "./sections/feedCard";

type FeedItem = {
  id: string;
  source: "hacker news" | "product hunt" | "reddit";
  feedTitle?: string;
  time?: string;
  content: string;
  tags?: string[];
  link?: { text: string; url: string };
};



export default function FeedPage() {
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const selectedFeed = feeds.find((f) => f.id === selectedFeedId);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchSignals()
      .then((data) => {
        if (!mounted) return;
        // Map backend signal fields to feed item shape
        const mapped: FeedItem[] = data.map((s: any) => ({
          id: s.id,
          source: s.platform,
          content: s.content,
          time: s.time,
          link: s.url ? { text: s.url, url: s.url } : undefined,
        }));
        setFeeds(mapped);
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

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col">
      <div className="flex flex-1 w-full relative h-[calc(100vh-65px)] overflow-hidden">
        {/* Left Column: Feed List */}
        <div
          className={`
            overflow-y-scroll max-h-screen border-r border-zinc-200 bg-white transition-all duration-300
            ${selectedFeedId ? "w-full md:w-1/2 lg:w-[450px] hidden md:block" : "w-full max-w-2xl mx-auto block"}
          `}
        >
          {loading && (
            <div className="p-6 text-center text-zinc-500">
              Loading signals…
            </div>
          )}
          {error && <div className="p-6 text-center text-red-500">{error}</div>}
          {feeds.map((feed) => (
            <FeedCard
              key={feed.id}
              feed={feed}
              selectedFeedId={selectedFeedId}
              setSelectedFeedId={setSelectedFeedId}
            />
          ))}
        </div>

        {/* Right Column: Detail View */}
        {selectedFeedId && selectedFeed && (
          <DetailSection
            selectedFeed={selectedFeed}
            setSelectedFeedId={setSelectedFeedId}
          />
        )}
      </div>
    </div>
  );
}
