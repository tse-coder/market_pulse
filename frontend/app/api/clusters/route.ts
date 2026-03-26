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
      .collection("cluster")
      .find({})
      .sort({ momentum_score: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const results = docs.map((doc) => ({
      id: String(doc._id),
      name: doc.name,
      description: doc.description,
      total_signals: doc.total_signals ?? 0,
      total_startups: doc.total_startups ?? 0,
      total_discussions: doc.total_discussions ?? 0,
      avg_sentiment: doc.avg_sentiment ?? 0,
      momentum_score: doc.momentum_score ?? 0,
      pain_score: doc.pain_score ?? 0,
      opportunity_score: doc.opportunity_score ?? 0,
      primary_tags: doc.primary_tags ?? [],
      created_at: dateToIsoString(doc.created_at),
    }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { detail: "Database client not initialized" },
      { status: 503 },
    );
  }
}
