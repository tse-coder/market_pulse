import { NextResponse } from "next/server";
import { getDatabase, dateToIsoString } from "@/lib/server/mongodb";

export const runtime = "nodejs";

type ClusterSignalsParams = {
  params: Promise<{ clusterId: string }>;
};

export async function GET(
  _request: Request,
  context: ClusterSignalsParams,
) {
  const { clusterId } = await context.params;

  try {
    const db = await getDatabase();

    const docs = await db
      .collection("signal")
      .find({ cluster_id: clusterId })
      .sort({ total_score: -1 })
      .toArray();

    const results = docs.map((doc) => ({
      id: String(doc._id),
      platform: doc.platform,
      title: doc.title,
      content: doc.content,
      type: doc.type ?? "discussion",
      score: doc.score,
      total_score: doc.total_score,
      sentiment_score: doc.sentiment_score,
      ai_summary: doc.ai_summary,
      ai_sentiment: doc.ai_sentiment,
      ai_topics: doc.ai_topics,
      url: doc.url,
      time: dateToIsoString(doc.time),
    }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { detail: "Database client not initialized" },
      { status: 503 },
    );
  }
}
