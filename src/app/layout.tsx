import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
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

export const metadata: Metadata = {
  title: {
    default: "জব গুরু — BCS প্রিলিমিনারি প্রস্তুতি",
    template: "%s · জব গুরু",
  },
  description:
    "বিসিএস প্রিলিমিনারি পরীক্ষার পূর্ণাঙ্গ সিলেবাস, বিষয়ভিত্তিক নোট ও MCQ অনুশীলন।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${inter.variable} ${bangla.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
        <footer className="border-t border-line py-6 text-center text-sm text-muted">
          জব গুরু · প্রস্তুতি চলুক নিয়মিত
        </footer>
      </body>
    </html>
  );
}
