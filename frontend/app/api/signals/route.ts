import { NextResponse } from "next/server";
import { getDatabase, dateToIsoString } from "@/lib/server/mongodb";

export const runtime = "nodejs";

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const limit = parsePositiveInt(searchParams.get("limit"), 25);

  if (page === null || limit === null || limit > 100) {
    return NextResponse.json(
      { detail: "Invalid query params. page >= 1 and 1 <= limit <= 100." },
      { status: 400 },
    );
  }

  try {
    const db = await getDatabase();
    const skip = (page - 1) * limit;

    const docs = await db
      .collection("signal")
      .find({})
      .sort({ total_score: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const results = docs.map((doc) => ({
      id: String(doc._id),
      platform: doc.platform,
      title: doc.title,
      content: doc.content,
      type: doc.type ?? "discussion",
      score: doc.score,
      total_score: doc.total_score,
      trend_score: doc.trend_score,
      sentiment_score: doc.sentiment_score,
      ai_summary: doc.ai_summary,
      ai_sentiment: doc.ai_sentiment,
      ai_topics: doc.ai_topics,
      cluster_id: doc.cluster_id,
      tags: doc.tags ?? [],
      metadata: doc.metadata,
      time: dateToIsoString(doc.time),
      updated_at: dateToIsoString(doc.updated_at),
      url: doc.url,
    }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { detail: "Database client not initialized" },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const db = await getDatabase();

    const result = await db.collection("signal").insertOne(payload);
    return NextResponse.json({
      message: "Signal created successfully",
      id: String(result.insertedId),
    });
  } catch {
    return NextResponse.json(
      { detail: "Database client not initialized" },
      { status: 503 },
    );
  }
}
