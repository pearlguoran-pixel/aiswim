import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

// Superseded by the unified login page at "/", which now handles both
// parent and admin sign-in with a role-based session (see src/lib/session.ts
// and src/components/LoginBox.tsx). Kept as a redirect rather than deleted
// so any existing links to /admin/login (e.g. from Navbar in older builds,
// bookmarks) still land somewhere correct instead of 404ing.
export default async function AdminLoginRedirectPage() {
  const session = await getServerSession();
  redirect(session === "admin" ? "/admin/import" : "/");
}
