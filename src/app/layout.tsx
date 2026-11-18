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
  metadataBase: new URL("https://www.nameforpet.com"),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
  title: {
    default: "NameForPet - AI Pet Name Generator from Photo | 17,900+ Names",
    template: "%s | NameForPet"
  },
  description: "Find the most meaningful pet name for your dog, cat, puppy, kitten, rabbit, or bird across 22+ languages. Upload or take a photo and let our Vision AI analyze coat colors, breed traits, and personality styles.",
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
  authors: [{ name: "NameForPet Team", url: "https://www.nameforpet.com" }],
  creator: "NameForPet",
  publisher: "NameForPet",
  applicationName: "NameForPet",
  category: "Lifestyle",
  alternates: {
    canonical: "https://www.nameforpet.com",
    languages: {
      "en-US": "https://www.nameforpet.com",
    },
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
    title: "NameForPet - AI Pet Name Generator from Photo",
    description: "Upload a picture of your pet to find matching multilingual names powered by Vision AI.",
    url: "https://www.nameforpet.com",
    siteName: "NameForPet",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NameForPet - AI Pet Name Generator from Photo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NameForPet - AI Pet Name Generator from Photo",
    description: "Scan your pet's photo to match 17,900+ names across 22 languages powered by Vision AI.",
    images: ["/opengraph-image"],
  },
};

const jsonLdData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NameForPet",
    "url": "https://www.nameforpet.com",
    "description": "AI-Powered Multilingual Pet Name Finder from Photo",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.nameforpet.com/browse?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "NameForPet AI Pet Name Generator",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "All",
    "url": "https://www.nameforpet.com",
    "description": "Smart Vision AI that scans pet photos, identifies breeds and coat pigments, and suggests personalized pet names across 22 languages.",
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
    "name": "NameForPet",
    "url": "https://www.nameforpet.com",
    "logo": "https://www.nameforpet.com/icon.svg",
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
        "item": "https://www.nameforpet.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Browse 17,900+ Names",
        "item": "https://www.nameforpet.com/browse"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Pet Gallery",
        "item": "https://www.nameforpet.com/gallery"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Contact Us",
        "item": "https://www.nameforpet.com/contact"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Find the Perfect Pet Name from a Photo",
    "description": "Step-by-step guide to generating matching multilingual pet names using Vision AI.",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Snap or Upload a Pet Photo",
        "text": "Take a live picture of your pet or upload any clear JPG, PNG, or WEBP photo."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "AI Vision Analysis",
        "text": "The Vision AI detects coat pigments, eye color, and canine or feline morphological traits."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Explore Matching Multilingual Names",
        "text": "Review personalized pet names ranked by match score with cultural meanings, origins, and fun facts."
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the AI name generator identify my pet from a photo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NameForPet uses intelligent Vision AI to isolate your pet from the background, determine the dominant coat palette, identify morphological features like ear posture and facial indicators, and match scores across 17,900+ curated pet names."
        }
      },
      {
        "@type": "Question",
        "name": "Is my pet's photo stored safely and privately?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! All uploaded pet photos are processed using secure Vision AI and stored with encrypted cloud object storage. Your data is private, never shared with third-party advertisers, and used solely for personalized pet naming."
        }
      },
      {
        "@type": "Question",
        "name": "Can the AI name both dogs and cats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our AI includes specialized canine and feline classifiers. Kittens and adult cats are recognized by characteristic facial morphology, upright triangular ears, and eye pigmentation. You also have a 1-click Species Switcher on the results card to toggle between Dog, Cat, Rabbit, and Bird at any time."
        }
      },
      {
        "@type": "Question",
        "name": "Which languages and cultural origins are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our unified database features names from 22+ languages and traditions, including Japanese (with Kanji), French, Spanish, Italian, German, Danish, Irish, Scottish, Norse, Swahili, Korean, and English, each with cultural origins, meanings, and fun facts."
        }
      },
      {
        "@type": "Question",
        "name": "What are the AI Name Personas (Cute, Luxury, Funny, Brave)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI evaluates phonetics, syllables, and historical definitions to assign badges like Cute & Sweet (🌸), Luxury & Royal (💎), Funny & Quirky (😂), Brave & Bold (🦁), and Gentle & Cozy (🌿), making it easy to filter names matching your pet's unique character."
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 (GA4) */}
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              id="google-analytics"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `
              }}
            />
          </>
        )}
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
