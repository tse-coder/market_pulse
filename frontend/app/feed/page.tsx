"use client";

import { iconMap } from "@/lib/constants/iconMap";
import { useState } from "react";

type FeedItem = {
  id: string;
  source: "hacker news"| "product hunt" | "reddit";
  feedTitle: string;
  time: string;
  content: string;
  tags?: string[];
  link?: { text: string; url: string };
};

const mockFeeds: FeedItem[] = [
  {
    id: "1",
    feedTitle: "Socal Media bootstraping",
    source: "reddit",
    time: "5d",
    content:
      "We are bootstrapping @konnect22 a social media to connect individuals with successful people to bring out the best in them\n\nIf you are mentor, contributor or a thinker, comment below 👇 how to make it more useful for a society\n\nFollow us on Twitter to build one of the self sustaining community",
    tags: ["#startup", "#marketing", "#AI", "#FutureOfWork"],
  },
  {
    id: "2",
    feedTitle: "Product Hunt",
    source: "product hunt",
    time: "28 Jun",
    content:
      "Hey everyone! I'm super excited to hunt this small project from @savio on ProductHunt!\n\nIt will double your productivity and focus.",
  },
  {
    id: "3",
    feedTitle: "3D course",
    source: "hacker news",
    time: "28 Jun",
    content: "This is mind-blowing, one of the best course",
    link: { text: "https://threejs-journey.xyz/--", url: "#" },
  },
  {
    id: "4",
    feedTitle: "AI-based wrapper",
    source: "hacker news",
    time: "2h",
    content:
      "Has anyone tried building an AI-based wrapper and actually monetized it? Looking for strategies out there to evaluate market demand.",
    tags: ["#AI", "#SaaS", "#IndieHacker"],
  },
];

export default function FeedPage() {
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);

  const selectedFeed = mockFeeds.find((f) => f.id === selectedFeedId);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col">
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-10 px-6 py-4 flex items-center justify-between">

        {selectedFeedId && (
          <button
            onClick={() => setSelectedFeedId(null)}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 md:hidden"
          >
            ← Back
          </button>
        )}
      </header>

      <div className="flex flex-1 w-full relative h-[calc(100vh-65px)] overflow-hidden">
        {/* Left Column: Feed List */}
        <div
          className={`
            overflow-y-auto h-full border-r border-zinc-200 bg-white transition-all duration-300
            ${selectedFeedId ? "w-full md:w-1/2 lg:w-[450px] hidden md:block" : "w-full max-w-2xl mx-auto block"}
          `}
        >
          {mockFeeds.map((feed) => (
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
                      {feed.time}
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
                      <span className="truncate">{feed.link.text}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Detail View */}
        {selectedFeedId && selectedFeed && (
          <div
            className={`flex-1 bg-white overflow-y-auto h-full absolute md:relative w-full z-10 md:z-0 top-0 block`}
          >
            <div className="max-w-3xl mx-auto p-6 md:p-10">
              <button
                onClick={() => setSelectedFeedId(null)}
                className="mb-8 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 w-fit"
              >
                <span className="text-lg leading-none">←</span> Close details
              </button>

              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 flex-shrink-0 bg-white rounded-full overflow-hidden border border-zinc-200 shadow-sm">
                  <img
                    src="/brand-icons/reddit/icon-primary.jpeg"
                    alt="Source Icon"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-lg text-zinc-800 leading-relaxed whitespace-pre-wrap">
                {selectedFeed.content}
              </div>

              {selectedFeed.tags && (
                <div className="mt-6 text-blue-600 text-[16px]">
                  {selectedFeed.tags.join(" ")}
                </div>
              )}

              {selectedFeed.link && (
                <div className="mt-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50 truncate">
                  <a
                    href={selectedFeed.link.url}
                    className="text-blue-600 hover:underline text-[15px] font-medium block truncate"
                  >
                    {selectedFeed.link.text}
                  </a>
                </div>
              )}

              <div className="mt-12 p-6 bg-gradient-to-br from-zinc-50 to-blue-50/20 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                <h3 className="font-bold text-zinc-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">🤖</span> AI Insight Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-zinc-100 pb-3">
                    <span className="text-zinc-600 font-medium">
                      Sentiment Score
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-xs border border-emerald-100">
                      +0.85 (Positive)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-zinc-100 pb-3">
                    <span className="text-zinc-600 font-medium">
                      Clustered Topic
                    </span>
                    <span className="text-blue-700 font-medium bg-white px-2.5 py-1 border border-blue-100 rounded-full text-xs">
                      Productivity & Tools
                    </span>
                  </div>
                  <p className="text-zinc-600 text-sm leading-relaxed mt-4 relative z-10">
                    This signal indicates strong engagement around solving
                    bootstrapping challenges with community tools. The user is
                    actively seeking feature requests which aligns closely with
                    targeted SaaS validating.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
