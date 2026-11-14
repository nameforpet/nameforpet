import { NextResponse } from 'next/server';
import { PetBandOrder } from '@/lib/types';
import { sendWhatsAppOrderAlert } from '@/lib/whatsappNotifier';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      city,
      postalCode,
      petName,
      petSpecies,
      petImage,
      bandColor,
      bandMaterial,
      collarSize,
      customEngravingText,
      paymentMethod,
      orderTotalLKR,
      notes,
      whatsAppConfig
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !petName) {
      return NextResponse.json(
        { error: 'Missing required order fields (customerName, phone, address, petName).' },
        { status: 400 }
      );
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: PetBandOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      shippingAddress,
      city: city || 'Colombo',
      postalCode: postalCode || '',
      petName,
      petSpecies: petSpecies || 'other',
      petImage: petImage || '',
      bandColor: bandColor || 'Warm Honey Leather',
      bandMaterial: bandMaterial || 'Handcrafted Premium Leather',
      collarSize: collarSize || 'M (Medium 12-16")',
      customEngravingText: customEngravingText || `${petName} · ${customerPhone}`,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      orderTotalLKR: Number(orderTotalLKR) || 2850,
      status: 'pending',
      notes: notes || ''
    };

    // Trigger WhatsApp notification if config is provided
    let waResult: { success: boolean; message: string; directUrl?: string } = { success: false, message: '' };
    if (whatsAppConfig) {
      try {
        waResult = await sendWhatsAppOrderAlert(newOrder, whatsAppConfig);
      } catch (err) {
        console.warn('Error sending automated WhatsApp notification:', err);
      }
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      whatsAppAlert: waResult,
      message: 'Order created successfully!'
    });
  } catch (error: unknown) {
    console.error('Order creation API error:', error);
    return NextResponse.json(
      { error: 'Failed to process order.' },
      { status: 500 }
    );
  }
}
