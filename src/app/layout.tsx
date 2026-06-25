import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AddWorkerModal } from "@/components/shared/add-worker-modal";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkerHub — Find Local Workers",
  description:
    "Connect with verified electricians, plumbers, carpenters, and skilled tradespeople in Koothattukulam and nearby areas. Quality work, fair prices, trusted professionals.",
  keywords: [
    "workers",
    "electrician",
    "plumber",
    "carpenter",
    "Koothattukulam",
    "local services",
    "home repair",
    "contractor",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#f5f8fc] text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AddWorkerModal />
      </body>
    </html>
  );
}
