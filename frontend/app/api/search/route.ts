import { NextResponse } from "next/server";
import { getSupabaseServerClient, dateToIsoString } from "@/lib/server/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ detail: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ detail: "GOOGLE_API_KEY is not configured on the server" }, { status: 500 });
    }

    // Generate embedding for the query
    const embedRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: {
            parts: [{ text: query }]
          }
        })
      }
    );

    if (!embedRes.ok) {
      throw new Error(`Failed to generate embedding: ${await embedRes.text()}`);
    }

    const embedData = await embedRes.json();
    const vector = embedData.embedding?.values;

    if (!vector || !Array.isArray(vector)) {
      throw new Error("Invalid embedding response");
    }

    // Call Supabase RPC to search
    const vectorStr = `[${vector.join(",")}]`;
    const supabase = getSupabaseServerClient();
    
    // We already have a match_cluster function in schema.sql that returns ONE cluster! 
    // Let's create a new one search_clusters for multiple or just use query builder.
    // Wait, match_cluster returns (id, similarity) limit 1.
    // Let's create search_clusters in schema.sql that returns top N clusters.

    const { data: rpcData, error: rpcError } = await supabase.rpc("search_clusters", {
      query_embedding: vectorStr,
      match_threshold: 0.1,
      match_count: 10
    });

    if (rpcError) {
      throw rpcError;
    }

    // We got cluster IDs. Now fetch the full cluster objects.
    const clusterIds = (rpcData ?? []).map((row: any) => row.id);
    
    if (clusterIds.length === 0) {
      return NextResponse.json([]);
    }

    const { data: docs, error } = await supabase
      .from("clusters")
      .select("*")
      .in("id", clusterIds);

    if (error) {
      throw error;
    }

    // Sort docs in the order of clusterIds returned by RPC
    const sortedDocs = docs.sort((a, b) => clusterIds.indexOf(a.id) - clusterIds.indexOf(b.id));

    const results = (sortedDocs ?? []).map((doc: any) => ({
      id: String(doc.id),
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
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
