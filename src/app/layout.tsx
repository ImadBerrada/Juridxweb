import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

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

export const metadata: Metadata = {
  title: {
    default: "JuridX | Cabinet de Conseil Juridique International",
    template: "%s | JuridX"
  },
  description: "Cabinet de conseil haut de gamme spécialisé en droit des affaires internationales, structuration juridique multi-juridictionnelle, et accompagnement stratégique des entreprises et investisseurs. Fondé par Abderrahman Adel, juriste international diplômé de l'Université de Londres.",
  keywords: ["droit des affaires", "conseil juridique international", "structuration juridique", "multi-juridictionnel", "stratégie d'entreprise", "investisseurs", "Londres", "Abderrahman Adel", "JuridX"],
  authors: [{ name: "Abderrahman Adel" }],
  creator: "JuridX - Abderrahman Adel",
  publisher: "JuridX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://juridx.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/jk.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
    shortcut: "/jk.jpg",
    apple: "/jk.jpg",
  },
  openGraph: {
    title: "JuridX | Cabinet de Conseil Juridique International",
    description: "Cabinet de conseil haut de gamme spécialisé en droit des affaires internationales. Fondé par Abderrahman Adel, juriste international diplômé de l'Université de Londres.",
    url: "https://juridx.com",
    siteName: "JuridX",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/jk.jpg",
        width: 1200,
        height: 630,
        alt: "JuridX - Cabinet de Conseil Juridique International",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JuridX | Cabinet de Conseil Juridique International",
    description: "Cabinet de conseil haut de gamme spécialisé en droit des affaires internationales. Fondé par Abderrahman Adel.",
    creator: "@juridx",
    images: ["/jk.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/jk.jpg" />
        <link rel="apple-touch-icon" href="/jk.jpg" />
        <meta property="og:image" content="/jk.jpg" />
        <meta name="twitter:image" content="/jk.jpg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
                window.location.replace('https://juridx.com' + window.location.pathname + window.location.search);
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
