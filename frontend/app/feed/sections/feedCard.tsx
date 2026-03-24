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
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all sm:p-5 ${
        isSelected
          ? "border-teal-300 bg-teal-50/50 shadow-sm"
          : "border-zinc-200/80 bg-white/75 hover:border-zinc-300 hover:bg-white"
      }`}
    >
      {isSelected && (
        <div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-teal-500" />
      )}

      <div className="mb-2 flex items-start justify-between gap-4">
        <h3
          className={`font-display text-base leading-tight tracking-tight ${
            isSelected
              ? "text-teal-900"
              : "text-zinc-900 group-hover:text-zinc-950"
          }`}
        >
          {cluster.name}
        </h3>
        <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-medium text-zinc-600">
          {cluster.total_signals} signals
        </span>
      </div>

      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-600 transition-colors group-hover:text-zinc-700">
        {cluster.description ||
          "Synthesizing market intelligence from multiple social signals and platform data..."}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-zinc-200/70 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {cluster.primary_tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-200 bg-zinc-100/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600"
            >
              {tag}
            </span>
          ))}
          {cluster.total_startups > 0 && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700">
              {cluster.total_startups} startup
              {cluster.total_startups > 1 ? "S" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-zinc-900">
          <span className="text-base font-semibold tracking-tight">
            {Math.round(cluster.momentum_score)}
          </span>
          <svg
            className="h-3 w-3 text-emerald-600"
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
