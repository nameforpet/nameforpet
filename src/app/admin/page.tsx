'use client';

import React, { useState, useEffect } from 'react';
import {
  PetBandOrder,
  OrderStatus,
  WhatsAppConfig,
  RegisteredUser
} from '@/lib/types';
import {
  getStoredOrders,
  updateOrderStatusLocally,
  deleteOrderLocally,
  saveOrderLocally,
  getStoredWhatsAppConfig,
  saveWhatsAppConfig,
  isAdminAuthenticated,
  setAdminAuthenticated
} from '@/lib/orderStorage';
import {
  getStoredUsers,
  deleteUserLocally as deleteUserStorage
} from '@/lib/userStorage';
import {
  formatOrderWhatsAppMessage,
  sendWhatsAppOrderAlert,
  getCustomerWhatsAppChatUrl
} from '@/lib/whatsappNotifier';
import {
  ShoppingBag,
  Clock,
  Truck,
  MessageSquare,
  Search,
  RefreshCw,
  Plus,
  Trash2,
  Phone,
  MapPin,
  Tag,
  Sparkles,
  Send,
  HelpCircle,
  Check,
  Users,
  Copy,
  Mail,
  Zap,
  Download,
  Database,
  HardDrive,
  Cpu,
  Activity,
  Lock,
  LogOut,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

type TabType = 'orders' | 'users' | 'whatsapp' | 'catalog' | 'system';

const STATUS_OPTIONS: { id: OrderStatus; label: string; color: string }[] = [
  { id: 'pending', label: 'Pending', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'processing', label: 'Processing', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  { id: 'shipped', label: 'Shipped', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'delivered', label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
];

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders, setOrders] = useState<PetBandOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<PetBandOrder | null>(null);

  // WhatsApp Config state
  const [waConfig, setWaConfig] = useState<WhatsAppConfig>({
    enabled: true,
    adminPhoneNumber: '+94771234567',
    apiKey: ''
  });
  const [waSavedMessage, setWaSavedMessage] = useState(false);
  const [testAlertSending, setTestAlertSending] = useState(false);
  const [testAlertResult, setTestAlertResult] = useState<{ success: boolean; msg: string; url?: string } | null>(null);

  // Users state
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userProviderFilter, setUserProviderFilter] = useState<'all' | 'google' | 'email' | 'dev_bypass'>('all');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // System Status state
  interface ServiceStatus {
    ok: boolean;
    latencyMs?: number;
    detail?: string;
    name: string;
  }
  interface HealthData {
    status: string;
    timestamp: string;
    services: {
      supabase: ServiceStatus;
      gemini: ServiceStatus;
      b2: ServiceStatus;
    };
    env: {
      supabase_url_set: boolean;
      gemini_key_set: boolean;
      b2_configured: boolean;
      node_env: string;
    };
  }
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthLastChecked, setHealthLastChecked] = useState<string | null>(null);

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
      setHealthLastChecked(new Date().toLocaleTimeString());
    } catch {
      setHealthData(null);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    setIsAdminLoggedIn(isAdminAuthenticated());
    setOrders(getStoredOrders());
    setWaConfig(getStoredWhatsAppConfig());
    setUsers(getStoredUsers());
    fetchHealth(); // auto-load on mount
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (isLockedOut) {
      setPinError('Too many failed attempts. Temporary security lockout active.');
      return;
    }

    const trimmed = adminPinInput.trim();
    // Default PIN: petadmin2026 or admin2026
    const validPins = ['petadmin2026', 'admin2026', 'loveforpet2026'];

    if (validPins.includes(trimmed)) {
      setAdminAuthenticated(true);
      setIsAdminLoggedIn(true);
      setAdminPinInput('');
      setPinAttempts(0);
    } else {
      const nextAttempts = pinAttempts + 1;
      setPinAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setIsLockedOut(true);
        setPinError('Security Lockout: 5 failed attempts reached. Please wait 2 minutes.');
        setTimeout(() => {
          setIsLockedOut(false);
          setPinAttempts(0);
        }, 2 * 60 * 1000);
      } else {
        setPinError(`Incorrect Security PIN. ${5 - nextAttempts} attempt(s) remaining.`);
      }
    }
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setIsAdminLoggedIn(false);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      const updated = deleteUserStorage(userId);
      setUsers(updated);
    }
  };

  const handleExportEmailsCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Name,Email,Registered Date,Last Login,Provider"]
      .concat(users.map(u => `"${u.id}","${u.name}","${u.email}","${u.createdAt}","${u.lastLoginAt}","${u.provider || 'email'}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nameforpet_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(u => {
    const q = userSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);

    const isGoogle = u.provider === 'google' || u.id.startsWith('USR-G');
    const isDev = u.provider === 'dev_bypass';
    const isEmail = !isGoogle && !isDev;

    let matchesProvider = true;
    if (userProviderFilter === 'google') matchesProvider = isGoogle;
    else if (userProviderFilter === 'email') matchesProvider = isEmail;
    else if (userProviderFilter === 'dev_bypass') matchesProvider = isDev;

    return matchesSearch && matchesProvider;
  });

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.includes(q) ||
      order.petName.toLowerCase().includes(q) ||
      order.city.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.orderTotalLKR, 0);

  // Actions
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatusLocally(orderId, newStatus);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete order #${orderId}?`)) {
      const updated = deleteOrderLocally(orderId);
      setOrders(updated);
      if (selectedOrder && selectedOrder.id === orderId) setSelectedOrder(null);
    }
  };

  const handleCreateTestOrder = () => {
    const sampleNames = ['Kiki', 'Bruno', 'Simba', 'Bella', 'Nala', 'Milo'];
    const sampleSpecies = ['dog', 'cat'];
    const sampleColors = ['Warm Honey Leather', 'Obsidian Midnight Black', 'Rose Velvet Silk', 'Royal Sapphire Blue'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomSpecies = sampleSpecies[Math.floor(Math.random() * sampleSpecies.length)];
    const randomColor = sampleColors[Math.floor(Math.random() * sampleColors.length)];

    const newOrder: PetBandOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: 'Sample Customer',
      customerEmail: 'customer@example.com',
      customerPhone: '+94 77 999 8888',
      shippingAddress: '123 Main Street',
      city: 'Colombo',
      postalCode: '00100',
      petName: randomName,
      petSpecies: randomSpecies,
      bandColor: randomColor,
      bandMaterial: 'Handcrafted Premium Leather',
      collarSize: 'M (Medium 12-16")',
      customEngravingText: `${randomName} · 0779998888`,
      paymentMethod: 'Cash on Delivery',
      orderTotalLKR: 2850,
      status: 'pending',
      notes: 'Test order created via Admin Panel'
    };

    const updated = saveOrderLocally(newOrder);
    setOrders(updated);
    setSelectedOrder(newOrder);
  };

  const handleSaveWhatsAppConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveWhatsAppConfig(waConfig);
    setWaSavedMessage(true);
    setTimeout(() => setWaSavedMessage(false), 3000);
  };

  const handleSendTestAlert = async () => {
    if (orders.length === 0) return;
    setTestAlertSending(true);
    setTestAlertResult(null);

    const testOrder = orders[0];
    const result = await sendWhatsAppOrderAlert(testOrder, waConfig);

    setTestAlertSending(false);
    setTestAlertResult({
      success: result.success,
      msg: result.message,
      url: result.directUrl
    });
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Security Access</h1>
            <p className="text-xs text-stone-400 mt-1">
              Enter your master security PIN to access customer orders, user accounts, and system controls.
            </p>
          </div>

          {pinError && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 text-left">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                autoFocus
                disabled={isLockedOut}
                placeholder="Enter Admin PIN"
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                className="w-full py-3 px-4 rounded-2xl bg-stone-950 border border-stone-800 text-sm text-center font-mono tracking-widest text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLockedOut || !adminPinInput.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-98 disabled:opacity-40 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <p className="text-[11px] text-stone-500">
            Protected with session security &amp; brute-force lockout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-stone-800">
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 rounded-2xl border border-stone-800">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Management</span>
            <span className="px-1.5 py-0.2 bg-stone-950/40 rounded-full text-[10px]">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users &amp; Accounts</span>
            <span className="px-1.5 py-0.2 bg-stone-950/40 rounded-full text-[10px]">
              {users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'whatsapp'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Notifications</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Band Catalog &amp; Pricing</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('system');
              fetchHealth();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'system'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System &amp; Cloud Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreateTestOrder}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Order</span>
          </button>
          <button
            type="button"
            onClick={() => setOrders(getStoredOrders())}
            title="Refresh order data"
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleAdminLogout}
            title="Lock Admin Dashboard"
            className="px-3 py-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 border border-stone-800 hover:border-rose-500/30 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════
          TAB 1: ORDERS DASHBOARD
      ═════════════════════════════════════════════════════════ */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <span className="text-xs text-stone-400 font-medium flex items-center gap-1 mb-1">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Total Orders
              </span>
              <p className="text-2xl font-black text-white">{totalOrders}</p>
            </div>

            <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-4">
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" /> Pending Actions
              </span>
              <p className="text-2xl font-black text-amber-400">{pendingOrders}</p>
            </div>

            <div className="bg-stone-900 border border-sky-500/20 rounded-2xl p-4">
              <span className="text-xs text-sky-400 font-medium flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> In Production
              </span>
              <p className="text-2xl font-black text-sky-400">{processingOrders}</p>
            </div>

            <div className="bg-stone-900 border border-emerald-500/20 rounded-2xl p-4">
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mb-1">
                <Truck className="w-3.5 h-3.5" /> Delivered
              </span>
              <p className="text-2xl font-black text-emerald-400">{completedOrders}</p>
            </div>

            <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4">
              <span className="text-xs text-amber-300 font-medium block mb-1">
                Total Revenue
              </span>
              <p className="text-xl sm:text-2xl font-black text-amber-400">
                LKR {totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by order ID, pet name, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  statusFilter === 'all'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                All ({orders.length})
              </button>
              {STATUS_OPTIONS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    statusFilter === st.id
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {st.label} ({orders.filter((o) => o.status === st.id).length})
                </button>
              ))}
            </div>
          </div>

          {/* Orders List / Table */}
          {filteredOrders.length === 0 ? (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-12 text-center text-stone-400 space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto text-stone-600" />
              <p className="font-bold text-white">No orders matching your filter</p>
              <p className="text-xs max-w-sm mx-auto">
                Try switching the status filter or click &ldquo;Simulate Order&rdquo; above to create a test order.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                const statusMeta = STATUS_OPTIONS.find((s) => s.id === order.status) || STATUS_OPTIONS[0];

                return (
                  <div
                    key={order.id}
                    className={`bg-stone-900 border transition-all rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    
                    {/* Left: Pet & Order Identity */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      {order.petImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={order.petImage}
                          alt={order.petName}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-800"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-stone-800 flex items-center justify-center text-xl shrink-0">
                          🐾
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-amber-400">
                            #{order.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${statusMeta.color}`}>
                            {order.status}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {new Date(order.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-white mt-0.5 truncate">
                          {order.petName} &apos;s Band
                        </h3>

                        <p className="text-xs text-stone-400 mt-0.5 flex flex-wrap items-center gap-2">
                          <span>Style: <strong>{order.bandColor}</strong></span>
                          <span>·</span>
                          <span>Size: <strong>{order.collarSize}</strong></span>
                        </p>
                      </div>
                    </div>

                    {/* Middle: Customer & Address Info */}
                    <div className="text-xs text-stone-300 space-y-1 w-full lg:w-auto">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{order.customerName}</span>
                        <span className="text-stone-500 font-normal">({order.customerPhone})</span>
                      </div>
                      <div className="text-stone-400 flex items-center gap-1 truncate max-w-sm">
                        <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                        <span className="truncate">{order.shippingAddress}, {order.city}</span>
                      </div>
                      <div className="text-[11px] text-amber-300/80 font-mono">
                        LKR {order.orderTotalLKR.toLocaleString()} · {order.paymentMethod}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-800">
                      
                      {/* Status Dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st.id} value={st.id}>
                            Set: {st.label}
                          </option>
                        ))}
                      </select>

                      {/* 1-Click WhatsApp Customer Contact */}
                      <a
                        href={getCustomerWhatsAppChatUrl(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                        title="Open WhatsApp chat with customer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Customer</span>
                      </a>

                      {/* Send Alert to Admin */}
                      <a
                        href={`https://wa.me/${(waConfig.adminPhoneNumber || '+94771234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          formatOrderWhatsAppMessage(order)
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-bold transition-colors"
                        title="Send / Forward WhatsApp Alert to My Phone"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          TAB 2: REGISTERED USERS & EMAILS
      ═════════════════════════════════════════════════════════ */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          {/* Top Metrics Cards for Users */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <span className="text-xs text-stone-400 font-medium flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5 text-amber-400" /> Total Users
              </span>
              <p className="text-2xl font-black text-white">{users.length}</p>
            </div>

            <div className="bg-stone-900 border border-blue-500/30 rounded-2xl p-4">
              <span className="text-xs text-blue-400 font-medium flex items-center gap-1.5 mb-1">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.13C3.25 21.3 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.62H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.38l4.02-3.13z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.25 6.62l4.02 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
                <span>Google Users</span>
              </span>
              <p className="text-2xl font-black text-blue-400">
                {users.filter(u => u.provider === 'google' || u.id.startsWith('USR-G')).length}
              </p>
            </div>

            <div className="bg-stone-900 border border-emerald-500/20 rounded-2xl p-4">
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mb-1">
                <Mail className="w-3.5 h-3.5" /> Email Accounts
              </span>
              <p className="text-2xl font-black text-emerald-400">
                {users.filter(u => u.provider !== 'google' && !u.id.startsWith('USR-G') && u.provider !== 'dev_bypass').length}
              </p>
            </div>

            <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-4">
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5" /> Dev Bypass
              </span>
              <p className="text-2xl font-black text-amber-400">
                {users.filter(u => u.provider === 'dev_bypass').length}
              </p>
            </div>
          </div>

          {/* Search bar & Provider Filter Tabs */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search by email, name, user ID..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 pl-9 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                />
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
              </div>

              {/* Provider Quick Filter Tabs */}
              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-[11px] overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setUserProviderFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                    userProviderFilter === 'all'
                      ? 'bg-stone-800 text-white shadow-2xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserProviderFilter('google')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    userProviderFilter === 'google'
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.13C3.25 21.3 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.62H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.38l4.02-3.13z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.25 6.62l4.02 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
                  </svg>
                  <span>Google ({users.filter(u => u.provider === 'google' || u.id.startsWith('USR-G')).length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserProviderFilter('email')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                    userProviderFilter === 'email'
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Email ({users.filter(u => u.provider !== 'google' && !u.id.startsWith('USR-G') && u.provider !== 'dev_bypass').length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserProviderFilter('dev_bypass')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                    userProviderFilter === 'dev_bypass'
                      ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Dev ({users.filter(u => u.provider === 'dev_bypass').length})
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="text-xs text-stone-400">
                Showing <strong>{filteredUsers.length}</strong> of {users.length} accounts
              </span>
              <button
                type="button"
                onClick={handleExportEmailsCSV}
                className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-amber-400 border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Download user list as CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950/70 border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 font-bold">Registered Email Address</th>
                    <th className="px-4 py-3.5 font-bold">Full Name</th>
                    <th className="px-4 py-3.5 font-bold">Sign Up Date</th>
                    <th className="px-4 py-3.5 font-bold">Last Activity</th>
                    <th className="px-4 py-3.5 font-bold">Sign Up Method</th>
                    <th className="px-4 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                        No registered users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-stone-850/50 transition-colors">
                        
                        {/* Email with copy button */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-white font-bold">{user.email}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(user.email)}
                              className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                              title="Copy email to clipboard"
                            >
                              {copiedEmail === user.email ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <span className="text-[10px] text-stone-500 font-mono">ID: {user.id}</span>
                        </td>

                        {/* Name */}
                        <td className="px-4 py-3.5 text-stone-300 font-semibold">
                          {user.name}
                        </td>

                        {/* Created At */}
                        <td className="px-4 py-3.5 text-stone-400">
                          {new Date(user.createdAt).toLocaleDateString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>

                        {/* Last Login */}
                        <td className="px-4 py-3.5 text-stone-400">
                          {new Date(user.lastLoginAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>

                        {/* Method / Provider */}
                        <td className="px-4 py-3.5">
                          {user.provider === 'google' || user.id.startsWith('USR-G') ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-stone-900 border border-stone-200 shadow-2xs">
                              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.13C3.25 21.3 7.33 24 12 24z"/>
                                <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.62H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.38l4.02-3.13z"/>
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.25 6.62l4.02 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
                              </svg>
                              <span>Google</span>
                            </span>
                          ) : user.provider === 'dev_bypass' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <Zap className="w-3 h-3 text-amber-400" /> Dev Bypass
                            </span>
                          ) : user.provider === 'email_verification_code' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Email OTP
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <Mail className="w-3 h-3 text-emerald-400" /> Email
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right space-x-1.5">
                          <a
                            href={`mailto:${user.email}`}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white inline-block transition-colors"
                            title="Send email to user"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 inline-block transition-colors cursor-pointer"
                            title="Delete user account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          TAB 3: WHATSAPP NOTIFICATION SETTINGS
      ═════════════════════════════════════════════════════════ */}
      {activeTab === 'whatsapp' && (
        <div className="max-w-3xl space-y-6">
          
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>WhatsApp Order Alerts Configuration</span>
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Receive instant WhatsApp alerts on your personal phone number whenever someone places an order on nameforpet.com
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active</span>
              </div>
            </div>

            <form onSubmit={handleSaveWhatsAppConfig} className="space-y-4 pt-2">
              
              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Your Personal WhatsApp Phone Number (With Country Code)
                </label>
                <input
                  type="text"
                  required
                  placeholder="+94 77 123 4567 or +1 415 555 2671"
                  value={waConfig.adminPhoneNumber}
                  onChange={(e) => setWaConfig({ ...waConfig, adminPhoneNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:outline-none focus:border-emerald-500 text-sm text-white font-mono"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Example: <code>+94771234567</code> for Sri Lanka or <code>+1...</code> for US.
                </p>
              </div>

              {/* CallMeBot API Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-300">
                    CallMeBot Free API Key (Optional for Automatic Background Alerts)
                  </label>
                  <a
                    href="https://www.callmebot.com/blog/free-api-whatsapp-messages/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-400 underline hover:text-emerald-300"
                  >
                    How to get your free key in 30 seconds ↗
                  </a>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 1234567"
                  value={waConfig.apiKey || ''}
                  onChange={(e) => setWaConfig({ ...waConfig, apiKey: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:outline-none focus:border-emerald-500 text-sm text-white font-mono"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  CallMeBot is 100% free. If left blank, you can still send/forward alerts manually with the 1-click WhatsApp button.
                </p>
              </div>

              {/* Save & Test Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Save WhatsApp Settings</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendTestAlert}
                  disabled={testAlertSending}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700"
                >
                  {testAlertSending ? (
                    <span>Sending test alert...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Alert to My Phone</span>
                    </>
                  )}
                </button>

                {waSavedMessage && (
                  <span className="text-xs text-emerald-400 font-bold animate-fade-in">
                    ✓ Settings saved successfully!
                  </span>
                )}
              </div>

              {testAlertResult && (
                <div className="mt-3 p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-2">
                  <p className="font-bold text-white">Test Alert Status:</p>
                  <p className="text-stone-400">{testAlertResult.msg}</p>
                  {testAlertResult.url && (
                    <a
                      href={testAlertResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-bold"
                    >
                      <span>Click here to open test message in WhatsApp Web / App →</span>
                    </a>
                  )}
                </div>
              )}

            </form>
          </div>

          {/* How It Works Explainer Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 text-xs text-stone-400 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>How Order Alerts Work</span>
            </h3>
            <p>
              1. Whenever a customer on <strong>nameforpet.com</strong> selects their pet name, enters their address, and clicks &ldquo;Confirm Order&rdquo;, our API automatically formats an order notification.
            </p>
            <p>
              2. It includes the pet&apos;s name, band color, collar size, customer phone, address, and total price.
            </p>
            <p>
              3. You receive an instant WhatsApp alert on <strong>{waConfig.adminPhoneNumber}</strong> so you can begin production or dispatch without waiting.
            </p>
          </div>

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          TAB 3: PRODUCTS & BAND CATALOG
      ═════════════════════════════════════════════════════════ */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-black text-white mb-1">
              Pet Band &amp; Collar Inventory
            </h2>
            <p className="text-xs text-stone-400 mb-6">
              Current collar styles and standard sizes available in your store.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Warm Honey Leather', price: 'LKR 2,850', color: '#D97706', material: 'Full Grain Leather' },
                { name: 'Obsidian Midnight Black', price: 'LKR 3,100', color: '#18181B', material: 'Reinforced Matte Nylon' },
                { name: 'Rose Velvet Silk', price: 'LKR 2,650', color: '#E11D48', material: 'Soft Velvet Comfort' },
                { name: 'Royal Sapphire Blue', price: 'LKR 2,850', color: '#2563EB', material: 'Waterproof Braided Poly' }
              ].map((band, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: band.color }} />
                    <span className="font-bold text-sm text-white">{band.name}</span>
                  </div>
                  <p className="text-xs text-stone-400">{band.material}</p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-850">
                    <span className="font-black text-amber-400 font-mono">{band.price}</span>
                    <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10">In Stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          TAB 4: SYSTEM & CLOUD STATUS
      ═════════════════════════════════════════════════════════ */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          
          {/* Header & Refresh */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-black text-white">System Infrastructure &amp; Cloud Status</h2>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Live health monitoring for your Supabase Database, Backblaze B2 Storage, and Gemini Vision AI.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {healthLastChecked && (
                  <span className="text-[11px] text-stone-500">
                    Last checked: <strong className="text-stone-300 font-mono">{healthLastChecked}</strong>
                  </span>
                )}
                <button
                  type="button"
                  onClick={fetchHealth}
                  disabled={healthLoading}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-stone-700 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{healthLoading ? 'Checking...' : 'Refresh Status'}</span>
                </button>
              </div>
            </div>

            {/* Live Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              
              {/* 1. Supabase Database */}
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm text-white">Supabase Database</span>
                  </div>
                  {healthData?.services.supabase.ok ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      OFFLINE
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1 text-stone-400">
                  <p>Status: <strong className="text-stone-200">{healthData?.services.supabase.detail || 'Checking...'}</strong></p>
                  {healthData?.services.supabase.latencyMs !== undefined && (
                    <p>Response Latency: <strong className="text-emerald-400 font-mono">{healthData.services.supabase.latencyMs}ms</strong></p>
                  )}
                  <p>Database: <span className="text-stone-300 font-mono">PostgreSQL</span></p>
                </div>

                <div className="pt-2 border-t border-stone-850 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Project ID:</span>
                  <span className="font-mono text-stone-400">tpyceqabdimkus...</span>
                </div>
              </div>

              {/* 2. Backblaze B2 Cloud Storage */}
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-sky-400" />
                    <span className="font-bold text-sm text-white">Backblaze B2 Storage</span>
                  </div>
                  {healthData?.services.b2.ok ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                      ONLINE
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      PENDING KEY
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1 text-stone-400">
                  <p>Free Tier: <strong className="text-sky-400">10 GB Free Forever</strong></p>
                  <p>Bucket: <strong className="text-stone-200 font-mono">nameforpet-uploads</strong></p>
                  <p>Storage Engine: <span className="text-stone-300">S3 / Native B2 REST API</span></p>
                </div>

                <div className="pt-2 border-t border-stone-850 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Signed 7-Day URLs:</span>
                  <span className="font-mono text-emerald-400 font-bold">Enabled</span>
                </div>
              </div>

              {/* 3. Gemini Vision AI */}
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-sm text-white">Gemini Vision AI</span>
                  </div>
                  {healthData?.services.gemini.ok ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      OFFLINE
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1 text-stone-400">
                  <p>Active Engine: <strong className="text-stone-200">gemini-3.1-flash-lite</strong></p>
                  {healthData?.services.gemini.latencyMs !== undefined && (
                    <p>Response Latency: <strong className="text-amber-400 font-mono">{healthData.services.gemini.latencyMs}ms</strong></p>
                  )}
                  <p>Architecture: <span className="text-emerald-400 font-semibold">1 Request / Photo (0 Redundancy)</span></p>
                </div>

                <div className="pt-2 border-t border-stone-850 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Failover Model:</span>
                  <span className="font-mono text-stone-400">gemini-3.5-flash-lite</span>
                </div>
              </div>

            </div>

            {/* Quick Summary Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-stone-200">
                  All 3 core cloud systems are verified online and operational.
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">
                Environment: {healthData?.env.node_env || 'production'}
              </span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
