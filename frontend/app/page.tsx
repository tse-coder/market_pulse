import Link from "next/link";

export default function Home() {
  const floatingPlatforms = [
    {
      name: "Reddit",
      icon: "/brand-icons/reddit/icon-primary.jpeg",
      className: "-left-1 top-[9%] animate-float",
      sizeClass: "h-10 w-10",
      rotateClass: "-rotate-6",
    },
    {
      name: "Product Hunt",
      icon: "/brand-icons/product-hunt/icon-primary.png",
      className: "-right-1 top-[17%] animate-float-delayed",
      sizeClass: "h-12 w-12",
      rotateClass: "rotate-3",
    },
    {
      name: "Hacker News",
      icon: "/brand-icons/hacker-news/icon-primary.jpeg",
      className: "left-[4%] bottom-[10%] animate-float-reverse",
      sizeClass: "h-9 w-9",
      rotateClass: "-rotate-12",
    },
    {
      name: "GitHub",
      icon: "/brand-icons/github/icon.png",
      className: "right-[3%] bottom-[13%] animate-float",
      sizeClass: "h-11 w-11",
      rotateClass: "rotate-6",
    },
    {
      name: "LinkedIn",
      icon: "/brand-icons/LinkedIn/icon.png",
      className: "left-[6%] top-[30%] hidden md:flex animate-float-delayed",
      sizeClass: "h-10 w-10",
      rotateClass: "rotate-12",
    },
    {
      name: "Instagram",
      icon: "/brand-icons/Instagram/Instagram_Icon_18.jpeg",
      className: "right-[11%] top-0 hidden md:flex animate-float-reverse",
      sizeClass: "h-14 w-14",
      rotateClass: "-rotate-3",
    },
    {
      name: "Discord",
      icon: "/brand-icons/discord/icon.png",
      className: "left-[10%] bottom-[34%] hidden md:flex animate-float-delayed",
      sizeClass: "h-10 w-10",
      rotateClass: "-rotate-6",
    },
    {
      name: "Telegram",
      icon: "/brand-icons/telegram/Telegram_Icon_6.jpeg",
      className: "right-[10%] bottom-[35%] hidden md:flex animate-float",
      sizeClass: "h-11 w-11",
      rotateClass: "rotate-9",
    },
    {
      name: "X",
      icon: "/brand-icons/x/icon.jpeg",
      className: "left-[19%] top-0 hidden 2xl:flex animate-float-reverse",
      sizeClass: "h-9 w-9",
      rotateClass: "-rotate-12",
    },
    {
      name: "YouTube",
      icon: "/brand-icons/youtube/icon.png",
      className:
        "right-[18%] bottom-[6%] hidden 2xl:flex animate-float-delayed",
      sizeClass: "h-12 w-12",
      rotateClass: "rotate-12",
    },
  ];

  return (
    <div className="relative flex h-[100svh] flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6">
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-35" />
      <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute -left-20 bottom-16 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl animate-drift" />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center py-2 sm:py-3 lg:py-4">
        <section className="relative w-full overflow-visible rounded-[2rem] p-5 text-center sm:p-7 lg:p-9 animate-fade-up">
          {floatingPlatforms.map((platform) => (
            <div
              key={platform.name}
              className={`pointer-events-none absolute z-0 hidden opacity-30 sm:flex ${platform.className}`}
            >
              <div
                className={`rounded-2xl border border-zinc-200/80 bg-white/65 p-2 shadow-[0_12px_30px_rgba(24,24,27,0.12)] backdrop-blur ${platform.rotateClass}`}
              >
                <img
                  src={platform.icon}
                  alt={platform.name}
                  className={`${platform.sizeClass} rounded-xl object-cover`}
                />
              </div>
            </div>
          ))}

          <div className="relative z-10 mx-auto max-w-4xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-transparent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-800">
              Market Pulse
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-600" />
              Daily opportunity radar
            </p>

            <h1 className="mx-auto max-w-4xl font-display text-[2rem] font-bold leading-[0.92] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Build what the market is quietly asking for.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base lg:text-lg">
              Market Pulse scans startup launches, community threads, and
              product conversations to surface momentum, pain, and whitespace
              before the crowd sees it.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/feed"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-50 transition hover:-translate-y-0.5 hover:bg-zinc-800 sm:text-sm"
              >
                Explore Clusters
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
              </Link>
            </div>

            <div className="mx-auto mt-6 grid max-w-3xl gap-2.5 sm:grid-cols-3">
              {[
                ["45+", "signal sources"],
                ["24h", "trend refresh"],
                ["AI", "topic clustering"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-zinc-200/80 bg-transparent px-4 py-3"
                >
                  <p className="font-display text-2xl font-semibold tracking-tight text-zinc-900">
                    {value}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:hidden">
            {floatingPlatforms.map((platform) => (
              <span
                key={`${platform.name}-mobile`}
                className="rounded-full border border-zinc-200/80 bg-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600"
              >
                {platform.name}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
