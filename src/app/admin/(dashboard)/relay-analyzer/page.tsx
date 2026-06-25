import PageHeader from "@/components/PageHeader";
import RelayAnalyzer from "@/components/admin/RelayAnalyzer";
import type { RelayCandidate } from "@/lib/admin-types";

// TODO (finalize function): replace this placeholder pool with a real query
// against `swimmers` (names/strokes) joined with `race_results` (best
// times) once those tables are seeded — see Outstanding Steps #2 and #3 in
// the project spec. Keeping it local here (rather than importing
// lib/mockRoster.ts) avoids coupling this new page to that file's shape.
const PLACEHOLDER_CANDIDATES: RelayCandidate[] = [
  { id: "1", name: "Ariya T.", gender: "F", strokes: ["free", "fly"], bestTimesSeconds: { free: 28.4, fly: 31.2 } },
  { id: "2", name: "Pawat S.", gender: "M", strokes: ["back"], bestTimesSeconds: { back: 30.1 } },
  { id: "3", name: "Mali K.", gender: "F", strokes: ["breast"], bestTimesSeconds: { breast: 33.7 } },
  { id: "4", name: "Tan R.", gender: "M", strokes: ["free"], bestTimesSeconds: { free: 26.9 } },
  { id: "5", name: "Suda P.", gender: "F", strokes: ["back", "free"], bestTimesSeconds: { back: 31.5, free: 29.1 } },
  { id: "6", name: "Kit N.", gender: "M", strokes: ["fly"], bestTimesSeconds: { fly: 29.8 } },
];

export default function RelayAnalyzerPage() {
  return (
    <section>
      <PageHeader
        eyebrow="Lineups"
        title="AI relay & lineup analyzer"
        subtitle="Pick an event and a pool of swimmers to generate a suggested relay order with reasoning."
      />
      <RelayAnalyzer candidates={PLACEHOLDER_CANDIDATES} />
    </section>
  );
}
