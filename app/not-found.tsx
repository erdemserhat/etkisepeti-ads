import Link from "next/link";
import { PAGE_CONTENT_GUTTER } from "@/lib/pageLayout";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className={`flex flex-1 flex-col items-start gap-4 py-16 ${PAGE_CONTENT_GUTTER}`}
    >
      <h1 className="text-xl font-bold text-foreground">Sayfa bulunamadı</h1>
      <Link
        href="/"
        className="text-sm font-medium text-brand-primary hover:underline"
      >
        Platformlara dön
      </Link>
    </main>
  );
}
