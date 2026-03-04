import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed | Live Market Signals",
  description:
    "Browse live signals captured from across the web. AI-analyzed trends and opportunities at your fingertips.",
};

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
