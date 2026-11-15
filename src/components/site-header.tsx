import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AuthMenu } from "./auth-menu";
import { ExamMenu } from "./exam-menu";

function Logo({ light }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
      <span className="grid place-items-center size-9 rounded-xl bg-gradient-to-br from-brand-2 to-brand text-white text-base font-display shadow-[0_6px_16px_#034e3a38]">
        জ
      </span>
      <span className={`font-display text-xl ${light ? "text-white" : "text-heading"}`}>জব গুরু</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-bg/85 backdrop-blur-md backdrop-saturate-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo />
        <nav className="flex items-center gap-1 text-[0.95rem]">
          <ExamMenu />
          <AuthMenu />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="panel-deep border-t border-white/10">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 sm:grid-cols-[1.4fr_1fr] items-center">
        <div>
          <Logo light />
          <p className="mt-3 max-w-md text-[#d6e6df]">
            বিসিএস, ব্যাংক, গ্যাস ফিল্ডসহ চাকরির পরীক্ষার সিলেবাস, বিষয়ভিত্তিক নোট আর MCQ অনুশীলন—এক জায়গায়, নিজের গতিতে।
          </p>
        </div>
        <div className="sm:justify-self-end">
          <Link
            href="/#exams"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#034e3a] transition-colors hover:bg-gold hover:text-white"
          >
            পড়া শুরু করুন
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>
      <p className="relative border-t border-white/10 py-4 text-center text-sm text-[#d6e6df]/80">
        জব গুরু · প্রস্তুতি চলুক নিয়মিত
      </p>
    </footer>
  );
}
