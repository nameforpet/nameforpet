import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF6F0",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nameforpet.com"),
  title: {
    default: "nameforpet.com - AI Pet Name Generator from Photo",
    template: "%s | nameforpet.com"
  },
  description: "Find the most meaningful pet name for your dog, cat, kitten, rabbit, or bird across 22+ languages. Upload a photo and let our Vision AI analyze coat colors and personality.",
  keywords: [
    "pet names",
    "ai pet name generator",
    "dog name finder from photo",
    "cat name generator",
    "kitten names",
    "puppy names",
    "multilingual pet names",
    "japanese pet names",
    "french dog names",
    "spanish cat names",
    "italian pet names",
    "luxury pet names",
    "cute pet names",
    "unique pet names with meanings",
    "nameforpet",
    "pet name database"
  ],
  authors: [{ name: "nameforpet.com Team", url: "https://nameforpet.com" }],
  creator: "nameforpet.com",
  publisher: "nameforpet.com",
  applicationName: "nameforpet",
  category: "Lifestyle",
  alternates: {
    canonical: "/",
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
  openGraph: {
    title: "nameforpet.com - AI Pet Name Generator",
    description: "Upload a picture of your pet to find matching multilingual names powered by Vision AI.",
    url: "https://nameforpet.com",
    siteName: "nameforpet.com",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nameforpet.com - AI Pet Name Generator from Photo",
    description: "Scan your pet's photo to match 17,900+ names across 22 languages powered by Vision AI.",
  },
};

const jsonLdData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "nameforpet.com",
    "url": "https://nameforpet.com",
    "description": "AI-Powered Multilingual Pet Name Finder from Photo",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nameforpet.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "nameforpet AI Pet Name Generator",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "All",
    "url": "https://nameforpet.com",
    "description": "Smart on-device Vision AI that scans pet photos, identifies breeds and coat pigments, and suggests personalized pet names across 22 languages.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1420",
      "bestRating": "5",
      "worstRating": "1"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "nameforpet.com",
    "url": "https://nameforpet.com",
    "logo": "https://nameforpet.com/favicon.ico",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "nameforpet1@gmail.com",
      "contactType": "customer service"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nameforpet.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Pet Gallery",
        "item": "https://nameforpet.com/gallery"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Contact Us",
        "item": "https://nameforpet.com/contact"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the AI name my pet from a photo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "nameforpet.com uses Vision AI to isolate your pet from the background, detect dominant coat pigments, and identify morphological features (like ear posture and eye colors) to match names from 17,900+ curated pet names across 22 languages."
        }
      },
      {
        "@type": "Question",
        "name": "Is my uploaded pet photo private and secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! All uploaded pet photos are processed using secure Vision AI and stored with encrypted cloud object storage. Your data is private and used solely for personalized pet naming."
        }
      },
      {
        "@type": "Question",
        "name": "What animals can the AI name?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI is optimized for dogs, cats, kittens, puppies, rabbits, and birds, with specific coat tone matching and personality persona scoring for cute, luxury, funny, and brave vibes."
        }
      }
    ]
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Suppress third-party browser extension errors (e.g. Urban VPN, Grammarly, MetaMask) from popping up in Next.js development overlay */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                window.addEventListener('error', function(e) {
                  var file = e.filename || '';
                  var msg = e.message || '';
                  if (
                    file.indexOf('chrome-extension://') !== -1 ||
                    file.indexOf('moz-extension://') !== -1 ||
                    file.indexOf('safari-web-extension://') !== -1 ||
                    msg.indexOf('M_ID') !== -1
                  ) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  var stack = (e.reason && (e.reason.stack || e.reason.message)) || '';
                  if (
                    stack.indexOf('chrome-extension://') !== -1 ||
                    stack.indexOf('moz-extension://') !== -1 ||
                    stack.indexOf('M_ID') !== -1
                  ) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              })();
            `
          }}
        />
        {/* Google AdSense Verification & Script */}
        <meta name="google-adsense-account" content="ca-pub-8413163214211850" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8413163214211850"
          crossOrigin="anonymous"
        />
        {jsonLdData.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh overflow-x-hidden`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-stone-900 focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold transition-transform"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
