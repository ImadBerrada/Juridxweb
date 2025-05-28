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
    default: "JuridX | Votre Partenaire Juridique de Confiance - Abderrahman Adel",
    template: "%s | JuridX"
  },
  description: "🏆 Cabinet juridique d'excellence internationale dirigé par Abderrahman Adel (diplômé Université de Londres). Solutions juridiques expertes, conseil stratégique personnalisé et accompagnement multi-juridictionnel pour entreprises et investisseurs. Votre succès, notre expertise.",
  keywords: [
    "JuridX", "Juridx", "juridx", "JURIDX",
    "Abderrahman Adel", "cabinet juridique", "conseil juridique international", 
    "droit des affaires", "structuration juridique", "multi-juridictionnel", 
    "stratégie d'entreprise", "investisseurs", "Londres", "Université de Londres",
    "cabinet conseil juridique", "avocat international", "juriste international",
    "droit international des affaires", "conseil stratégique", "accompagnement juridique",
    "partenaire juridique de confiance", "excellence juridique"
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
      },
      {
        url: "/jk.jpg",
        sizes: "32x32",
        type: "image/jpeg",
      },
      {
        url: "/jk.jpg",
        sizes: "16x16",
        type: "image/jpeg",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/jk.jpg",
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
  },
  openGraph: {
    title: "JuridX | Votre Partenaire Juridique de Confiance - Abderrahman Adel",
    description: "🏆 Cabinet juridique d'excellence internationale dirigé par Abderrahman Adel (diplômé Université de Londres). Solutions juridiques expertes, conseil stratégique personnalisé et accompagnement multi-juridictionnel pour entreprises et investisseurs. Votre succès, notre expertise.",
    url: "https://juridx.com",
    siteName: "JuridX",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/jk.jpg",
        width: 1200,
        height: 630,
        alt: "JuridX - Votre Partenaire Juridique de Confiance - Abderrahman Adel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JuridX | Votre Partenaire Juridique de Confiance - Abderrahman Adel",
    description: "🏆 Cabinet juridique d'excellence internationale dirigé par Abderrahman Adel (diplômé Université de Londres). Solutions juridiques expertes, conseil stratégique personnalisé et accompagnement multi-juridictionnel pour entreprises et investisseurs. Votre succès, notre expertise.",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/jk.jpg" type="image/jpeg" />
        <link rel="icon" type="image/png" href="/jk.jpg" sizes="32x32" />
        <link rel="apple-touch-icon" href="/jk.jpg" />
        <meta name="msapplication-TileImage" content="/jk.jpg" />
        <meta property="og:image" content="https://juridx.com/jk.jpg" />
        <meta name="twitter:image" content="https://juridx.com/jk.jpg" />
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
              "description": "Votre partenaire juridique de confiance. Cabinet d'excellence spécialisé en droit des affaires internationales",
              "url": "https://juridx.com",
              "logo": "https://juridx.com/jk.jpg",
              "slogan": "Votre partenaire juridique de confiance",
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
