import { NextRequest, NextResponse } from "next/server";
import type { RelayCandidate, RelayEventKey, RelayLineupResult, Stroke } from "@/lib/admin-types";

const MEDLEY_ORDER: Stroke[] = ["back", "breast", "fly", "free"];

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const event: RelayEventKey | undefined = body?.event;
  const candidates: RelayCandidate[] | undefined = body?.candidates;

  if (!event || !Array.isArray(candidates) || candidates.length < 4) {
    return NextResponse.json(
      { error: "Provide a relay event and at least 4 candidate swimmers." },
      { status: 400 }
    );
  }

  // ------------------------------------------------------------------
  // TODO (finalize function) — this currently assigns legs in roster order
  // and writes placeholder reasoning; it does NOT look at real best times
  // or call any AI model. The request/response shape is final; only the
  // body needs to change. Real version:
  //
  //   1. Pull verified best splits per stroke from `race_results` in Neon
  //      for each candidate (rather than trusting client-supplied times).
  //   2. Either (a) run a real optimization over valid leg assignments to
  //      minimize projected total time, or (b) call the Anthropic API
  //      server-side with the roster + times and ask it to propose AND
  //      justify a lineup, parsing a structured JSON response back into
  //      RelayLineupResult.
  //   3. Keep the reasoning text specific to the actual swimmers/times used
  //      so coaches can sanity-check the suggestion.
  // ------------------------------------------------------------------

  const strokeOrder: Stroke[] =
    event === "200_free_relay" || event === "400_free_relay"
      ? ["free", "free", "free", "free"]
      : MEDLEY_ORDER;

  const legs = strokeOrder.map((stroke, index) => {
    const swimmer = candidates[index % candidates.length];
    const split = swimmer.bestTimesSeconds[stroke] ?? 30 + index * 2;
    return {
      order: index + 1,
      stroke,
      swimmerId: swimmer.id,
      swimmerName: swimmer.name,
      splitSeconds: split,
    };
  });

  const result: RelayLineupResult = {
    event,
    legs,
    projectedTotalSeconds: legs.reduce((sum, leg) => sum + leg.splitSeconds, 0),
    reasoning:
      "Placeholder lineup — swimmers were assigned in roster order, not by actual best splits. Wire this up to real race_results data (and optionally the Anthropic API) for a genuinely optimized, explained lineup.",
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(result);
}
