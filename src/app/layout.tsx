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
    default: "JuridX | Cabinet de Conseil Juridique International - Abderrahman Adel",
    template: "%s | JuridX"
  },
  description: "JuridX - Cabinet de conseil haut de gamme spécialisé en droit des affaires internationales, structuration juridique multi-juridictionnelle, et accompagnement stratégique des entreprises et investisseurs. Fondé par Abderrahman Adel, juriste international diplômé de l'Université de Londres.",
  keywords: [
    "JuridX", "Juridx", "juridx", "JURIDX",
    "Abderrahman Adel", "cabinet juridique", "conseil juridique international", 
    "droit des affaires", "structuration juridique", "multi-juridictionnel", 
    "stratégie d'entreprise", "investisseurs", "Londres", "Université de Londres",
    "cabinet conseil juridique", "avocat international", "juriste international",
    "droit international des affaires", "conseil stratégique", "accompagnement juridique"
  ],
  authors: [{ name: "Abderrahman Adel", url: "https://juridx.com" }],
  creator: "JuridX - Abderrahman Adel",
  publisher: "JuridX",
  applicationName: "JuridX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://juridx.com"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "your-google-verification-code",
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
    title: "JuridX | Cabinet de Conseil Juridique International - Abderrahman Adel",
    description: "JuridX - Cabinet de conseil haut de gamme spécialisé en droit des affaires internationales. Fondé par Abderrahman Adel, juriste international diplômé de l'Université de Londres.",
    url: "https://juridx.com",
    siteName: "JuridX",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/jk.jpg",
        width: 1200,
        height: 630,
        alt: "JuridX - Cabinet de Conseil Juridique International - Abderrahman Adel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JuridX | Cabinet de Conseil Juridique International - Abderrahman Adel",
    description: "JuridX - Cabinet de conseil haut de gamme spécialisé en droit des affaires internationales. Fondé par Abderrahman Adel.",
    creator: "@juridx",
    site: "@juridx",
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
  other: {
    "google-site-verification": "your-google-verification-code",
    "msvalidate.01": "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="icon" href="/jk.jpg" />
        <link rel="apple-touch-icon" href="/jk.jpg" />
        <meta property="og:image" content="/jk.jpg" />
        <meta name="twitter:image" content="/jk.jpg" />
        <meta name="theme-color" content="#D4AF37" />
        <link rel="canonical" href="https://juridx.com/" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              "name": "JuridX",
              "alternateName": ["Juridx", "JURIDX"],
              "description": "Cabinet de conseil haut de gamme spécialisé en droit des affaires internationales",
              "url": "https://juridx.com",
              "logo": "https://juridx.com/jk.jpg",
              "founder": {
                "@type": "Person",
                "name": "Abderrahman Adel",
                "jobTitle": "Juriste International",
                "alumniOf": "Université de Londres"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Londres",
                "addressCountry": "GB"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+44 (0) 20 7123 4567",
                "email": "contact@juridx.com",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://juridx.com"
              ]
            })
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
