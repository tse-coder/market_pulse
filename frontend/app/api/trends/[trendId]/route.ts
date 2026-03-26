import { NextResponse } from "next/server";

export const runtime = "nodejs";

type TrendDetailsParams = {
  params: Promise<{ trendId: string }>;
};

export async function GET(_request: Request, context: TrendDetailsParams) {
  const { trendId } = await context.params;

  return NextResponse.json({ message: `Trend ${trendId} endpoint placeholder` });
}
