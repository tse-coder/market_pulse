import React from "react";
import { ClusterItem } from "../page";

type FeedCardProps = {
  cluster: ClusterItem;
  selectedClusterId: string | null;
  setSelectedClusterId: (id: string | null) => void;
};

function FeedCard({
  cluster,
  selectedClusterId,
  setSelectedClusterId,
}: FeedCardProps) {
  const isSelected = selectedClusterId === cluster.id;

  return (
    <div
      onClick={() => setSelectedClusterId(cluster.id)}
      className={`p-6 cursor-pointer transition-all border-l-2 relative overflow-hidden group ${
        isSelected
          ? "bg-zinc-50 border-blue-500 shadow-sm"
          : "bg-white border-transparent hover:bg-zinc-50/50"
      }`}
    >
      {/* Visual pulse indicator for selected */}
      {isSelected && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-100 rounded-l-full blur-sm" />
      )}

      <div className="flex justify-between items-start mb-2 gap-4">
        <h3
          className={`text-[13px] font-black leading-tight tracking-tight uppercase ${
            isSelected
              ? "text-blue-600"
              : "text-zinc-900 group-hover:text-zinc-900"
          }`}
        >
          {cluster.name}
        </h3>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-100/50 border border-zinc-100/50 text-[9px] text-zinc-500 font-black tracking-tighter shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {cluster.total_signals} S
        </span>
      </div>

      <p className="text-[11.5px] text-zinc-400 font-medium line-clamp-2 leading-[1.6] mb-4 group-hover:text-zinc-500 transition-colors">
        {cluster.description ||
          "Synthesizing market intelligence from multiple social signals and platform data..."}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-dashed border-zinc-100">
        <div className="flex flex-wrap gap-1.5 items-center">
          {cluster.primary_tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[8.5px] px-2 py-0.5 bg-zinc-50 border border-zinc-100 rounded text-zinc-500 font-black uppercase tracking-widest"
            >
              {tag}
            </span>
          ))}
          {cluster.total_startups > 0 && (
            <span className="text-[8.5px] px-2 py-0.5 bg-blue-50/50 border border-blue-100/50 rounded text-blue-500 font-black uppercase tracking-widest">
              {cluster.total_startups} STARTUP
              {cluster.total_startups > 1 ? "S" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-zinc-900">
          <span className="text-[14px] font-black tracking-tighter">
            {Math.round(cluster.momentum_score)}
          </span>
          <svg
            className="w-3 h-3 text-emerald-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
              className="rotate-180 origin-center"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default FeedCard;
