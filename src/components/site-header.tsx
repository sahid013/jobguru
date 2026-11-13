import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="grid place-items-center size-8 rounded-lg bg-brand text-brand-ink text-sm">
            জ
          </span>
          <span>জব গুরু</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/#syllabus" className="px-3 py-2 rounded-md hover:bg-surface-2">
            সিলেবাস
          </Link>
          <Link href="/admin" className="px-3 py-2 rounded-md hover:bg-surface-2 text-muted">
            কন্টেন্ট যোগ
          </Link>
        </nav>
      </div>
    </header>
  );
}
