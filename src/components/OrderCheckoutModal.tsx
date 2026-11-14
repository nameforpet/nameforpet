'use client';

import React, { useState } from 'react';
import { RecommendedName, PetAnalysisResult, PetBandOrder } from '@/lib/types';
import { saveOrderLocally, getStoredWhatsAppConfig } from '@/lib/orderStorage';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  nameItem: RecommendedName | null;
  petImageSrc: string | null;
  analysis: PetAnalysisResult | null;
}

const BAND_STYLES = [
  { id: 'honey_leather', name: 'Warm Honey Leather', price: 2850, hex: '#D97706', desc: 'Handcrafted full-grain saddle leather' },
  { id: 'obsidian_black', name: 'Obsidian Midnight Black', price: 3100, hex: '#18181B', desc: 'Reinforced tactical matte nylon' },
  { id: 'rose_velvet', name: 'Rose Velvet Silk', price: 2650, hex: '#E11D48', desc: 'Plush velvet soft-touch comfort' },
  { id: 'sapphire_blue', name: 'Royal Sapphire Blue', price: 2850, hex: '#2563EB', desc: 'Waterproof braided all-weather poly' }
];

const COLLAR_SIZES = [
  { id: 'xs', label: 'XS (Puppy / Kitten 6–9")' },
  { id: 's', label: 'S (Small Dogs & Cats 8–12")' },
  { id: 'm', label: 'M (Medium Dogs 12–16")' },
  { id: 'l', label: 'L (Large Dogs 16–22")' }
];

export default function OrderCheckoutModal({
  isOpen,
  onClose,
  nameItem,
  petImageSrc,
  analysis
}: OrderCheckoutModalProps) {
  const cleanName = nameItem ? nameItem.name.split('(')[0].trim() : 'Pet';

  const [selectedBand, setSelectedBand] = useState(BAND_STYLES[0]);
  const [selectedSize, setSelectedSize] = useState(COLLAR_SIZES[2].label);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Colombo');
  const [engravingText, setEngravingText] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Direct Bank Transfer'>('Cash on Delivery');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<PetBandOrder | null>(null);

  if (!isOpen || !nameItem) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    const waConfig = getStoredWhatsAppConfig();

    const orderPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress: customerAddress.trim(),
      city: customerCity.trim(),
      petName: cleanName,
      petSpecies: (analysis?.detectedSpecies as string) || 'other',
      petImage: petImageSrc || '',
      bandColor: selectedBand.name,
      bandMaterial: selectedBand.desc,
      collarSize: selectedSize,
      customEngravingText: engravingText.trim() || `${cleanName} · ${customerPhone.trim()}`,
      paymentMethod,
      orderTotalLKR: selectedBand.price,
      notes: notes.trim(),
      whatsAppConfig: waConfig
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      const finalOrder: PetBandOrder = data.order || {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        ...orderPayload,
        status: 'pending'
      };

      saveOrderLocally(finalOrder);
      setCompletedOrder(finalOrder);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f97316', '#fbbf24', '#10b981', '#3b82f6']
      });
    } catch (err) {
      console.error('Order submission error:', err);
      // Fallback save locally
      const localFallbackOrder: PetBandOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        ...orderPayload,
        status: 'pending'
      };
      saveOrderLocally(localFallbackOrder);
      setCompletedOrder(localFallbackOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div onClick={onClose} className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-stone-200 z-10 flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {completedOrder ? (
          /* Order Confirmed Screen */
          <div className="p-6 sm:p-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Order Received · #{completedOrder.id}
              </span>
              <h2 className="text-2xl font-black text-stone-900 mt-2">
                Band Ordered for {completedOrder.petName}!
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                An automated notification has been logged for our fulfillment team. We will contact you at <strong>{completedOrder.customerPhone}</strong> to confirm dispatch.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Style:</span>
                <span className="font-bold text-stone-800">{completedOrder.bandColor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Size:</span>
                <span className="font-bold text-stone-800">{completedOrder.collarSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Engraved:</span>
                <span className="font-bold text-amber-700 font-mono">&ldquo;{completedOrder.customEngravingText}&rdquo;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery to:</span>
                <span className="font-bold text-stone-800">{completedOrder.shippingAddress}, {completedOrder.city}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-sm">
                <span>Total Due:</span>
                <span className="text-brand-600">LKR {completedOrder.orderTotalLKR.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <div className="p-5 sm:p-7">
            
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-stone-100">
              {petImageSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={petImageSrc}
                  alt={cleanName}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                />
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  Custom Engraved Band
                </span>
                <h2 className="text-lg font-black text-stone-900 mt-0.5">
                  Order Band for {cleanName}
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              
              {/* Band Color Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  1. Select Band Style &amp; Leather Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BAND_STYLES.map((band) => {
                    const isSelected = selectedBand.id === band.id;
                    return (
                      <button
                        key={band.id}
                        type="button"
                        onClick={() => setSelectedBand(band)}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50/50 shadow-2xs'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 border border-black/10"
                          style={{ backgroundColor: band.hex }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">{band.name}</p>
                          <p className="text-[11px] font-mono font-bold text-brand-600 mt-0.5">
                            LKR {band.price.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collar Size */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  2. Collar Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-white cursor-pointer focus:outline-none focus:border-brand-500"
                >
                  {COLLAR_SIZES.map((sz) => (
                    <option key={sz.id} value={sz.label}>
                      {sz.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Tag Engraving */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>3. Custom Tag Engraving</span>
                  <span className="text-[10px] text-stone-400 font-normal">Included Free</span>
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${cleanName} · 077 123 4567`}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Customer Shipping Details */}
              <div className="pt-2 border-t border-stone-100 space-y-3">
                <span className="text-xs font-bold text-stone-900 block">
                  4. Shipping &amp; Contact Information
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Phone (WhatsApp) *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Street Address / House No. *"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="City *"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Delivery instructions / notes (Optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  5. Payment Option
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-brand-500 bg-brand-50 text-brand-800'
                        : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    💵 Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Direct Bank Transfer')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                      paymentMethod === 'Direct Bank Transfer'
                        ? 'border-brand-500 bg-brand-50 text-brand-800'
                        : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    🏦 Bank Transfer
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-500 via-amber-500 to-orange-500 hover:from-brand-600 hover:to-orange-600 text-white font-black text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Confirm &amp; Place Order (LKR {selectedBand.price.toLocaleString()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
