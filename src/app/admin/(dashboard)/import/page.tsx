import PageHeader from "@/components/PageHeader";
import ImportDashboard from "@/components/admin/ImportDashboard";

export default function ImportPage() {
  return (
    <section>
      <PageHeader
        eyebrow="Data management"
        title="Import data"
        subtitle="Upload swimmer rosters, race results, school records, or coach bios from CSV, Excel, or PDF files."
      />
      <ImportDashboard />
    </section>
  );
}
