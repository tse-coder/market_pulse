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
    setLoading(true);

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
  }, [loaderRef.current, page, isFetchingMore, hasMore, loading]);

  return (
    <div className="flex h-screen bg-white text-zinc-900 font-sans overflow-hidden">
      {/* List Column */}
      <aside className="w-[400px] flex flex-col border-r border-zinc-100 bg-white shadow-sm">
        <div className="p-6 border-b border-zinc-50 flex items-center gap-4">
          <img
            src="/market_pulse.png"
            alt="Market Pulse"
            className="w-8 h-8 rounded-lg opacity-80"
          />
          <h1 className="text-sm font-black uppercase italic tracking-[0.2em] text-zinc-900">
            pulse clusters
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-minimal">
          {loading && clusters.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-5 h-5 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="p-6 text-red-600 text-[10px] font-bold bg-red-50 border-y border-red-100">
              {error}
            </div>
          )}

          <div className="divide-y divide-zinc-50">
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
            <div ref={loaderRef} className="py-12 text-center">
              <div className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.3em]">
                {isFetchingMore ? "• • •" : "End of Clusters"}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Detail Column */}
      <main className="flex-1 overflow-y-auto bg-white">
        {selectedCluster ? (
          <DetailSection
            selectedCluster={selectedCluster}
            clearSelection={() => setSelectedClusterId(null)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-50/50 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-white border border-zinc-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-zinc-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </div>
            </div>
            <div className="max-w-xs space-y-2">
              <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">
                Cluster Intelligence
              </h2>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                Select a market sector to reveal deep intelligence, upcoming
                startups, and social discussions mapping that demand space.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
