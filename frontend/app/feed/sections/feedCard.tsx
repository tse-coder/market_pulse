import { iconMap } from "@/lib/constants/iconMap";
import React from "react";
type FeedCardProps = {
  feed: {
    id: string;
    source: "hacker news" | "product hunt" | "reddit";
    feedTitle?: string;
    time?: string;
    content: string;
    tags?: string[];
    link?: { text: string; url: string };
  };
  selectedFeedId: string | null;
  setSelectedFeedId: (id: string | null) => void;
};
function FeedCard({ feed, selectedFeedId, setSelectedFeedId }: FeedCardProps) {
  return (
    <div
      key={feed.id}
      onClick={() => setSelectedFeedId(feed.id)}
      className={`p-5 border-b border-zinc-100 cursor-pointer transition-colors ${selectedFeedId === feed.id ? "bg-zinc-50 border-l-4 border-l-blue-600" : "bg-white hover:bg-zinc-50 border-l-4 border-l-transparent"}`}
    >
      <div className="flex gap-4">
        <div className="w-12 h-12 flex-shrink-0 bg-white rounded-full overflow-hidden border border-zinc-200 shadow-sm mt-1">
          {/* Used standard image tag as per the user's icon setup */}
          <img
            src={iconMap[feed.source]}
            alt="Source Icon"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 text-sm truncate flex-wrap sm:flex-nowrap">
            <span className="text-black font-bold whitespace-nowrap">
              {feed.feedTitle}
            </span>
            <span className="text-zinc-500 whitespace-nowrap">
              {feed.time ? new Date(feed.time).toLocaleString() : ""}
            </span>
          </div>
          <div className="mt-1 text-zinc-800 text-[15px] leading-relaxed break-words whitespace-pre-wrap line-clamp-4">
            {feed.content}
          </div>
          {feed.tags && (
            <div className="mt-2 text-blue-600 text-[14px]">
              {feed.tags.join(" ")}
            </div>
          )}
          {feed.link && (
            <div className="mt-2 text-blue-600 text-[14px] truncate flex items-center gap-1 bg-zinc-50 border border-zinc-100 rounded px-2 py-1 w-fit max-w-full">
              <a href={feed.link.url} className="truncate underline">
                {feed.link.text}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedCard;
