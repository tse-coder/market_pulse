import React, { useEffect, useMemo, useState } from "react";
import { ClusterItem } from "../page";
import { fetchClusterSignals } from "@/lib/api";
import { getMockClusterHistory } from "@/lib/constants/mockClusterGraphData";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

export default function DetailSection({
  selectedCluster,
  clearSelection,
}: DetailSectionProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "startup" | "discussion" | "prediction"
  >("startup");

  useEffect(() => {
    fetchClusterSignals(selectedCluster.id)
      .then((data) => {
        setSignals(data);
        // Default to first available tab
        const types = data.map((s: Signal) => s.type);
        if (types.includes("startup")) setActiveTab("startup");
        else if (types.includes("discussion")) setActiveTab("discussion");
        else setActiveTab("prediction");
      })
      .finally(() => setLoading(false));
  }, [selectedCluster.id]);

  const filteredSignals = signals.filter((s) => s.type === activeTab);

  const cluster = selectedCluster;
  const mockHistoryPoints = useMemo(
    () => getMockClusterHistory(cluster.id),
    [cluster.id],
  );
  const chartData = useMemo(
    () => mockHistoryPoints.map((point) => ({ week: point.label, momentum: point.val })),
    [mockHistoryPoints],
  );
  const chartConfig = {
    momentum: {
      label: "Momentum",
      color: "#0f766e",
    },
  } satisfies ChartConfig;

  return (
    <div className="relative flex h-full flex-col">
      <div className="mx-auto w-full max-w-4xl p-5 pb-6 sm:p-8 lg:p-10">
        <div className="mb-10 space-y-5">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700">
              Intelligence Cluster
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              {cluster.total_signals} Social Signals Identified
            </span>
          </div>

          <h1 className="font-display max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            {cluster.name}
          </h1>

          <p className="max-w-3xl border-l-2 border-zinc-300 pl-4 text-sm leading-relaxed text-zinc-600 sm:pl-5 sm:text-base">
            {cluster.description ||
              "Synthesizing market intelligence from multiple social signals and platform data to map emerging demand vectors and startup opportunities in this sector."}
          </p>
        </div>

        <div className="glass-panel group relative mb-10 overflow-hidden rounded-3xl p-5 sm:p-7">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
            <div>
              <button
                onClick={clearSelection}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 transition hover:border-zinc-300 hover:bg-white hover:text-zinc-900 lg:hidden"
              >
                <span aria-hidden>←</span> back to sectors
              </button>
              <h4 className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                Opportunity momentum
              </h4>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-semibold tracking-tight text-zinc-900">
                  {Math.round(cluster.opportunity_score)}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  +12.5% trending
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  Sentiment
                </span>
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${cluster.avg_sentiment > 0 ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {cluster.avg_sentiment > 0.1
                    ? "Positive Pulse"
                    : cluster.avg_sentiment < -0.1
                      ? "Negative Pulse"
                      : "Neutral"}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  Pain Score
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                  {Math.round(cluster.pain_score)}% Friction
                </span>
              </div>
            </div>
          </div>

          <div className="pr-2 sm:pr-4">
            <div className="relative rounded-2xl border border-zinc-200/80 bg-white/60 p-2">
              <ChartContainer config={chartConfig} className="h-40 w-full">
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -12, bottom: 10 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="momentum"
                    type="linear"
                    stroke="var(--color-momentum)"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "var(--color-momentum)", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "var(--color-momentum)", strokeWidth: 0 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-10 mb-7 flex items-center gap-2 overflow-x-auto border-b border-zinc-200 bg-[#f8f5ee]/95 py-2 backdrop-blur">
          {(["startup", "discussion", "prediction"] as const).map((tab) => {
            const count = signals.filter((s) => s.type === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all ${
                  activeTab === tab
                    ? "bg-zinc-900 text-zinc-50"
                    : "bg-white/80 text-zinc-600 hover:bg-white hover:text-zinc-900"
                }`}
              >
                {tab}S ({count})
              </button>
            );
          })}
        </div>

        <div className="mb-20 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
              <span className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em]">
                Hydrating Intelligence
              </span>
            </div>
          ) : filteredSignals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/60 py-20 text-center">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
                No mapped {activeTab}s in this sector
              </span>
            </div>
          ) : (
            filteredSignals.map((signal) => (
              <div
                key={signal.id}
                className="group rounded-2xl border border-zinc-200/70 bg-white/75 p-5 transition hover:border-zinc-300 hover:bg-white"
              >
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={
                      signal.platform === "reddit"
                        ? "/brand-icons/reddit/icon-primary.jpeg"
                        : signal.platform === "product_hunt"
                          ? "/brand-icons/product-hunt/icon-primary.png"
                          : "/brand-icons/hacker-news/icon-primary.jpeg"
                    }
                      className="h-5 w-5 rounded-full object-cover opacity-70 transition-all group-hover:opacity-100"
                      alt={signal.platform}
                  />
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 group-hover:text-zinc-900">
                    {signal.platform.replace("_", " ")}
                  </span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                    {signal.time
                      ? new Date(signal.time).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                  <h3 className="font-display mb-2 text-xl font-semibold tracking-tight text-zinc-900 group-hover:text-teal-800">
                  {signal.title}
                </h3>

                  <div className="mb-5 line-clamp-3 text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
                  {signal.content}
                </div>

                  <div className="mb-5 rounded-2xl border border-teal-200/80 bg-teal-50/60 p-4">
                    <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-teal-700">
                    AI Pulse Summary
                  </span>
                    <p className="text-sm leading-relaxed text-zinc-700">
                      &quot;
                    {signal.ai_summary ||
                      "Automated analysis pending deep semantic verification..."}
                      &quot;
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {signal.ai_topics?.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-zinc-200 bg-zinc-100/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600 transition-colors group-hover:bg-white"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {signal.url && (
                    <a
                      href={signal.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700 transition-colors hover:text-teal-900"
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
