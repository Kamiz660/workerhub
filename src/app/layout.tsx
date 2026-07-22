import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AddWorkerModal } from "@/components/shared/add-worker-modal";
import { LanguageProvider } from "@/context/language-context";
import { AuthProvider } from "@/context/auth-context";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkerHub - Find Local Workers",
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
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#fcfdfd] text-slate-900">
        <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <AddWorkerModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
