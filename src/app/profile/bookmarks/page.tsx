import type { Metadata } from "next";
import { BookmarksSection } from "@/components/profile/bookmarks-section";

export const metadata: Metadata = { title: "Bookmarks" };

export default function BookmarksPage() {
  return <BookmarksSection />;
}
