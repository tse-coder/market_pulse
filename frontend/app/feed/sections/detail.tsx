import React from "react";
type DetailSectionProps = {
  selectedFeed: {
    content: string;
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
    <div
      className={`flex-1 bg-white overflow-y-scroll max-h-screen absolute md:relative w-full z-10 md:z-0 top-0 block`}
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
              <span className="text-zinc-600 font-medium">Sentiment Score</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-xs border border-emerald-100">
                +0.85 (Positive)
              </span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-zinc-100 pb-3">
              <span className="text-zinc-600 font-medium">Clustered Topic</span>
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
  );
}

export default DetailSection;
