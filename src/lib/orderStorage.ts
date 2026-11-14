import { PetBandOrder, OrderStatus, WhatsAppConfig } from './types';

const ORDERS_STORAGE_KEY = 'nameforpet_admin_orders';
const WHATSAPP_CONFIG_KEY = 'nameforpet_whatsapp_config';
const ADMIN_AUTH_KEY = 'nameforpet_admin_authenticated';

// Initial sample orders so the admin panel looks alive immediately
export const INITIAL_ORDERS: PetBandOrder[] = [
  {
    id: 'ORD-8492',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    customerName: 'Alex Fernando',
    customerEmail: 'alex.fernando@example.com',
    customerPhone: '+94 77 234 5678',
    shippingAddress: '42 Flower Road, Kollupitiya',
    city: 'Colombo 03',
    postalCode: '00300',
    petName: 'Mochi',
    petSpecies: 'dog',
    petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
    bandColor: 'Warm Honey Leather',
    bandMaterial: 'Handcrafted Premium Leather',
    collarSize: 'M (Medium 12-16")',
    customEngravingText: 'Mochi · 0772345678',
    paymentMethod: 'Cash on Delivery',
    orderTotalLKR: 2850,
    status: 'pending',
    notes: 'Please call before delivery'
  },
  {
    id: 'ORD-8491',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    customerName: 'Kavindi Perera',
    customerEmail: 'kavindi.p@example.com',
    customerPhone: '+94 71 890 1234',
    shippingAddress: '18 Havelock Road',
    city: 'Colombo 05',
    postalCode: '00500',
    petName: 'Luna',
    petSpecies: 'cat',
    petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
    bandColor: 'Rose Velvet Silk',
    bandMaterial: 'Braided Velvet Soft Touch',
    collarSize: 'S (Small 8-12")',
    customEngravingText: 'Luna · 0718901234',
    paymentMethod: 'Direct Bank Transfer',
    orderTotalLKR: 2650,
    status: 'processing',
    notes: 'Bank slip confirmed via WhatsApp'
  },
  {
    id: 'ORD-8488',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // Yesterday
    customerName: 'Nisal Jayawardena',
    customerEmail: 'nisal.j@example.com',
    customerPhone: '+94 76 543 2109',
    shippingAddress: '78 Kandy Road, Dalugama',
    city: 'Kelaniya',
    postalCode: '11600',
    petName: 'Rocky',
    petSpecies: 'dog',
    petImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
    bandColor: 'Obsidian Midnight Black',
    bandMaterial: 'Heavy-Duty Reinforced Nylon',
    collarSize: 'L (Large 16-22")',
    customEngravingText: 'Rocky · 0765432109',
    paymentMethod: 'Cash on Delivery',
    orderTotalLKR: 3100,
    status: 'shipped',
    notes: 'Dispatched via Prompt Xpress'
  },
  {
    id: 'ORD-8480',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    customerName: 'Dinuka Silva',
    customerEmail: 'dinuka.silva@example.com',
    customerPhone: '+94 70 112 2334',
    shippingAddress: '25 Beach Road, Mount Lavinia',
    city: 'Dehiwala-Mount Lavinia',
    postalCode: '10370',
    petName: 'Simba',
    petSpecies: 'cat',
    petImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80',
    bandColor: 'Royal Sapphire Blue',
    bandMaterial: 'Handcrafted Premium Leather',
    collarSize: 'S (Small 8-12")',
    customEngravingText: 'Simba · 0701122334',
    paymentMethod: 'Cash on Delivery',
    orderTotalLKR: 2850,
    status: 'delivered',
    notes: 'Customer left 5-star review'
  }
];

// Default WhatsApp settings
export const DEFAULT_WHATSAPP_CONFIG: WhatsAppConfig = {
  enabled: true,
  adminPhoneNumber: '+94771234567', // user can change in settings tab
  apiKey: ''
};

// ---------------------------------------------------------------------------
// Client Storage Handlers
// ---------------------------------------------------------------------------

export function getStoredOrders(): PetBandOrder[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored orders:', err);
    return INITIAL_ORDERS;
  }
}

export function saveOrderLocally(newOrder: PetBandOrder): PetBandOrder[] {
  if (typeof window === 'undefined') return [newOrder, ...INITIAL_ORDERS];
  try {
    const current = getStoredOrders();
    const updated = [newOrder, ...current];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save order locally:', err);
    return [newOrder];
  }
}

export function updateOrderStatusLocally(orderId: string, newStatus: OrderStatus): PetBandOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredOrders();
    const updated = current.map(o => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to update order status locally:', err);
    return [];
  }
}

export function deleteOrderLocally(orderId: string): PetBandOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredOrders();
    const updated = current.filter(o => o.id !== orderId);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete order locally:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// WhatsApp Configuration Storage
// ---------------------------------------------------------------------------

export function getStoredWhatsAppConfig(): WhatsAppConfig {
  if (typeof window === 'undefined') return DEFAULT_WHATSAPP_CONFIG;
  try {
    const raw = localStorage.getItem(WHATSAPP_CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(WHATSAPP_CONFIG_KEY, JSON.stringify(DEFAULT_WHATSAPP_CONFIG));
      return DEFAULT_WHATSAPP_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_WHATSAPP_CONFIG;
  }
}

export function saveWhatsAppConfig(cfg: WhatsAppConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WHATSAPP_CONFIG_KEY, JSON.stringify(cfg));
}

// ---------------------------------------------------------------------------
// Admin Authentication Session
// ---------------------------------------------------------------------------

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function setAdminAuthenticated(auth: boolean): void {
  if (typeof window === 'undefined') return;
  if (auth) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  }
}
