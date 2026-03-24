"use client";
import { useState, useEffect, useRef } from "react";
import { fetchClusters } from "@/lib/api";
import DetailSection from "./sections/detail";
import FeedCard from "./sections/feedCard";

export type ClusterItem = {
  id: string;
  name: string;
  description?: string;
  total_signals: number;
  total_startups: number;
  total_discussions: number;
  avg_sentiment: number;
  momentum_score: number;
  pain_score: number;
  opportunity_score: number;
  primary_tags: string[];
  created_at?: string;
};

export default function FeedPage() {
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    null,
  );
  const [clusters, setClusters] = useState<ClusterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const selectedCluster = clusters.find((c) => c.id === selectedClusterId);
  const LIMIT = 25;

  useEffect(() => {
    let mounted = true;

    fetchClusters(1, LIMIT)
      .then((data) => {
        if (!mounted) return;
        setClusters(data);
        setHasMore(data.length === LIMIT);
        setPage(1);
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

  // IntersectionObserver to load next page when loader visible
  useEffect(() => {
    if (!loaderRef.current) return;
    const node = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetchingMore && hasMore && !loading) {
          const nextPage = page + 1;
          setIsFetchingMore(true);
          fetchClusters(nextPage, LIMIT)
            .then((data) => {
              setClusters((prev) => [...prev, ...data]);
              setHasMore(data.length === LIMIT);
              setPage(nextPage);
            })
            .catch((err) => setError(String(err)))
            .finally(() => setIsFetchingMore(false));
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [page, isFetchingMore, hasMore, loading]);

  return (
    <div className="flex h-[100svh] max-h-[100svh] flex-col overflow-hidden border-zinc-200/70 bg-white/45 backdrop-blur-sm">
      <header className="flex items-center justify-between border-b border-zinc-200/70 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src="/market_pulse.png"
            alt="Market Pulse"
            className="h-9 w-9 rounded-lg border border-zinc-200/80 bg-white p-1"
          />
          <div>
            <p className="font-display text-sm font-semibold text-zinc-900">
              Market Pulse Feed
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Live Opportunity Clusters
            </p>
          </div>
        </div>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700">
          realtime
        </span>
      </header>

      <div className="grid h-full min-h-0 flex-1 lg:grid-cols-[360px_1fr]">
        <aside className="min-h-0 border-b border-zinc-200/60 bg-[#f6f2e8]/70 lg:border-b-0 lg:border-r lg:border-zinc-200/70">
          <div className="flex h-full flex-col">
            <div className="border-b border-zinc-100 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Trending sectors
              </p>
            </div>

            <div className="scrollbar-minimal flex-1 overflow-y-scroll">
              {loading && clusters.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" />
                </div>
              )}

              {error && (
                <div className="border-y border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2 p-2 sm:p-3">
                {clusters.map((cluster) => (
                  <FeedCard
                    key={cluster.id}
                    cluster={cluster}
                    selectedClusterId={selectedClusterId}
                    setSelectedClusterId={setSelectedClusterId}
                  />
                ))}
              </div>

              {hasMore && (
                <div ref={loaderRef} className="pb-6 pt-3 text-center">
                  <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-400">
                    {isFetchingMore ? "Loading more" : "Scroll for more"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="scrollbar-minimal min-h-0 overflow-y-scroll bg-white/60">
          {selectedCluster ? (
            <DetailSection
              key={selectedCluster.id}
              selectedCluster={selectedCluster}
              clearSelection={() => setSelectedClusterId(null)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="glass-panel max-w-md rounded-3xl p-8">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/70">
                  <svg
                    className="h-8 w-8 text-zinc-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-semibold text-zinc-900">
                  Pick a cluster to inspect
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Select any sector from the left panel to open AI summaries,
                  startup activity, and discussion signals.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
