import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-400 mb-8 animate-fade-in">
          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Intelligence Engine 2.0
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
          Listen to the <br />
          <span className="text-white">Market Pulse.</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 font-light max-w-xl mb-12 leading-relaxed">
          AI-driven opportunity scanning. We capture signals across the software
          landscape so you can build what people actually want.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center animate-fade-in-up">
          <Link
            href="/feed"
            className="group relative px-10 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative z-10 flex items-center gap-2">
              Start Scanning
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </Link>

          <button className="px-10 py-4 text-zinc-400 font-medium hover:text-white transition-colors">
            Our Methodology
          </button>
        </div>
      </main>

      {/* Footer minimal info */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center text-[10px] text-zinc-600 uppercase tracking-widest gap-8 z-10">
        <span>Reddit Ingestion</span>
        <span>Hacker News Analysis</span>
        <span>Product Hunt Insights</span>
      </div>
    </div>
  );
}
