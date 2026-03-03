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
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => setSelectedFeedId(null)}
        className="text-xs text-zinc-400 hover:text-blue-500 transition-colors mb-8"
      >
        ← CLOSE
      </button>

      <div className="mb-10">
        <h1 className="text-xl font-bold text-zinc-800 mb-2 leading-tight">
          {selectedFeed.feedTitle}
        </h1>
        <div className="flex gap-3 text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
          <span>{selectedFeed.source.replace("_", " ")}</span>
          <span>•</span>
          <span>
            {selectedFeed.time
              ? new Date(selectedFeed.time).toLocaleString()
              : ""}
          </span>
        </div>
      </div>

      <div className="prose prose-sm prose-zinc text-zinc-600 leading-relaxed mb-10">
        <div dangerouslySetInnerHTML={{ __html: selectedFeed.content }} />
      </div>

      {selectedFeed.link && (
        <div className="mb-12">
          <a
            href={selectedFeed.link.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1"
          >
            VIEW SOURCE <span className="text-[10px]">↗</span>
          </a>
        </div>
      )}

      <div className="border-t border-zinc-100 pt-8 mt-12">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">
          AI Insights
        </h3>
        <div className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-zinc-50 pb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              Sentiment
            </span>
            <span className="text-xs text-zinc-600">
              {selectedFeed.ai_sentiment}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-2">
              Summary
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {selectedFeed.ai_summary}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-2">
              Topics
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedFeed.ai_topics?.map((topic) => (
                <span
                  key={topic}
                  className="text-[9px] px-1.5 py-0.5 bg-zinc-50 border border-zinc-100 rounded text-zinc-400"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-baseline border-t border-zinc-50 pt-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              Score
            </span>
            <span className="text-xs text-zinc-600">{selectedFeed.score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailSection;
