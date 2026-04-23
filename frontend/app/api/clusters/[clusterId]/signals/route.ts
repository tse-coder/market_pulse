import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  dateToIsoString,
} from "@/lib/server/supabase";

export const runtime = "nodejs";

type ClusterSignalsParams = {
  params: Promise<{ clusterId: string }>;
};

export async function GET(_request: Request, context: ClusterSignalsParams) {
  const { clusterId } = await context.params;

  try {
    const supabase = getSupabaseServerClient();
    const { data: docs, error } = await supabase
      .from("signals")
      .select("*")
      .eq("cluster_id", clusterId)
      .order("total_score", { ascending: false });

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
      { detail: "Supabase client not initialized" },
      { status: 503 },
    );
  }
}
