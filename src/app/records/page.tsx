import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import RecordsTable from "@/components/RecordsTable";
import { mockRecords } from "@/lib/mockRecords";

export default function RecordsPage() {
  return (
    <>
      <Navbar activePath="/records" />
      <PageHeader
        eyebrow="School Records"
        title="All-Time Top Times"
        subtitle="Filter by gender, event, or age group to see where the bar is set."
      />
      <RecordsTable records={mockRecords} />
    </>
  );
}
