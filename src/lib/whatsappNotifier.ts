import { PetBandOrder, WhatsAppConfig } from './types';

/**
 * Format order details into a clean WhatsApp message
 */
export function formatOrderWhatsAppMessage(order: PetBandOrder): string {
  const speciesEmoji = order.petSpecies === 'cat' ? '🐱' : order.petSpecies === 'dog' ? '🐶' : '🐾';
  const cleanPhone = order.customerPhone.replace(/\s+/g, '');

  return [
    `🐾 *NEW PET BAND ORDER!* (#${order.id})`,
    `━━━━━━━━━━━━━━━━━━━`,
    `${speciesEmoji} *Pet Name:* ${order.petName} (${order.petSpecies.toUpperCase()})`,
    `🎨 *Band Style:* ${order.bandColor}`,
    `🧵 *Material:* ${order.bandMaterial}`,
    `📏 *Collar Size:* ${order.collarSize}`,
    order.customEngravingText ? `✨ *Engraving:* "${order.customEngravingText}"` : null,
    `━━━━━━━━━━━━━━━━━━━`,
    `👤 *Customer:* ${order.customerName}`,
    `📞 *Phone:* ${cleanPhone}`,
    `📍 *Delivery Address:* ${order.shippingAddress}, ${order.city}`,
    `💳 *Payment:* ${order.paymentMethod}`,
    `💰 *Total Amount:* LKR ${order.orderTotalLKR.toLocaleString()}`,
    order.notes ? `📝 *Notes:* ${order.notes}` : null,
    `━━━━━━━━━━━━━━━━━━━`,
    `🕒 *Placed at:* ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    `👉 *Open Admin:* https://nameforpet.com/admin`
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Dispatches automated WhatsApp notification to the admin's personal phone number
 * using CallMeBot API (free WhatsApp gateway for personal alerts)
 */
export async function sendWhatsAppOrderAlert(
  order: PetBandOrder,
  config: WhatsAppConfig
): Promise<{ success: boolean; message: string; directUrl?: string }> {
  const cleanAdminPhone = (config.adminPhoneNumber || '+94771234567').replace(/[^0-9+]/g, '');
  const textMessage = formatOrderWhatsAppMessage(order);
  const directUrl = `https://wa.me/${cleanAdminPhone.replace('+', '')}?text=${encodeURIComponent(textMessage)}`;

  if (!config.enabled) {
    return {
      success: true,
      message: 'WhatsApp notifications disabled in settings.',
      directUrl
    };
  }

  // If user provided a CallMeBot API key, dispatch automated HTTP webhook
  if (config.apiKey && config.apiKey.trim().length > 0) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
        cleanAdminPhone
      )}&text=${encodeURIComponent(textMessage)}&apikey=${encodeURIComponent(config.apiKey.trim())}`;

      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        return {
          success: true,
          message: 'Automated WhatsApp notification delivered to your phone!',
          directUrl
        };
      }
    } catch (err) {
      console.warn('CallMeBot automated WhatsApp delivery error, fallback to direct URL:', err);
    }
  }

  return {
    success: true,
    message: 'WhatsApp message ready to send directly to your phone number.',
    directUrl
  };
}

/**
 * Creates a pre-filled WhatsApp link to message the customer directly from the Admin Panel
 */
export function getCustomerWhatsAppChatUrl(order: PetBandOrder): string {
  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
  const greeting = [
    `Hi ${order.customerName}! 🐾`,
    `Thank you for placing your order with nameforpet.com!`,
    `Order #${order.id} for "${order.petName}"'s custom band (${order.bandColor}) is now: *${order.status.toUpperCase()}*.`,
    `Delivery destination: ${order.shippingAddress}, ${order.city}.`,
    `Please let us know if you need any adjustments!`
  ].join('\n\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`;
}
