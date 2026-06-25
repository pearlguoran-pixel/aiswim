import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import RosterGrid from "@/components/RosterGrid";
import { mockRoster } from "@/lib/mockRoster";

export default function RosterPage() {
  return (
    <>
      <Navbar activePath="/roster" />
      <PageHeader
        eyebrow="Smart Roster"
        title="Meet the Team"
        subtitle="Search by name or filter by section and specialty stroke."
      />
      <RosterGrid swimmers={mockRoster} />
    </>
  );
}
