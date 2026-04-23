import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  dateToIsoString,
} from "@/lib/server/supabase";

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
    const supabase = getSupabaseServerClient();
    const skip = (page - 1) * limit;

    const { data: docs, error } = await supabase
      .from("signals")
      .select("*")
      .order("total_score", { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) {
      throw error;
    }

    const results = (docs ?? []).map((doc) => ({
      id: String(doc.id),
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
      { detail: "Supabase client not initialized" },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("signals")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Signal created successfully",
      id: String(data.id),
    });
  } catch {
    return NextResponse.json(
      { detail: "Supabase client not initialized" },
      { status: 503 },
    );
  }
}
