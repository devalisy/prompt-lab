import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/Toast";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "مختصر البرومت | توليد برومتات احترافية",
    template: "%s | مختصر البرومت",
  },
  description: "أداة ذكية لتوليد برومتات مخصصة للتسويق، البرمجة، التعليم، التصميم، وأكثر",
  keywords: ["برومت", "AI", "تسويق", "برمجة", "تعليم", "تصميم", "كتابة", "prompt engineering"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "مختصر البرومت | توليد برومتات احترافية",
    description: "أداة ذكية لتوليد برومتات مخصصة للتسويق، البرمجة، التعليم، التصميم، وأكثر",
    locale: "ar_SA",
    type: "website",
    siteName: "مختصر البرومت",
  },
  twitter: {
    card: "summary_large_image",
    title: "مختصر البرومت | توليد برومتات احترافية",
    description: "أداة ذكية لتوليد برومتات مخصصة للتسويق، البرمجة، التعليم، التصميم، وأكثر",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('prompt-lab-theme');
                if (theme === 'light' || theme === 'dark') {
                  document.documentElement.setAttribute('data-theme', theme);
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <Header />
          <main className="flex-1"><AuthGuard>{children}</AuthGuard></main>
          <Footer />
          <ToastContainer />
        </SessionProvider>
      </body>
    </html>
  );
}
