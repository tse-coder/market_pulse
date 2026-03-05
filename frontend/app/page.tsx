import Link from "next/link";
import BrandAlignmentBar from "./components/BrandAlignmentBar";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
      {/* Subtle top border decorative element */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-zinc-900" />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Icons */}
      <div className="absolute top-[15%] left-[10%] w-20 h-20 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-3xl border border-zinc-100 flex items-center justify-center animate-float pointer-events-none md:flex hidden">
        <img
          src="/brand-icons/reddit/icon-primary.jpeg"
          alt="Reddit"
          className="w-12 h-12 rounded-xl"
        />
      </div>

      <div className="absolute top-[20%] right-[15%] w-24 h-24 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[2rem] border border-zinc-100 flex items-center justify-center animate-float-delayed pointer-events-none md:flex hidden">
        <img
          src="/brand-icons/product-hunt/icon-primary.png"
          alt="Product Hunt"
          className="w-14 h-14 rounded-2xl"
        />
      </div>

      <div className="absolute bottom-[25%] left-[18%] w-16 h-16 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl border border-zinc-100 flex items-center justify-center animate-float-reverse pointer-events-none md:flex hidden">
        <img
          src="/brand-icons/hacker-news/icon-primary.jpeg"
          alt="Hacker News"
          className="w-10 h-10 rounded-lg"
        />
      </div>

      {/* New Floating Icons */}
      <div className="absolute bottom-[35%] right-[8%] w-20 h-20 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-3xl border border-zinc-100 flex items-center justify-center animate-float-delayed pointer-events-none md:flex hidden">
        <img
          src="/brand-icons/discord/icon.png"
          alt="Discord"
          className="w-12 h-12 rounded-xl"
        />
      </div>

      <div className="absolute top-[55%] left-[5%] w-20 h-20 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-3xl border border-zinc-100 flex items-center justify-center animate-float pointer-events-none md:flex hidden">
        <img
          src="/brand-icons/github/icon.png"
          alt="GitHub"
          className="w-12 h-12"
        />
      </div>

      <div className="absolute bottom-[18%] right-[22%] w-16 h-16 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-2xl border border-zinc-100 flex items-center justify-center animate-float-reverse pointer-events-none md:flex hidden">
        <img
          src="/brand-icons/LinkedIn/icon.png"
          alt="LinkedIn"
          className="w-10 h-10 rounded-lg"
        />
      </div>

      <div className="absolute top-[40%] right-[5%] w-16 h-16 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-2xl border border-zinc-100 flex items-center justify-center animate-float pointer-events-none md:flex hidden">
        <img
          src="/brand-icons/x/icon-no-bg.png"
          alt="X"
          className="w-10 h-10"
        />
      </div>

      <div className="absolute bottom-[45%] left-[12%] w-14 h-14 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl border border-zinc-100 flex items-center justify-center animate-float-delayed pointer-events-none md:flex hidden">
        <img
          src="/brand-icons/telegram/Telegram_Symbol_4.png"
          alt="Telegram"
          className="w-8 h-8"
        />
      </div>

      <div className="absolute top-[65%] right-[10%] w-14 h-14 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl border border-zinc-100 flex items-center justify-center animate-float-reverse pointer-events-none md:flex hidden">
        <img
          src="/brand-icons/youtube/icon.png"
          alt="YouTube"
          className="w-8 h-8 rounded-md"
        />
      </div>

      <main className="relative z-10 flex flex-col items-center max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-100 bg-white shadow-sm text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-12">
          <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Intelligence Engine 2.0
        </div>

        <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter leading-[0.85] mb-12 text-zinc-900 uppercase italic">
          Market <br />
          <span className="text-zinc-200 non-italic">Pulse.</span>
        </h1>

        <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mb-16 leading-relaxed font-bold tracking-tight">
          AI-driven opportunity scanning. We capture signals across the software
          landscape so you can build what people actually want.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 items-center">
          <Link
            href="/feed"
            className="group px-14 py-6 bg-zinc-900 text-white font-black rounded-2xl transition-all hover:bg-zinc-800 hover:scale-[1.05] active:scale-[0.95] uppercase text-[12px] tracking-[0.2em] flex items-center gap-4 shadow-2xl shadow-zinc-900/20"
          >
            Start Scanning
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <button className="px-10 py-6 text-zinc-400 font-bold hover:text-zinc-900 transition-colors uppercase text-[11px] tracking-[0.3em]">
            Methodology
          </button>
        </div>
      </main>

      {/* Brand alignment bar */}
      {/* <BrandAlignmentBar /> */}
    </div>
  );
}
