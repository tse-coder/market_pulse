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
      className={`
        p-4 border-b border-zinc-100 cursor-pointer select-none
        ${selectedFeedId === feed.id ? "bg-zinc-50" : "hover:bg-zinc-50/50"}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-sm font-semibold truncate pr-4 text-zinc-800">
          {feed.feedTitle}
        </h3>
        <span className="text-[10px] text-zinc-400 whitespace-nowrap uppercase tracking-wider">
          {feed.time ? new Date(feed.time).toLocaleDateString() : ""}
        </span>
      </div>
      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
        {feed.content}
      </p>
      <div className="mt-2 text-[10px] text-zinc-400 flex gap-2">
        <span className="font-medium text-zinc-500 capitalize">
          {feed.source.replace("_", " ")}
        </span>
        <span>•</span>
        <span>Score: {feed.score}</span>
      </div>
    </div>
  );
}

export default FeedCard;
