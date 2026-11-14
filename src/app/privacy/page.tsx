import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  ShoppingBag,
  UserCheck,
  EyeOff,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy & Data Protection - nameforpet.com',
  description: 'Learn how nameforpet.com safeguards your privacy: on-device Vision AI, user account authentication security, and upcoming store payment protections.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 1, 2026';

  return (
    <div className="min-h-screen bg-pet-pattern flex flex-col selection:bg-brand-100 selection:text-brand-900">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-12">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-brand-600 transition-colors px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to AI Name Finder</span>
          </Link>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy-First Commitment</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            Privacy Policy &amp; Data Protection
          </h1>

          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
            At <strong>nameforpet.com</strong>, we believe choosing a name for your pet should be delightful, creative, and completely private. This policy outlines our on-device Vision AI architecture, forthcoming user authentication systems, and product store standards.
          </p>

          <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
            <span className="flex items-center gap-1.5 text-brand-600 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Covers Current Site, Upcoming User Accounts &amp; Store</span>
            </span>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">100% On-Device Vision AI</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Pet photos uploaded for name suggestions are processed locally in your web browser via WebGL. Images are not harvested or stored on external cloud databases.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">Upcoming Login &amp; Accounts</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Our planned user login system will use salted password hashing, encrypted sessions, and GDPR-compliant data export and deletion mechanisms.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">Upcoming Product Store</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              When ordering custom engraved pet bands, payment information will be tokenized via certified PCI-DSS Level 1 payment providers (e.g. Stripe/PayPal). We never store raw card numbers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">No Data Selling</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              We never sell, rent, or monetize your personal information or pet images with third-party data brokers or advertising exchanges.
            </p>
          </div>

        </div>

        {/* Detailed Legal Sections */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-8 text-stone-700 text-xs sm:text-sm leading-relaxed">
          
          {/* Section 1 */}
          <section id="information-collected">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-xs">1</span>
              <h2 className="text-base sm:text-lg font-black text-stone-900">Information We Collect &amp; How It Is Used</h2>
            </div>
            <p className="mb-2">We collect only the minimum information necessary to deliver our services:</p>
            <ul className="space-y-2 pl-4 list-disc text-stone-600">
              <li>
                <strong>Pet Images &amp; Computer Vision Data:</strong> Photos uploaded to the AI Name Finder are decoded directly in client memory to extract coat colors and classify breed traits. This process runs on your device without transmitting raw photos to our servers.
              </li>
              <li>
                <strong>Local Preferences &amp; Favorites:</strong> Your saved pet names and personalized gallery selections are stored in your browser&apos;s local storage (<code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">localStorage</code>) so they remain available between visits without requiring an account.
              </li>
              <li>
                <strong>Usage &amp; Performance Telemetry:</strong> Anonymized technical metrics (such as browser type, approximate viewport width, and error logs) may be collected to troubleshoot site responsiveness and performance.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="user-accounts">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-xs">2</span>
              <h2 className="text-base sm:text-lg font-black text-stone-900">User Login &amp; Account Authentication (Upcoming Features)</h2>
            </div>
            <p className="mb-2">
              As we roll out our upcoming <strong>user login and profile system</strong>, the following policies will govern user accounts:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-stone-600">
              <li>
                <strong>Account Credentials:</strong> If you register an account, we collect your name or username and email address. Passwords are never stored in plaintext; they are securely hashed using modern cryptographic algorithms (such as bcrypt or Argon2).
              </li>
              <li>
                <strong>Social Authentication (OAuth):</strong> If you choose to log in using third-party providers (such as Google or Apple Sign-In), we receive only your verified email and authentication token. We do not access your contacts, private profile data, or passwords on those platforms.
              </li>
              <li>
                <strong>Cross-Device Syncing:</strong> Account registration enables syncing your saved names, customized bands, and pet gallery across multiple smartphones and computers.
              </li>
              <li>
                <strong>Account Deletion:</strong> You will retain the absolute right to delete your account and all associated profile data at any time via your account settings or by contacting us.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="ecommerce-store">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-xs">3</span>
              <h2 className="text-base sm:text-lg font-black text-stone-900">E-Commerce &amp; Product Store (Pet Bands &amp; Merchandise)</h2>
            </div>
            <p className="mb-2">
              For our upcoming <strong>simple product store</strong> offering customized engraved pet bands and accessories:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-stone-600">
              <li>
                <strong>Order Details:</strong> We collect necessary shipping details (recipient name, mailing address, contact phone number) strictly for physical delivery and fulfillment of ordered pet products.
              </li>
              <li>
                <strong>Payment Card Protection:</strong> Payment transactions are executed through certified, PCI-DSS Level 1 compliant payment gateways (such as Stripe or PayPal). <strong>nameforpet.com does not collect, process, or store credit card numbers or security CVV codes.</strong>
              </li>
              <li>
                <strong>Order History:</strong> Receipts, order tracking information, and custom band engraving specifications are retained only as long as necessary for tax compliance, warranty, and returns handling.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="cookies-storage">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-xs">4</span>
              <h2 className="text-base sm:text-lg font-black text-stone-900">Cookies &amp; Local Storage</h2>
            </div>
            <p>
              We prioritize privacy by using minimal, strictly necessary cookies and local storage tokens to remember your preferences (such as language filters, saved name lists, and active session tokens once logged in). We do not deploy invasive cross-site tracking cookies.
            </p>
          </section>

          {/* Section 5 */}
          <section id="rights">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-xs">5</span>
              <h2 className="text-base sm:text-lg font-black text-stone-900">Your Legal Rights (GDPR, CCPA/CPRA)</h2>
            </div>
            <p className="mb-2">Depending on your jurisdiction, you possess the following rights:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Right to Access &amp; Portability
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">Request a complete copy of the data associated with your profile or orders.</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Right to Erasure (&quot;Be Forgotten&quot;)
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">Request full deletion of your account, saved pets, and contact details.</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Right to Rectification
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">Easily correct any inaccurate personal, shipping, or profile information.</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Non-Discrimination
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">We will never discriminate against you for exercising your privacy rights.</p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="contact-us" className="pt-4 border-t border-stone-200">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-brand-500" />
              <h2 className="text-base sm:text-lg font-black text-stone-900">Contact Us Regarding Privacy</h2>
            </div>
            <p className="text-stone-600">
              If you have any questions, suggestions, or data requests regarding this Privacy Policy or our upcoming user account and store security practices, please contact our team at:
            </p>
            <div className="mt-3 inline-block bg-stone-100 rounded-2xl px-4 py-2 font-mono text-xs text-stone-800 border border-stone-200">
              privacy@nameforpet.com
            </div>
          </section>

        </div>

      </main>

      <Footer />
    </div>
  );
}
