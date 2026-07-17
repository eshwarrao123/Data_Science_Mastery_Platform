import { redirect } from "next/navigation";

const SECTIONS = ["bookmarks", "notes", "settings"] as const;

/**
 * /profile has no content of its own — the sections live at
 * /profile/{bookmarks,notes,settings}. Redirect to the default section,
 * honoring legacy `?tab=` deep links from before the route split.
 */
export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { tab } = await searchParams;
  const section = SECTIONS.find((s) => s === tab) ?? "bookmarks";
  redirect(`/profile/${section}`);
}
