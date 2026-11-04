import { redirect } from "next/navigation";
export const metadata = { robots: { index: false, follow: false } };
// Retired preview bookmarks enter the real, authenticated portal.
export default function RetiredPreviewPage() { redirect("/admin"); }
