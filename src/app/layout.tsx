import type { Metadata } from "next";
import { Hind_Siliguri, Inter, Noto_Serif_Bengali } from "next/font/google";
import { MotionProvider } from "@/components/motion";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bangla = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

const serifBangla = Noto_Serif_Bengali({
  variable: "--font-serif-bn",
  subsets: ["bengali", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "জব গুরু — চাকরির পরীক্ষার প্রস্তুতি",
    template: "%s · জব গুরু",
  },
  description:
    "বিসিএস, ব্যাংক, গ্যাস ফিল্ডসহ চাকরির পরীক্ষার সিলেবাস, বিষয়ভিত্তিক নোট ও MCQ অনুশীলন।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${inter.variable} ${bangla.variable} ${serifBangla.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <MotionProvider>
          <SiteHeader />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16">{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
