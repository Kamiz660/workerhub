import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
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
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1382744028249618";

  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <head>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#fcfdfd] text-slate-900">
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${pixelId}');fbq('track', 'PageView');`,
          }}
        />
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
