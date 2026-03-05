import React, { useState, useEffect } from "react";
import { ClusterItem } from "../page";
import { fetchClusterSignals } from "@/lib/api";

type Signal = {
  id: string;
  source: string;
  platform: string;
  title?: string;
  content: string;
  type: "startup" | "discussion" | "prediction";
  score?: number;
  total_score?: number;
  sentiment_score?: number;
  ai_summary?: string;
  ai_sentiment?: string;
  ai_topics?: string[];
  url?: string;
  time?: string;
};

type DetailSectionProps = {
  selectedCluster: ClusterItem;
  clearSelection: () => void;
};

export default function DetailSection({ selectedCluster }: DetailSectionProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "startup" | "discussion" | "prediction"
  >("startup");

  useEffect(() => {
    setLoading(true);
    fetchClusterSignals(selectedCluster.id)
      .then((data) => {
        setSignals(data);
        // Default to first available tab
        const types = data.map((s: any) => s.type);
        if (types.includes("startup")) setActiveTab("startup");
        else if (types.includes("discussion")) setActiveTab("discussion");
        else setActiveTab("prediction");
      })
      .finally(() => setLoading(false));
  }, [selectedCluster.id]);

  const filteredSignals = signals.filter((s) => s.type === activeTab);

  const cluster = selectedCluster;
  // Generate some dummy history points for the graph based on opportunity score
  const historyPoints = Array.from({ length: 8 }, (_, i) => ({
    val: Math.max(
      0,
      cluster.opportunity_score - (7 - i) * 5 + Math.random() * 15,
    ),
    label: `D-${7 - i}`,
  }));

  return (
    <div className="flex flex-col h-full bg-white relative animate-fade-in">
      <div className="p-12 pb-6 max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-600 px-2 py-0.5 rounded font-black uppercase tracking-tighter">
              Intelligence Cluster
            </span>
            <span className="text-zinc-200">/</span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              {cluster.total_signals} Social Signals Identified
            </span>
          </div>

          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter leading-[0.9] uppercase italic max-w-2xl">
            {cluster.name}
          </h1>

          <p className="text-[13px] text-zinc-500 font-medium leading-[1.7] max-w-2xl border-l-2 border-zinc-100 pl-6 py-1">
            {cluster.description ||
              "Synthesizing market intelligence from multiple social signals and platform data to map emerging demand vectors and startup opportunities in this sector."}
          </p>
        </div>

        {/* Pulse Score Graph Placeholder using SVG */}
        <div className="mb-12 p-8 bg-zinc-50/50 rounded-3xl border border-zinc-100 overflow-hidden relative group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                Opportunity momentum
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-zinc-900 tracking-tighter italic">
                  {Math.round(cluster.opportunity_score)}
                </span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  +12.5% trending
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-right">
                <span className="block text-[8px] font-bold text-zinc-400 uppercase">
                  Sentiment
                </span>
                <span
                  className={`text-[11px] font-black uppercase ${cluster.avg_sentiment > 0 ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {cluster.avg_sentiment > 0.1
                    ? "Positive Pulse"
                    : cluster.avg_sentiment < -0.1
                      ? "Negative Pulse"
                      : "Neutral"}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] font-bold text-zinc-400 uppercase">
                  Pain Score
                </span>
                <span className="text-[11px] font-black text-rose-500 uppercase">
                  {Math.round(cluster.pain_score)}% Friction
                </span>
              </div>
            </div>
          </div>

          <div className="h-32 flex items-end gap-3 group-hover:gap-4 transition-all pr-4">
            {historyPoints.map((p, i) => {
              const height =
                (p.val / Math.max(...historyPoints.map((v) => v.val))) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group/bar"
                >
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 delay-[${i * 100}ms] ${
                      i === historyPoints.length - 1
                        ? "bg-blue-500 shadow-lg"
                        : "bg-zinc-200 group-hover/bar:bg-blue-200"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[9px] font-black text-zinc-400 uppercase opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signals Tabs */}
        <div className="border-b border-zinc-100 flex items-center gap-8 mb-8 sticky top-0 bg-white z-10 py-2">
          {(["startup", "discussion", "prediction"] as const).map((tab) => {
            const count = signals.filter((s) => s.type === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab
                    ? "text-zinc-900"
                    : "text-zinc-300 hover:text-zinc-500"
                }`}
              >
                {tab}S ({count})
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 animate-slide-in" />
                )}
              </button>
            );
          })}
        </div>

        {/* Signals Content */}
        <div className="space-y-12 mb-20">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-40">
              <div className="w-5 h-5 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
              <span className="text-[9px] font-bold uppercase mt-4 tracking-widest">
                Hydrating Intelligence
              </span>
            </div>
          ) : filteredSignals.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-zinc-50 rounded-3xl">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
                No mapped {activeTab}s in this sector
              </span>
            </div>
          ) : (
            filteredSignals.map((signal) => (
              <div
                key={signal.id}
                className="group border-b border-zinc-50 pb-12 last:border-0 hover:bg-zinc-50/20 -mx-6 px-6 transition-colors rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={
                      signal.platform === "reddit"
                        ? "/brand-icons/reddit/icon-primary.jpeg"
                        : signal.platform === "product_hunt"
                          ? "/brand-icons/product-hunt/icon-primary.png"
                          : "/brand-icons/hacker-news/icon-primary.jpeg"
                    }
                    className="w-4 h-4 rounded-full grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100"
                  />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900">
                    {signal.platform.replace("_", " ")}
                  </span>
                  <span className="text-zinc-200">•</span>
                  <span className="text-[9px] font-bold text-zinc-300 uppercase">
                    {signal.time
                      ? new Date(signal.time).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <h3 className="text-lg font-black text-zinc-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                  {signal.title}
                </h3>

                <div className="prose prose-sm prose-zinc text-zinc-500 line-clamp-3 leading-relaxed mb-6 font-medium">
                  {signal.content}
                </div>

                <div className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl mb-6">
                  <span className="block text-[8px] font-black text-zinc-400 uppercase mb-2">
                    AI Pulse Summary
                  </span>
                  <p className="text-[11.5px] font-bold text-zinc-600 leading-relaxed italic">
                    "
                    {signal.ai_summary ||
                      "Automated analysis pending deep semantic verification..."}
                    "
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {signal.ai_topics?.map((topic) => (
                      <span
                        key={topic}
                        className="text-[8.5px] px-2 py-0.5 border border-zinc-200 rounded-full font-black text-zinc-400 uppercase group-hover:bg-white transition-colors"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {signal.url && (
                    <a
                      href={signal.url}
                      target="_blank"
                      className="text-[9px] font-black uppercase italic tracking-widest text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      Source ↗
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
