'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Mail,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const TOPIC_OPTIONS = [
  { id: 'general', label: '🐾 General Inquiry / Hello' },
  { id: 'name_suggestion', label: '💡 Suggest a New Pet Name or Language' },
  { id: 'ai_feedback', label: '🤖 Vision AI & Breed Recognition Feedback' },
  { id: 'custom_bands', label: '🛍️ Custom Pet Collar & Tag Store Inquiries' },
  { id: 'partnership', label: '🤝 Partnership, Press & Collaborations' },
  { id: 'support', label: '⚙️ Technical Support' },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(TOPIC_OPTIONS[0].label);
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const contactEmail = 'nameforpet1@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch email.');
      }

      setSubmitStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      console.error('Contact submission error:', err);
      const errMsg = err instanceof Error ? err.message : '';
      setSubmitStatus('error');
      setErrorMessage(
        errMsg || `Could not deliver automatically. You can email us directly at ${contactEmail}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
    `[nameforpet.com] ${subject}`
  )}&body=${encodeURIComponent(
    `Hi nameforpet team,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  )}`;

  return (
    <div className="min-h-screen bg-pet-pattern flex flex-col selection:bg-brand-100 selection:text-brand-900">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-12">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-brand-600 transition-colors px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to AI Pet Name Finder</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm mb-8 text-center sm:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-brand-100/50 to-transparent pointer-events-none -mr-20 -mt-20 rounded-full blur-2xl" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold mb-3">
            <Mail className="w-3.5 h-3.5 text-brand-500" />
            <span>Direct Support &amp; Community Connect</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            Contact the <span className="text-brand-500">nameforpet</span> Team
          </h1>

          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
            Have a question, feedback on our AI vision scanner, a pet name to add to our 17,900+ database, or inquiries about custom pet tags? We would love to hear from you.
          </p>

          <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Response time: <strong>Within 24–48 hours</strong>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-500" />
              Official Email: <strong className="text-stone-800">{contactEmail}</strong>
            </span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-100">
              <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-800">Send Us a Direct Message</h2>
                <p className="text-xs text-stone-500">All submissions are delivered straight to {contactEmail}</p>
              </div>
            </div>

            {submitStatus === 'success' ? (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-stone-800">Message Delivered!</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Thank you for reaching out. We have received your message and sent a copy to{' '}
                  <strong className="text-stone-800">{contactEmail}</strong>. Our team will get back to you shortly!
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitStatus('idle')}
                    className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-full text-xs transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitStatus === 'error' && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Message could not be sent</p>
                      <p className="mt-0.5">{errorMessage}</p>
                      <a
                        href={mailtoUrl}
                        className="inline-block mt-1 font-bold underline hover:text-rose-950"
                      >
                        Click here to send directly using your email app →
                      </a>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex & Milo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm text-stone-800 transition-all placeholder:text-stone-400"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Your Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm text-stone-800 transition-all placeholder:text-stone-400"
                    />
                  </div>
                </div>

                {/* Topic Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    What is this regarding?
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm text-stone-800 bg-white transition-all cursor-pointer"
                  >
                    {TOPIC_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {message.length} characters
                    </span>
                  </div>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind, how we can improve, or describe your pet name idea..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm text-stone-800 transition-all placeholder:text-stone-400 resize-y min-h-[120px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-stone-300 text-white font-black rounded-full shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 text-sm active:scale-95 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending to {contactEmail}...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  <a
                    href={mailtoUrl}
                    className="text-xs text-stone-500 hover:text-brand-600 underline transition-colors"
                  >
                    Prefer your default email app? Click here
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Related Details & Direct Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Direct Email Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-stone-800">Direct Email Address</h3>
                  <p className="text-[11px] text-stone-500">Feel free to email us directly anytime</p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between gap-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-stone-800 truncate select-all">
                  {contactEmail}
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-brand-400 text-xs font-bold text-stone-700 hover:text-brand-600 transition-all flex items-center gap-1 shadow-2xs shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-stone-500">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Monitored daily · Replies within 24–48 hours</span>
              </div>
            </div>

            {/* What You Can Contact Us About */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-stone-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>How We Can Help</span>
              </h3>

              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none">💡</span>
                  <div>
                    <strong className="text-stone-800 block">Name Suggestions</strong>
                    Know a beautiful native or cultural pet name with special meaning? Send it over to add to our database.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none">🤖</span>
                  <div>
                    <strong className="text-stone-800 block">AI Vision Fine-Tuning</strong>
                    Have feedback on how our scanner identified your cat or dog? We love sample feedback!
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none">🛍️</span>
                  <div>
                    <strong className="text-stone-800 block">Personalized Pet Bands</strong>
                    Inquiries regarding our upcoming engraved name collars and custom pet accessories.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none">🤝</span>
                  <div>
                    <strong className="text-stone-800 block">Shelters &amp; Partnerships</strong>
                    We offer pet adoption shelters and charities free feature spots.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ Accordion / Callout */}
            <div className="bg-gradient-to-br from-[#FAF6F0] to-white rounded-3xl p-6 border border-amber-200/70 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-stone-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Server Upload Privacy Guarantee</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Remember: Your uploaded pet photos are processed directly on your device via client-side computer vision. They are never transmitted or stored on remote servers.
              </p>
              <div className="mt-3 pt-2.5 border-t border-amber-200/50">
                <Link
                  href="/privacy"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 underline flex items-center gap-1"
                >
                  <span>Read our full Privacy Policy &amp; Protections →</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
