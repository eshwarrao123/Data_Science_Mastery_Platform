import type { ModuleMeta } from "@/lib/curriculum/types";

export const errorHandlingModule: ModuleMeta = {
  id: "python.error-handling",
  slug: "error-handling",
  title: "Errors & File I/O",
  description:
    "Handle failure gracefully and move data in and out of files — the resilience and reading skills every real dataset demands before analysis.",
  lessonOrder: [
    "exceptions-and-try-except",
    "raising-exceptions",
    "reading-and-writing-files",
    "working-with-paths",
  ],
};
