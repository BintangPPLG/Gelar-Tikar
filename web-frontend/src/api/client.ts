const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
}

export interface Artist {
  id: number;
  name: string;
  genre: string;
  bio?: string;
  image_url?: string;
  spotify_url?: string;
  instagram_url?: string;
}

export interface TicketTier {
  id: number;
  event_id: number;
  name: string;
  price: number;
  total_quota: number;
  sold_count: number;
  description?: string;
  perks_json?: string[] | string;
  status: 'active' | 'closed' | 'sold_out';
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  banner_url: string;
  venue_name: string;
  venue_address: string;
  event_date: string;
  end_date?: string;
  status: 'draft' | 'open' | 'closed' | 'sold_out';
  ticket_tiers?: TicketTier[];
  artists?: Artist[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  ticket_tier_id: number;
  tier_name?: string;
  ticket_code: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Payment {
  id: number;
  order_id: number;
  payment_method: 'qris' | 'virtual_account' | 'bank_transfer' | 'credit_card';
  payment_reference?: string;
  amount: number;
  proof_image_url?: string;
  status: 'pending' | 'verified' | 'rejected';
  payment_time?: string;
  verified_at?: string;
}

export interface Order {
  id: number;
  order_code: string;
  user_id?: number | null;
  event_id: number;
  event_title?: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_id_card?: string;
  status: 'pending' | 'paid' | 'rejected' | 'cancelled';
  created_at: string;
  items?: OrderItem[];
  payment?: Payment;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  totalTicketsSold: number;
  totalQuota: number;
  activeEventsCount: number;
  recentOrders: Order[];
  ticketTiers: TicketTier[];
}

// Request Helper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('aurora_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// API Service
export const api = {
  // Auth
  auth: {
    register: (userData: { name: string; email: string; password: string; phone?: string }) =>
      request<{ success: boolean; message: string; token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    login: (credentials: { email: string; password: string }) =>
      request<{ success: boolean; message: string; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    me: () => request<{ success: boolean; user: User }>('/auth/me'),
  },

  // Events
  events: {
    getAll: () => request<{ success: boolean; data: Event[] }>('/events'),
    getById: (idOrSlug: string | number) => request<{ success: boolean; data: Event }>(`/events/${idOrSlug}`),
    create: (data: Partial<Event>) =>
      request<{ success: boolean; message: string; data: Event }>('/events', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    toggleSales: (id: number, status: 'open' | 'closed' | 'sold_out') =>
      request<{ success: boolean; message: string; data: Event }>(`/events/${id}/toggle-sales`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Tickets
  tickets: {
    getAll: (eventId?: number) =>
      request<{ success: boolean; data: TicketTier[] }>(eventId ? `/tickets?event_id=${eventId}` : '/tickets'),
    create: (data: Partial<TicketTier>) =>
      request<{ success: boolean; message: string; data: TicketTier }>('/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<TicketTier>) =>
      request<{ success: boolean; message: string; data: TicketTier }>(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ success: boolean; message: string }>(`/tickets/${id}`, {
        method: 'DELETE',
      }),
  },

  // Orders
  orders: {
    create: (orderData: {
      event_id: number;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      customer_id_card?: string;
      tier_id: number;
      quantity: number;
      payment_method: string;
    }) =>
      request<{ success: boolean; message: string; data: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    getMyOrders: (email?: string) =>
      request<{ success: boolean; data: Order[] }>(email ? `/orders?email=${encodeURIComponent(email)}` : '/orders'),
    getByCode: (code: string) => request<{ success: boolean; data: Order }>(`/orders/${code}`),
  },

  // Artists
  artists: {
    getAll: () => request<{ success: boolean; data: Artist[] }>('/artists'),
    create: (data: Partial<Artist>) =>
      request<{ success: boolean; message: string; data: Artist }>('/artists', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Artist>) =>
      request<{ success: boolean; message: string; data: Artist }>(`/artists/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ success: boolean; message: string }>(`/artists/${id}`, {
        method: 'DELETE',
      }),
  },

  // Admin Control Center
  admin: {
    getDashboard: () => request<{ success: boolean; data: DashboardMetrics }>('/admin/dashboard'),
    getAllOrders: () => request<{ success: boolean; data: Order[] }>('/admin/orders'),
    verifyOrder: (id: number, status: 'verified' | 'rejected') =>
      request<{ success: boolean; message: string; data: Order }>(`/admin/orders/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
};
