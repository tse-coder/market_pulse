import { iconMap } from "@/lib/constants/iconMap";
import React from "react";
type DetailSectionProps = {
  selectedFeed: {
    id: string;
    source: string;
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
  setSelectedFeedId: (id: string | null) => void;
};
function DetailSection({
  selectedFeed,
  setSelectedFeedId,
}: DetailSectionProps) {
  return (
    <div className="p-12 max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-2xl font-black text-zinc-900 mb-6 leading-tight tracking-tight">
          {selectedFeed.feedTitle}
        </h1>
        <div className="flex items-center gap-4 border-b border-zinc-100 pb-8">
          <div className="flex items-center gap-2">
            {selectedFeed.source === "reddit" && (
              <img
                src="/brand-icons/reddit/icon-primary.jpeg"
                alt="R"
                className="w-4 h-4 rounded-sm grayscale"
              />
            )}
            {selectedFeed.source === "product_hunt" && (
              <img
                src="/brand-icons/product-hunt/icon-primary.png"
                alt="P"
                className="w-4 h-4 rounded-sm grayscale"
              />
            )}
            {selectedFeed.source === "hacker_news" && (
              <img
                src="/brand-icons/hacker-news/icon-primary.jpeg"
                alt="H"
                className="w-4 h-4 rounded-sm grayscale"
              />
            )}
            <span className="text-[10px] text-zinc-900 uppercase tracking-widest font-black">
              {selectedFeed.source.replace("_", " ")}
            </span>
          </div>
          <span className="text-zinc-200">/</span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
            {selectedFeed.time
              ? new Date(selectedFeed.time).toLocaleString()
              : ""}
          </span>
        </div>
      </div>

      <div className="prose prose-sm prose-zinc text-zinc-600 leading-relaxed mb-12 max-w-none">
        <div dangerouslySetInnerHTML={{ __html: selectedFeed.content }} />
      </div>

      {selectedFeed.link && (
        <div className="mb-16">
          <a
            href={selectedFeed.link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[10px] text-zinc-900 hover:underline uppercase tracking-widest font-black"
          >
            VIEW SOURCE ↗
          </a>
        </div>
      )}

      <div className="space-y-12 pt-12 border-t border-zinc-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2">
                Sentiment
              </span>
              <div className="text-sm font-bold text-zinc-900 capitalize border-l-2 border-zinc-900 pl-3">
                {selectedFeed.ai_sentiment}
              </div>
            </div>

            <div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-3">
                Topics
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedFeed.ai_topics?.map((topic) => (
                  <span
                    key={topic}
                    className="text-[9px] px-2 py-1 bg-zinc-50 border border-zinc-100 rounded text-zinc-600 font-bold uppercase"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2">
                Summary
              </span>
              <p className="text-xs text-zinc-500 leading-relaxed italic">
                {selectedFeed.ai_summary}
              </p>
            </div>

            <div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2">
                Signal Strength
              </span>
              <div className="text-2xl font-black text-zinc-900">
                {Math.round(
                  selectedFeed.total_score || selectedFeed.score || 0,
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailSection;
