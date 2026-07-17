import type { Metadata } from "next";
import { NotesSection } from "@/components/profile/notes-section";

export const metadata: Metadata = { title: "Notes" };

export default function NotesPage() {
  return <NotesSection />;
}
