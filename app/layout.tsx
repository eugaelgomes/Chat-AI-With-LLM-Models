import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AppContext } from "./context/app-context";
import Header from "./components/header";
import Footer from "./components/footer";

// Font definitions
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Enhanced SEO metadata
export const metadata: Metadata = {
  title: {
    default: "CodaWeb AI",
    template: "%s | CodaWeb AI"
  },
  description: "Converse com nossa IA avançada baseada em Perplexity AI para obter respostas precisas e em tempo real para suas dúvidas.",
  applicationName: "CodaWeb AI",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Chat IA",
    "Perplexity AI API",
    "Virtual Assistant",
    "Artificial Intelligence",
    "Chatbot Brazil",
    "Responses by IA",
    "CodaWeb"
  ],
  authors: [{ name: "Gael Gomes", url: "https://gael.codaweb.com.br" }],
  creator: "Gael Gomes",
  publisher: "CodaWeb",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ai.codaweb.com.br"),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/pt-BR",
    },
  },
  openGraph: {
    title: "CodaWeb AI",
    description: "Talk with advanced IA models",
    url: "https://ai.codaweb.com.br",
    siteName: "CodaWeb AI",
    images: [
      {
        url: "https://ai.codaweb.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CodaWeb AI",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodaWeb AI",
    description: "Talk with advanced IA models",
    creator: "@codaweb",
    images: ["https://ai.codaweb.com.br/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        {/* Preconnect to important third-party origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KQ0YGKW0YY"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KQ0YGKW0YY', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Structured Data (JSON-LD) */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "CodaWeb AI",
              "url": "https://ai.codaweb.com.br",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ai.codaweb.com.br/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppContext>
          <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <Header />

            <main className="flex-1 overflow-y-auto">
              {children}
            </main>

            <Footer />
          </div>

        </AppContext>
      </body>
    </html>
  );
}