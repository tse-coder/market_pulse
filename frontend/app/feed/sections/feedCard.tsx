import { iconMap } from "@/lib/constants/iconMap";
import React from "react";
type FeedCardProps = {
  feed: {
    id: string;
    source: "hacker_news" | "product_hunt" | "reddit";
    feedTitle?: string;
    time?: string;
    content: string;
    score?: number;
    total_score?: number;
    trend_score?: number;
    sentiment_score?: number;
    metadata?: any;
    tags?: string[];
    link?: { text: string; url: string };
  };
  selectedFeedId: string | null;
  setSelectedFeedId: (id: string | null) => void;
};
function FeedCard({ feed, selectedFeedId, setSelectedFeedId }: FeedCardProps) {
  return (
    <div
      onClick={() => setSelectedFeedId(feed.id)}
      className={`p-5 cursor-pointer transition-colors border-l-2 ${selectedFeedId === feed.id ? "bg-zinc-50 border-blue-500" : "bg-white border-transparent hover:bg-zinc-50/50"}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3
          className={`text-[13px] font-bold leading-tight ${selectedFeedId === feed.id ? "text-zinc-900" : "text-zinc-800"}`}
        >
          {feed.feedTitle}
        </h3>
        <span className="text-[9px] text-zinc-400 font-bold whitespace-nowrap ml-4">
          {feed.time ? new Date(feed.time).toLocaleDateString() : ""}
        </span>
      </div>

      <p className="text-[12px] text-zinc-500 line-clamp-2 leading-relaxed mb-3">
        {feed.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {feed.source === "reddit" && (
            <img
              src="/brand-icons/reddit/icon-primary.jpeg"
              alt="R"
              className="w-3.5 h-3.5 rounded-sm grayscale opacity-70"
            />
          )}
          {feed.source === "product_hunt" && (
            <img
              src="/brand-icons/product-hunt/icon-primary.png"
              alt="P"
              className="w-3.5 h-3.5 rounded-sm grayscale opacity-70"
            />
          )}
          {feed.source === "hacker_news" && (
            <img
              src="/brand-icons/hacker-news/icon-primary.jpeg"
              alt="H"
              className="w-3.5 h-3.5 rounded-sm grayscale opacity-70"
            />
          )}
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
            {feed.source.replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center gap-1 text-zinc-400">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span className="text-[9px] font-mono">
            {Math.round(feed.total_score || feed.score || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FeedCard;
