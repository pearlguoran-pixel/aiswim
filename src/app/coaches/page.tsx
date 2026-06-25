import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import CoachesGrid from "@/components/CoachesGrid";
import { mockCoaches } from "@/lib/mockCoaches";

export default function CoachesPage() {
  return (
    <>
      <Navbar activePath="/coaches" />
      <PageHeader
        eyebrow="Coaching Staff"
        title="Meet the Coaches"
        subtitle="The team behind the team."
      />
      <CoachesGrid coaches={mockCoaches} />
    </>
  );
}
