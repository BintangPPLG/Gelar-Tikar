// Repository data Gelar Tikar.
// Saat server menyala, db.ts mengecek MySQL. Bila tersambung, semua data dibaca/ditulis ke MySQL.
// Bila tidak, dipakai data contoh di memori (seed.ts) supaya web tetap bisa didemokan.
import { query, getConnection, isDbReady } from '../config/db.js';
import { seedUsers, seedArtists, seedEvents, seedLineup, seedTiers, seedOrders } from './seed.js';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'admin' | 'customer';
  created_at?: string;
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

export interface LineupSlot {
  id: number;
  event_id: number;
  artist_id: number;
  stage_name: string;
  performance_time: string;
  day_number: number;
  artist_name?: string;
  genre?: string;
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
  lineup?: LineupSlot[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  ticket_tier_id: number;
  tier_name?: string;
  /** Hari berlaku tiket, diambil dari fasilitas kategori yang diawali "Berlaku". */
  valid_for?: string;
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
  venue_name?: string;
  event_date?: string;
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

export interface NewOrderInput {
  user_id: number | null;
  event_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_id_card?: string;
  tier_id: number;
  quantity: number;
  payment_method: Payment['payment_method'];
}

/** Biaya layanan per pesanan (bukan per tiket). */
export const SERVICE_FEE = 10000;
/** Maksimal tiket per pesanan. */
export const MAX_PER_ORDER = 4;

// ---------- Data memori (dipakai bila MySQL tidak tersambung) ----------
const mem = {
  users: structuredClone(seedUsers),
  artists: structuredClone(seedArtists),
  events: structuredClone(seedEvents),
  lineup: structuredClone(seedLineup),
  tiers: structuredClone(seedTiers),
  orders: structuredClone(seedOrders),
};
const nextId = (rows: { id: number }[]) => rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;

// ---------- Helper ----------
const db = () => isDbReady();

function normTier(t: any): TicketTier {
  let perks = t.perks_json;
  if (typeof perks === 'string') {
    try { perks = JSON.parse(perks); } catch { perks = []; }
  }
  return { ...t, price: Number(t.price), total_quota: Number(t.total_quota), sold_count: Number(t.sold_count), perks_json: perks || [] };
}

function validFor(perks: unknown): string | undefined {
  const list = Array.isArray(perks) ? perks : [];
  const hit = list.find((p) => typeof p === 'string' && /^berlaku/i.test(p));
  return hit ? hit.replace(/^berlaku\s*/i, '') : undefined;
}

function normOrder(o: any): Order {
  return { ...o, total_amount: Number(o.total_amount) };
}

function randomCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function cityCode(title: string) {
  const t = title.toLowerCase();
  if (t.includes('jakarta')) return 'JKT';
  if (t.includes('bandung')) return 'BDG';
  if (t.includes('yogya')) return 'YK';
  if (t.includes('surabaya')) return 'SBY';
  return 'GT';
}

function paymentReference(method: Payment['payment_method'], phone: string, code: string) {
  if (method === 'virtual_account') {
    const digits = (phone.replace(/\D/g, '') + '00000000').slice(0, 8);
    return `8808 ${digits.slice(0, 4)} ${digits.slice(4, 8)} ${String(Math.floor(1000 + Math.random() * 9000))}`;
  }
  return `QRIS-${code}`;
}

export class OrderError extends Error {}

export const dbRepository = {
  // ===== USERS =====
  async getUserByEmail(email: string): Promise<User | null> {
    if (db()) {
      const rows = await query<User>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      return rows[0] || null;
    }
    return mem.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserById(id: number): Promise<User | null> {
    if (db()) {
      const rows = await query<User>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      return rows[0] || null;
    }
    return mem.users.find((u) => u.id === id) || null;
  },

  async createUser(data: Omit<User, 'id'>): Promise<User> {
    if (db()) {
      const r: any = await query('INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)', [
        data.name, data.email, data.password, data.phone || null, data.role || 'customer',
      ]);
      return { id: r.insertId, ...data };
    }
    const user: User = { id: nextId(mem.users), ...data, created_at: new Date().toISOString() };
    mem.users.push(user);
    return user;
  },

  // ===== EVENTS =====
  async getLineup(eventId?: number): Promise<LineupSlot[]> {
    if (db()) {
      const rows = await query<LineupSlot>(
        `SELECT ea.*, a.name AS artist_name, a.genre
         FROM event_artists ea JOIN artists a ON a.id = ea.artist_id
         ${eventId ? 'WHERE ea.event_id = ?' : ''}
         ORDER BY ea.event_id, ea.day_number, ea.performance_time`,
        eventId ? [eventId] : []
      );
      return rows;
    }
    return mem.lineup
      .filter((l) => !eventId || l.event_id === eventId)
      .map((l) => {
        const a = mem.artists.find((x) => x.id === l.artist_id);
        return { ...l, artist_name: a?.name || '?', genre: a?.genre || '' };
      })
      .sort((a, b) => a.event_id - b.event_id || a.day_number - b.day_number || a.performance_time.localeCompare(b.performance_time));
  },

  async getAllEvents(): Promise<Event[]> {
    const events = db()
      ? await query<Event>('SELECT * FROM events ORDER BY event_date ASC')
      : [...mem.events].sort((a, b) => a.event_date.localeCompare(b.event_date));
    const tiers = await this.getAllTiers();
    const lineup = await this.getLineup();
    return events.map((e) => ({
      ...e,
      ticket_tiers: tiers.filter((t) => t.event_id === e.id),
      lineup: lineup.filter((l) => l.event_id === e.id),
    }));
  },

  async getEventByIdOrSlug(idOrSlug: string | number): Promise<Event | null> {
    const isNum = !isNaN(Number(idOrSlug));
    let ev: Event | undefined;
    if (db()) {
      const rows = await query<Event>(isNum ? 'SELECT * FROM events WHERE id = ?' : 'SELECT * FROM events WHERE slug = ?', [idOrSlug]);
      ev = rows[0];
    } else {
      ev = mem.events.find((e) => (isNum ? e.id === Number(idOrSlug) : e.slug === idOrSlug));
    }
    if (!ev) return null;
    return { ...ev, ticket_tiers: await this.getTiersByEventId(ev.id), lineup: await this.getLineup(ev.id) };
  },

  async createEvent(data: Omit<Event, 'id'>): Promise<Event> {
    if (db()) {
      const r: any = await query(
        'INSERT INTO events (title, slug, description, banner_url, venue_name, venue_address, event_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [data.title, data.slug, data.description || '', data.banner_url || '', data.venue_name, data.venue_address || '', new Date(data.event_date), data.end_date ? new Date(data.end_date) : null, data.status || 'open']
      );
      return { id: r.insertId, ...data };
    }
    const ev: Event = { id: nextId(mem.events), ...data, status: data.status || 'open' };
    mem.events.push(ev);
    return ev;
  },

  async updateEvent(id: number, u: Partial<Event>): Promise<Event | null> {
    if (db()) {
      await query(
        'UPDATE events SET title = COALESCE(?, title), description = COALESCE(?, description), venue_name = COALESCE(?, venue_name), status = COALESCE(?, status) WHERE id = ?',
        [u.title ?? null, u.description ?? null, u.venue_name ?? null, u.status ?? null, id]
      );
      return this.getEventByIdOrSlug(id);
    }
    const i = mem.events.findIndex((e) => e.id === id);
    if (i === -1) return null;
    mem.events[i] = { ...mem.events[i], ...u, id };
    return mem.events[i];
  },

  async deleteEvent(id: number): Promise<boolean> {
    if (db()) {
      await query('DELETE FROM events WHERE id = ?', [id]);
      return true;
    }
    mem.events = mem.events.filter((e) => e.id !== id);
    return true;
  },

  // ===== ARTISTS =====
  async getAllArtists(): Promise<Artist[]> {
    if (db()) return query<Artist>('SELECT * FROM artists ORDER BY name ASC');
    return [...mem.artists].sort((a, b) => a.name.localeCompare(b.name));
  },

  async createArtist(data: Omit<Artist, 'id'>): Promise<Artist> {
    if (db()) {
      const r: any = await query('INSERT INTO artists (name, genre, bio, image_url, spotify_url, instagram_url) VALUES (?, ?, ?, ?, ?, ?)', [
        data.name, data.genre, data.bio || null, data.image_url || null, data.spotify_url || null, data.instagram_url || null,
      ]);
      return { id: r.insertId, ...data };
    }
    const a: Artist = { id: nextId(mem.artists), ...data };
    mem.artists.push(a);
    return a;
  },

  async updateArtist(id: number, u: Partial<Artist>): Promise<Artist | null> {
    if (db()) {
      await query('UPDATE artists SET name = COALESCE(?, name), genre = COALESCE(?, genre), bio = COALESCE(?, bio) WHERE id = ?', [
        u.name ?? null, u.genre ?? null, u.bio ?? null, id,
      ]);
      const rows = await query<Artist>('SELECT * FROM artists WHERE id = ?', [id]);
      return rows[0] || null;
    }
    const i = mem.artists.findIndex((a) => a.id === id);
    if (i === -1) return null;
    mem.artists[i] = { ...mem.artists[i], ...u, id };
    return mem.artists[i];
  },

  async deleteArtist(id: number): Promise<boolean> {
    if (db()) {
      await query('DELETE FROM artists WHERE id = ?', [id]);
      return true;
    }
    mem.artists = mem.artists.filter((a) => a.id !== id);
    mem.lineup = mem.lineup.filter((l) => l.artist_id !== id);
    return true;
  },

  // ===== TICKET TIERS =====
  async getTiersByEventId(eventId: number): Promise<TicketTier[]> {
    if (db()) return (await query('SELECT * FROM ticket_tiers WHERE event_id = ? ORDER BY price ASC', [eventId])).map(normTier);
    return mem.tiers.filter((t) => t.event_id === eventId).sort((a, b) => a.price - b.price);
  },

  async getAllTiers(): Promise<TicketTier[]> {
    if (db()) return (await query('SELECT * FROM ticket_tiers ORDER BY event_id ASC, price ASC')).map(normTier);
    return [...mem.tiers].sort((a, b) => a.event_id - b.event_id || a.price - b.price);
  },

  async createTier(data: Omit<TicketTier, 'id' | 'sold_count'>): Promise<TicketTier> {
    const perks = Array.isArray(data.perks_json) ? data.perks_json : [];
    if (db()) {
      const r: any = await query(
        'INSERT INTO ticket_tiers (event_id, name, price, total_quota, description, perks_json, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [data.event_id, data.name, data.price, data.total_quota, data.description || null, JSON.stringify(perks), data.status || 'active']
      );
      return { id: r.insertId, sold_count: 0, ...data, perks_json: perks };
    }
    const t: TicketTier = { id: nextId(mem.tiers), sold_count: 0, ...data, perks_json: perks };
    mem.tiers.push(t);
    return t;
  },

  async updateTier(id: number, u: Partial<TicketTier>): Promise<TicketTier | null> {
    if (db()) {
      await query(
        'UPDATE ticket_tiers SET name = COALESCE(?, name), price = COALESCE(?, price), total_quota = COALESCE(?, total_quota), status = COALESCE(?, status) WHERE id = ?',
        [u.name ?? null, u.price ?? null, u.total_quota ?? null, u.status ?? null, id]
      );
      const rows = await query('SELECT * FROM ticket_tiers WHERE id = ?', [id]);
      return rows[0] ? normTier(rows[0]) : null;
    }
    const i = mem.tiers.findIndex((t) => t.id === id);
    if (i === -1) return null;
    mem.tiers[i] = { ...mem.tiers[i], ...u, id };
    return mem.tiers[i];
  },

  async deleteTier(id: number): Promise<boolean> {
    if (db()) {
      // Kategori yang sudah dipesan tidak boleh dihapus (order_items memakai ON DELETE RESTRICT).
      const used = await query('SELECT 1 FROM order_items WHERE ticket_tier_id = ? LIMIT 1', [id]);
      if (used.length) throw new OrderError('Kategori ini sudah pernah dipesan. Tutup penjualannya saja.');
      await query('DELETE FROM ticket_tiers WHERE id = ?', [id]);
      return true;
    }
    if (mem.orders.some((o) => o.items?.some((it) => it.ticket_tier_id === id))) {
      throw new OrderError('Kategori ini sudah pernah dipesan. Tutup penjualannya saja.');
    }
    mem.tiers = mem.tiers.filter((t) => t.id !== id);
    return true;
  },

  // ===== ORDERS =====
  async attachDetails(orders: Order[]): Promise<Order[]> {
    if (!orders.length) return [];
    if (!db()) {
      return orders.map((o) => {
        const ev = mem.events.find((e) => e.id === o.event_id);
        const items = (o.items || []).map((it) => ({ ...it, valid_for: validFor(mem.tiers.find((t) => t.id === it.ticket_tier_id)?.perks_json) }));
        return { ...o, items, event_title: ev?.title, venue_name: ev?.venue_name, event_date: ev?.event_date };
      });
    }
    const ids = orders.map((o) => o.id);
    const ph = ids.map(() => '?').join(',');
    const items = await query<any>(
      `SELECT oi.*, t.name AS tier_name, t.perks_json AS tier_perks FROM order_items oi JOIN ticket_tiers t ON t.id = oi.ticket_tier_id WHERE oi.order_id IN (${ph})`,
      ids
    );
    const pays = await query<any>(`SELECT * FROM payments WHERE order_id IN (${ph})`, ids);
    return orders.map((o) => ({
      ...normOrder(o),
      items: items
        .filter((i) => i.order_id === o.id)
        .map(({ tier_perks, ...i }) => ({ ...i, unit_price: Number(i.unit_price), subtotal: Number(i.subtotal), valid_for: validFor(normTier({ perks_json: tier_perks }).perks_json) })),
      payment: (() => {
        const p = pays.find((x) => x.order_id === o.id);
        return p ? { ...p, amount: Number(p.amount) } : undefined;
      })(),
    }));
  },

  async getAllOrders(): Promise<Order[]> {
    if (db()) {
      const rows = await query<Order>(
        `SELECT o.*, e.title AS event_title, e.venue_name, e.event_date
         FROM orders o LEFT JOIN events e ON o.event_id = e.id ORDER BY o.created_at DESC, o.id DESC`
      );
      return this.attachDetails(rows);
    }
    return this.attachDetails([...mem.orders].sort((a, b) => b.created_at.localeCompare(a.created_at)));
  },

  async getOrdersByUserOrEmail(userId: number | null, email: string): Promise<Order[]> {
    if (db()) {
      const rows = await query<Order>(
        `SELECT o.*, e.title AS event_title, e.venue_name, e.event_date
         FROM orders o LEFT JOIN events e ON o.event_id = e.id
         WHERE o.user_id = ? OR o.customer_email = ? ORDER BY o.created_at DESC, o.id DESC`,
        [userId ?? 0, email]
      );
      return this.attachDetails(rows);
    }
    const list = mem.orders
      .filter((o) => (userId && o.user_id === userId) || o.customer_email.toLowerCase() === email.toLowerCase())
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return this.attachDetails(list);
  },

  async getOrderByCode(code: string): Promise<Order | null> {
    if (db()) {
      const rows = await query<Order>(
        `SELECT o.*, e.title AS event_title, e.venue_name, e.event_date
         FROM orders o LEFT JOIN events e ON o.event_id = e.id WHERE o.order_code = ? LIMIT 1`,
        [code]
      );
      return rows[0] ? (await this.attachDetails(rows))[0] : null;
    }
    const o = mem.orders.find((x) => x.order_code === code);
    return o ? (await this.attachDetails([o]))[0] : null;
  },

  /**
   * Membuat pesanan. Kuota langsung dipesan (sold_count bertambah) supaya tidak terjual melebihi kuota;
   * bila admin menolak pembayaran, kuota dikembalikan.
   */
  async createOrder(input: NewOrderInput): Promise<Order> {
    const qty = Math.floor(input.quantity);
    if (!(qty >= 1 && qty <= MAX_PER_ORDER)) throw new OrderError(`Jumlah tiket harus 1 sampai ${MAX_PER_ORDER} per pesanan.`);

    const code = `GT-${randomCode()}`;

    if (db()) {
      const conn = await getConnection();
      try {
        await conn.beginTransaction();
        const [evRows]: any = await conn.execute('SELECT * FROM events WHERE id = ?', [input.event_id]);
        const ev = evRows[0];
        if (!ev) throw new OrderError('Acara tidak ditemukan.');
        if (ev.status !== 'open') throw new OrderError('Penjualan tiket acara ini sedang ditutup.');

        // Kunci baris kategori supaya dua pembeli tidak mengambil sisa kuota yang sama.
        const [tRows]: any = await conn.execute('SELECT * FROM ticket_tiers WHERE id = ? FOR UPDATE', [input.tier_id]);
        const tier = tRows[0] ? normTier(tRows[0]) : null;
        if (!tier || tier.event_id !== ev.id) throw new OrderError('Kategori tiket tidak ditemukan untuk acara ini.');
        if (tier.status !== 'active') throw new OrderError('Kategori tiket ini sudah tidak dijual.');
        const left = tier.total_quota - tier.sold_count;
        if (qty > left) throw new OrderError(left > 0 ? `Sisa kuota hanya ${left} tiket.` : 'Kuota kategori ini sudah habis.');

        const subtotal = tier.price * qty;
        const total = subtotal + SERVICE_FEE;
        const [oRes]: any = await conn.execute(
          `INSERT INTO orders (order_code, user_id, event_id, total_amount, customer_name, customer_email, customer_phone, customer_id_card, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
          [code, input.user_id, ev.id, total, input.customer_name, input.customer_email, input.customer_phone, input.customer_id_card || null]
        );
        const orderId = oRes.insertId;
        await conn.execute(
          'INSERT INTO order_items (order_id, ticket_tier_id, ticket_code, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
          [orderId, tier.id, `GT-${cityCode(ev.title)}-${code.slice(3)}-1`, qty, tier.price, subtotal]
        );
        await conn.execute(
          "INSERT INTO payments (order_id, payment_method, payment_reference, amount, status) VALUES (?, ?, ?, ?, 'pending')",
          [orderId, input.payment_method, paymentReference(input.payment_method, input.customer_phone, code.slice(3)), total]
        );
        const newSold = tier.sold_count + qty;
        await conn.execute('UPDATE ticket_tiers SET sold_count = ?, status = ? WHERE id = ?', [
          newSold, newSold >= tier.total_quota ? 'sold_out' : tier.status, tier.id,
        ]);
        await conn.commit();
      } catch (e) {
        await conn.rollback();
        throw e;
      } finally {
        conn.release();
      }
      return (await this.getOrderByCode(code))!;
    }

    // Mode memori
    const ev = mem.events.find((e) => e.id === input.event_id);
    if (!ev) throw new OrderError('Acara tidak ditemukan.');
    if (ev.status !== 'open') throw new OrderError('Penjualan tiket acara ini sedang ditutup.');
    const tier = mem.tiers.find((t) => t.id === input.tier_id);
    if (!tier || tier.event_id !== ev.id) throw new OrderError('Kategori tiket tidak ditemukan untuk acara ini.');
    if (tier.status !== 'active') throw new OrderError('Kategori tiket ini sudah tidak dijual.');
    const left = tier.total_quota - tier.sold_count;
    if (qty > left) throw new OrderError(left > 0 ? `Sisa kuota hanya ${left} tiket.` : 'Kuota kategori ini sudah habis.');

    const id = nextId(mem.orders);
    const subtotal = tier.price * qty;
    const total = subtotal + SERVICE_FEE;
    const now = new Date().toISOString();
    const order: Order = {
      id,
      order_code: code,
      user_id: input.user_id,
      event_id: ev.id,
      total_amount: total,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      customer_id_card: input.customer_id_card,
      status: 'pending',
      created_at: now,
      items: [{ id: Date.now(), order_id: id, ticket_tier_id: tier.id, tier_name: tier.name, ticket_code: `GT-${cityCode(ev.title)}-${code.slice(3)}-1`, quantity: qty, unit_price: tier.price, subtotal }],
      payment: { id, order_id: id, payment_method: input.payment_method, payment_reference: paymentReference(input.payment_method, input.customer_phone, code.slice(3)), amount: total, status: 'pending', payment_time: now },
    };
    tier.sold_count += qty;
    if (tier.sold_count >= tier.total_quota) tier.status = 'sold_out';
    mem.orders.push(order);
    return (await this.attachDetails([order]))[0];
  },

  /**
   * Admin memverifikasi pembayaran. Hanya pesanan berstatus "pending" yang bisa diproses.
   * Disetujui → pesanan "paid" (e-tiket aktif). Ditolak → pesanan "rejected" dan kuota dikembalikan.
   */
  async verifyPayment(orderId: number, decision: 'verified' | 'rejected', adminId?: number): Promise<Order | null> {
    if (db()) {
      const conn = await getConnection();
      let code = '';
      try {
        await conn.beginTransaction();
        const [oRows]: any = await conn.execute('SELECT * FROM orders WHERE id = ? FOR UPDATE', [orderId]);
        const order = oRows[0];
        if (!order) {
          await conn.rollback();
          return null;
        }
        if (order.status !== 'pending') throw new OrderError('Pesanan ini sudah diproses sebelumnya.');
        code = order.order_code;
        await conn.execute('UPDATE orders SET status = ? WHERE id = ?', [decision === 'verified' ? 'paid' : 'rejected', orderId]);
        await conn.execute('UPDATE payments SET status = ?, verified_at = NOW(), verified_by = ? WHERE order_id = ?', [decision, adminId ?? null, orderId]);
        if (decision === 'rejected') {
          const [items]: any = await conn.execute('SELECT ticket_tier_id, quantity FROM order_items WHERE order_id = ?', [orderId]);
          for (const it of items) {
            await conn.execute(
              "UPDATE ticket_tiers SET sold_count = GREATEST(sold_count - ?, 0), status = IF(status = 'sold_out', 'active', status) WHERE id = ?",
              [it.quantity, it.ticket_tier_id]
            );
          }
        }
        await conn.commit();
      } catch (e) {
        await conn.rollback();
        throw e;
      } finally {
        conn.release();
      }
      return this.getOrderByCode(code);
    }

    const order = mem.orders.find((o) => o.id === orderId);
    if (!order) return null;
    if (order.status !== 'pending') throw new OrderError('Pesanan ini sudah diproses sebelumnya.');
    order.status = decision === 'verified' ? 'paid' : 'rejected';
    if (order.payment) {
      order.payment.status = decision;
      order.payment.verified_at = new Date().toISOString();
    }
    if (decision === 'rejected') {
      for (const it of order.items || []) {
        const t = mem.tiers.find((x) => x.id === it.ticket_tier_id);
        if (t) {
          t.sold_count = Math.max(0, t.sold_count - it.quantity);
          if (t.status === 'sold_out') t.status = 'active';
        }
      }
    }
    return (await this.attachDetails([order]))[0];
  },

  // ===== RINGKASAN ADMIN =====
  async getDashboardMetrics() {
    const orders = await this.getAllOrders();
    const tiers = await this.getAllTiers();
    const events = db() ? await query<Event>('SELECT * FROM events') : mem.events;
    const paid = orders.filter((o) => o.status === 'paid');
    const ticketsIn = (list: Order[]) => list.reduce((s, o) => s + (o.items || []).reduce((x, i) => x + Number(i.quantity), 0), 0);
    return {
      totalRevenue: paid.reduce((s, o) => s + Number(o.total_amount), 0),
      totalOrders: orders.length,
      paidOrdersCount: paid.length,
      pendingOrdersCount: orders.filter((o) => o.status === 'pending').length,
      rejectedOrdersCount: orders.filter((o) => o.status === 'rejected').length,
      ticketsPaidThroughWeb: ticketsIn(paid),
      totalTicketsSold: tiers.reduce((s, t) => s + t.sold_count, 0),
      totalQuota: tiers.reduce((s, t) => s + t.total_quota, 0),
      activeEventsCount: events.filter((e) => e.status === 'open').length,
      recentOrders: orders.slice(0, 10),
      ticketTiers: tiers,
      storage: db() ? 'mysql' : 'memory',
    };
  },
};
