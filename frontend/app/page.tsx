import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-zinc-50 text-zinc-900 border-t-4 border-blue-600">
      <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
        Market Pulse
      </h1>
      <p className="text-xl text-zinc-600 max-w-2xl mb-8">
        AI-powered market demand scanner. We ingest social data, process it with
        AI, and serve actionable insights for your SaaS journey.
      </p>

      <Link
        href="/feed"
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all"
      >
        Go to Feed
      </Link>
    </div>
  );
}
