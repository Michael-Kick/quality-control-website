import { notFound } from "next/navigation";

// Unknown paths below a locale (e.g. /de/foo) render the localized not-found page.
export default function CatchAllPage() {
  notFound();
}
