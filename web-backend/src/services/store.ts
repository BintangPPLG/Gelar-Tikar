import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';

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
  created_at?: string;
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
  created_at?: string;
  ticket_tiers?: TicketTier[];
  artists?: Artist[];
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

// Global In-Memory Fallback State (synced with schema.sql seeders)
let mockUsers: User[] = [
  {
    id: 1,
    name: 'Administrator Aurora',
    email: 'admin@aurorapulse.com',
    password: bcrypt.hashSync('AdminAurora2026!', 10),
    phone: '081122334455',
    role: 'admin',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Raditya Pratama',
    email: 'customer@gmail.com',
    password: bcrypt.hashSync('User12345!', 10),
    phone: '081234567890',
    role: 'customer',
    created_at: new Date().toISOString(),
  },
];

let mockArtists: Artist[] = [
  {
    id: 1,
    name: 'Cyber Nexus',
    genre: 'Progressive Synthwave / Electro',
    bio: 'Produser musik elektronik pelopor tata suara spatial 360 audio dari Amsterdam.',
    image_url: '/assets/artist_headliner.jpg',
    spotify_url: 'https://spotify.com',
    instagram_url: 'https://instagram.com',
  },
  {
    id: 2,
    name: 'Stella Vortex',
    genre: 'Melodic Techno & Live Vocals',
    bio: 'Vokalis & DJ dengan performa visual panggung interaktif pemenang Grammy nominee.',
    image_url: '/assets/festival_atmosphere.jpg',
    spotify_url: 'https://spotify.com',
    instagram_url: 'https://instagram.com',
  },
  {
    id: 3,
    name: 'Kinetic Pulse',
    genre: 'Modular Synth Live Ensemble',
    bio: 'Duo komposer modular synth dengan pertunjukan live laser multi-dimensi.',
    image_url: '/assets/hero_stage.jpg',
    spotify_url: 'https://spotify.com',
    instagram_url: 'https://instagram.com',
  },
  {
    id: 4,
    name: 'Hyperion Echo',
    genre: 'Future Bass / Cinematic',
    bio: 'Produser musik bass melodis nomor satu dengan 500M+ total streaming global.',
    image_url: '/assets/artist_headliner.jpg',
    spotify_url: 'https://spotify.com',
    instagram_url: 'https://instagram.com',
  },
];

let mockEvents: Event[] = [
  {
    id: 1,
    title: 'AURORA PULSE: WORLD TOUR 2026',
    slug: 'aurora-pulse-world-tour-2026',
    description: 'Festival musik audio visual 360 spatial sound termegah di Asia Tenggara dengan 40+ artis dunia, laser show 64 unit, dan panggung multi-dimensi.',
    banner_url: '/assets/hero_stage.jpg',
    venue_name: 'Stadion Madya Gelora Bung Karno',
    venue_address: 'Jl. Gerbang Pemuda No.3, Gelora, Tanah Abang, Jakarta Pusat 10270',
    event_date: '2026-10-18T16:00:00Z',
    end_date: '2026-10-20T23:30:00Z',
    status: 'open',
  },
  {
    id: 2,
    title: 'BALI SUNSET SOUNDSCAPE 2026',
    slug: 'bali-sunset-soundscape-2026',
    description: 'Konser intim tepi pantai dengan aransemen ambient house, live orchestra sunset session, dan culinary art festival.',
    banner_url: '/assets/festival_atmosphere.jpg',
    venue_name: 'GWK Cultural Park & Lotus Pond',
    venue_address: 'Jl. Raya Uluwatu, Ungasan, Kuta Selatan, Badung, Bali 80364',
    event_date: '2026-11-28T15:00:00Z',
    end_date: '2026-11-29T23:00:00Z',
    status: 'open',
  },
  {
    id: 3,
    title: 'NEON TOKYO CYBER RAVE 2026',
    slug: 'neon-tokyo-cyber-rave-2026',
    description: 'Eksplorasi musik electronic & future rave berkonsep cyberpunk dengan panggung hologram 3D dan tata cahaya laser multi-spektrum.',
    banner_url: '/assets/artist_headliner.jpg',
    venue_name: 'PIK 2 International Convention & Arena',
    venue_address: 'Kawasan Pantai Indah Kapuk 2, Tangerang, Banten 15510',
    event_date: '2026-12-12T17:00:00Z',
    end_date: '2026-12-13T03:00:00Z',
    status: 'open',
  },
  {
    id: 4,
    title: 'JAVA JAZZ & ELECTRO FUSION 2026',
    slug: 'java-jazz-electro-fusion-2026',
    description: 'Kolaborasi magis musisi jazz legendaris berpadu modulasi electronic synth modern di bawah hawa sejuk kota Bandung.',
    banner_url: '/assets/festival_atmosphere.jpg',
    venue_name: 'Eldorado Dome & Amphitheater',
    venue_address: 'Jl. Dr. Setiabudi No.438, Isola, Sukasari, Kota Bandung 40154',
    event_date: '2026-12-31T18:00:00Z',
    end_date: '2027-01-01T01:30:00Z',
    status: 'open',
  },
  {
    id: 5,
    title: 'SURABAYA ROCK SYMPHONY 2026',
    slug: 'surabaya-rock-symphony-2026',
    description: 'Distorsi rock spektakuler berbalut orkestrasi simfoni megah 60-piece orchestra membawakan anthem legendaris sepanjang masa.',
    banner_url: '/assets/hero_stage.jpg',
    venue_name: 'Grand City Convention & Exhibition',
    venue_address: 'Jl. Walikota Mustajab No.1, Ketabang, Genteng, Kota Surabaya 60272',
    event_date: '2027-01-16T19:00:00Z',
    end_date: '2027-01-16T23:30:00Z',
    status: 'open',
  },
];

let mockTicketTiers: TicketTier[] = [
  // Event 1: Aurora Pulse Jakarta
  {
    id: 1,
    event_id: 1,
    name: 'VIP Cosmic Holographic Pass',
    price: 2850000,
    total_quota: 150,
    sold_count: 65,
    description: 'Akses baris terdepan dengan fasilitas lounge eksklusif dan merchandise resmi festival.',
    perks_json: ['Akses Baris Paling Depan Main Stage', 'Fast-Track VIP Entrance', 'Akses VIP AC Lounge & Free Flow Drink', 'Official Limited Boxset Merch', 'Akses Soundcheck Artis'],
    status: 'active',
  },
  {
    id: 2,
    event_id: 1,
    name: 'CAT 1 Front Standing',
    price: 1650000,
    total_quota: 800,
    sold_count: 520,
    description: 'Pengalaman festival terbaik di area berdiri dengan akustik 360 spatial audio paling bertenaga.',
    perks_json: ['Area Berdiri di Belakang VIP', 'Akses 3 Panggung Festival', 'Sound Stage 360 Spatial Sweetspot', 'Smart RFID LED Wristband'],
    status: 'active',
  },
  {
    id: 3,
    event_id: 1,
    name: 'CAT 2 Tribune Seating',
    price: 950000,
    total_quota: 1200,
    sold_count: 310,
    description: 'Kenyamanan tempat duduk bernomor di tribun beratap dengan pandangan menyeluruh panggung.',
    perks_json: ['Nomor Kursi Tetap Berkanopi', 'Pandangan Penuh Efek Laser', 'Akses Toilet & F&B Khusus Tribun', 'Smart RFID LED Wristband'],
    status: 'active',
  },
  {
    id: 4,
    event_id: 1,
    name: '3-Day All-Access Pass',
    price: 4200000,
    total_quota: 300,
    sold_count: 190,
    description: 'Tiket terusan 3 hari penuh untuk menyaksikan seluruh 40+ artis dan pesta kembang api penutupan.',
    perks_json: ['Akses Terusan 3 Hari Penuh', 'Fast-Track Entrance Tiap Hari', 'Akses After-Party Penutupan', 'RFID Commemorative Metal Band'],
    status: 'active',
  },

  // Event 2: Bali Sunset Soundscape
  {
    id: 5,
    event_id: 2,
    name: 'Sunset Beach Club VIP Bed Pass',
    price: 3200000,
    total_quota: 80,
    sold_count: 42,
    description: 'Daybed privat pinggir tebing GWK termasuk welcome cocktails dan canapés eksklusif.',
    perks_json: ['Private Daybed Lounge (Up to 2 Pax)', 'Welcome Artisan Cocktail & Canapés', 'Priority Parking & Buggy Shuttle', 'Sunset Photo Session Pass'],
    status: 'active',
  },
  {
    id: 6,
    event_id: 2,
    name: 'Lotus General Admission',
    price: 1250000,
    total_quota: 1500,
    sold_count: 890,
    description: 'Akses bebas area amfiteater taman budaya GWK dan zona seni instalasi malam.',
    perks_json: ['Akses Sunset Amphitheater', 'Akses Culinary Arts Zone', 'Free Eco Bamboo Straw & Drink Voucher'],
    status: 'active',
  },
  {
    id: 7,
    event_id: 2,
    name: '2-Day Sunset Weekend Pass',
    price: 2100000,
    total_quota: 500,
    sold_count: 320,
    description: 'Tiket terusan akhir pekan 2 hari penuh termasuk sesi yoga akustik pagi hari.',
    perks_json: ['Akses 2 Hari Weekend Penuh', 'Morning Acoustic Yoga Session', 'Merchandise Festival Bag'],
    status: 'active',
  },

  // Event 3: Neon Tokyo Cyber Rave (PIK 2)
  {
    id: 8,
    event_id: 3,
    name: 'Cyber Rave Mainstage GA',
    price: 850000,
    total_quota: 2000,
    sold_count: 1150,
    description: 'Akses penuh dance floor laser arena dengan tata audio 120.000 watt.',
    perks_json: ['Akses Cyber Dancefloor', 'Neon LED Glow Glasses', 'RFID Access Band'],
    status: 'active',
  },
  {
    id: 9,
    event_id: 3,
    name: 'Hologram Deck VIP Pass',
    price: 1950000,
    total_quota: 200,
    sold_count: 140,
    description: 'Akses panggung dek bertingkat dengan pemandangan langsung ke set hologram artis.',
    perks_json: ['Elevated VIP Hologram Deck', 'Private Bar & Quick Queue', 'Complimentary Energy Glow Drink'],
    status: 'active',
  },

  // Event 4: Java Jazz Electro Fusion (Bandung)
  {
    id: 10,
    event_id: 4,
    name: 'Amphitheater Seating Pass',
    price: 750000,
    total_quota: 900,
    sold_count: 410,
    description: 'Tempat duduk berjenjang dengan akustik alami terbaik di Eldorado Dome Bandung.',
    perks_json: ['Reserved Seating Area', 'Akses Zona Kuliner Kopi Bandung', 'Festival Programme Booklet'],
    status: 'active',
  },
  {
    id: 11,
    event_id: 4,
    name: 'New Year Eve VIP Celebration Pass',
    price: 1850000,
    total_quota: 250,
    sold_count: 180,
    description: 'Paket countdown tahun baru eksklusif dengan gala dinner dan countdown toast.',
    perks_json: ['Front Row VIP Table', 'New Year Dinner Buffet & Toast', 'Meet & Greet Musisi Jazz'],
    status: 'active',
  },

  // Event 5: Surabaya Rock Symphony
  {
    id: 12,
    event_id: 5,
    name: 'Rock Pit Standing Pass',
    price: 650000,
    total_quota: 1200,
    sold_count: 730,
    description: 'Area berdiri tepat di depan panggung rock orchestra dengan atmosfer paling bertenaga.',
    perks_json: ['Akses Rock Pit Standing', 'Official Band & Orchestra Tour Pick Badge', 'Fast-Track Entrance'],
    status: 'active',
  },
  {
    id: 13,
    event_id: 5,
    name: 'Orchestra Platinum Hall Pass',
    price: 1450000,
    total_quota: 400,
    sold_count: 260,
    description: 'Tempat duduk platinum dengan sudut pandang dan perpaduan suara orkestra paling sempurna.',
    perks_json: ['Platinum Numbered Seating', 'Akses Platinum Lounge', 'Exclusive Vinyl Sleeve Souvenir'],
    status: 'active',
  },
];

let mockOrders: Order[] = [
  {
    id: 1,
    order_code: 'AP26-ORD-839102',
    user_id: 2,
    event_id: 1,
    event_title: 'AURORA PULSE: WORLD TOUR 2026',
    total_amount: 2875000,
    customer_name: 'Raditya Pratama',
    customer_email: 'customer@gmail.com',
    customer_phone: '081234567890',
    customer_id_card: '3171029384756102',
    status: 'paid',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    items: [
      {
        id: 1,
        order_id: 1,
        ticket_tier_id: 1,
        tier_name: 'VIP Cosmic Holographic Pass',
        ticket_code: 'TKT-AP26-VIP-839102',
        quantity: 1,
        unit_price: 2850000,
        subtotal: 2850000,
      },
    ],
    payment: {
      id: 1,
      order_id: 1,
      payment_method: 'qris',
      payment_reference: 'QRIS-NMID-98237419',
      amount: 2875000,
      status: 'verified',
      payment_time: new Date().toISOString(),
      verified_at: new Date().toISOString(),
    },
  },
  {
    id: 2,
    order_code: 'AP26-ORD-519284',
    user_id: null,
    event_id: 1,
    event_title: 'AURORA PULSE: WORLD TOUR 2026',
    total_amount: 1675000,
    customer_name: 'Siti Nurhaliza',
    customer_email: 'siti.nur@example.com',
    customer_phone: '085712349911',
    customer_id_card: '3201948572019283',
    status: 'pending',
    created_at: new Date().toISOString(),
    items: [
      {
        id: 2,
        order_id: 2,
        ticket_tier_id: 2,
        tier_name: 'CAT 1 Front Standing',
        ticket_code: 'TKT-AP26-CAT1-519284',
        quantity: 1,
        unit_price: 1650000,
        subtotal: 1650000,
      },
    ],
    payment: {
      id: 2,
      order_id: 2,
      payment_method: 'virtual_account',
      payment_reference: 'VA-BCA-8801928374619283',
      amount: 1675000,
      status: 'pending',
    },
  },
];

// REPOSITORY INTERACTION FUNCTIONS

export const dbRepository = {
  // --- USERS ---
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const rows = await query<User>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      if (rows && rows.length > 0) return rows[0];
    } catch {
      // fallback
    }
    return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserById(id: number): Promise<User | null> {
    try {
      const rows = await query<User>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      if (rows && rows.length > 0) return rows[0];
    } catch {
      // fallback
    }
    return mockUsers.find((u) => u.id === id) || null;
  },

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const result: any = await query(
        'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        [userData.name, userData.email, userData.password, userData.phone || null, userData.role || 'customer']
      );
      const inserted: User = { id: result.insertId, ...userData, created_at: new Date().toISOString() };
      mockUsers.push(inserted);
      return inserted;
    } catch {
      // fallback
    }
    const newUser: User = {
      id: mockUsers.length + 1,
      ...userData,
      created_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  // --- EVENTS ---
  async getAllEvents(): Promise<Event[]> {
    try {
      const rows = await query<Event>('SELECT * FROM events ORDER BY event_date ASC');
      if (rows && rows.length > 0) return rows;
    } catch {
      // fallback
    }
    return [...mockEvents];
  },

  async getEventByIdOrSlug(idOrSlug: string | number): Promise<Event | null> {
    try {
      const isNum = !isNaN(Number(idOrSlug));
      const sql = isNum ? 'SELECT * FROM events WHERE id = ?' : 'SELECT * FROM events WHERE slug = ?';
      const rows = await query<Event>(sql, [idOrSlug]);
      if (rows && rows.length > 0) {
        const ev = rows[0];
        const tiers = await this.getTiersByEventId(ev.id);
        return { ...ev, ticket_tiers: tiers };
      }
    } catch {
      // fallback
    }
    const ev = mockEvents.find((e) => e.id === Number(idOrSlug) || e.slug === idOrSlug);
    if (!ev) return null;
    const tiers = mockTicketTiers.filter((t) => t.event_id === ev.id);
    return { ...ev, ticket_tiers: tiers, artists: mockArtists };
  },

  async createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
    try {
      const result: any = await query(
        'INSERT INTO events (title, slug, description, banner_url, venue_name, venue_address, event_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          eventData.title,
          eventData.slug,
          eventData.description,
          eventData.banner_url,
          eventData.venue_name,
          eventData.venue_address,
          eventData.event_date,
          eventData.end_date || null,
          eventData.status || 'open',
        ]
      );
      const newEv: Event = { id: result.insertId, ...eventData, created_at: new Date().toISOString() };
      mockEvents.push(newEv);
      return newEv;
    } catch {
      // fallback
    }
    const newEvent: Event = {
      id: mockEvents.length + 1,
      ...eventData,
      created_at: new Date().toISOString(),
    };
    mockEvents.push(newEvent);
    return newEvent;
  },

  async updateEvent(id: number, updates: Partial<Event>): Promise<Event | null> {
    try {
      await query(
        'UPDATE events SET title = COALESCE(?, title), description = COALESCE(?, description), venue_name = COALESCE(?, venue_name), status = COALESCE(?, status) WHERE id = ?',
        [updates.title || null, updates.description || null, updates.venue_name || null, updates.status || null, id]
      );
    } catch {
      // fallback
    }
    const index = mockEvents.findIndex((e) => e.id === id);
    if (index === -1) return null;
    mockEvents[index] = { ...mockEvents[index], ...updates };
    return mockEvents[index];
  },

  async deleteEvent(id: number): Promise<boolean> {
    try {
      await query('DELETE FROM events WHERE id = ?', [id]);
    } catch {
      // fallback
    }
    mockEvents = mockEvents.filter((e) => e.id !== id);
    return true;
  },

  // --- ARTISTS ---
  async getAllArtists(): Promise<Artist[]> {
    try {
      const rows = await query<Artist>('SELECT * FROM artists ORDER BY id ASC');
      if (rows && rows.length > 0) return rows;
    } catch {
      // fallback
    }
    return [...mockArtists];
  },

  async createArtist(artistData: Omit<Artist, 'id'>): Promise<Artist> {
    try {
      const result: any = await query(
        'INSERT INTO artists (name, genre, bio, image_url, spotify_url, instagram_url) VALUES (?, ?, ?, ?, ?, ?)',
        [artistData.name, artistData.genre, artistData.bio || null, artistData.image_url || null, artistData.spotify_url || null, artistData.instagram_url || null]
      );
      const newArt: Artist = { id: result.insertId, ...artistData, created_at: new Date().toISOString() };
      mockArtists.push(newArt);
      return newArt;
    } catch {
      // fallback
    }
    const newArtist: Artist = {
      id: mockArtists.length + 1,
      ...artistData,
    };
    mockArtists.push(newArtist);
    return newArtist;
  },

  async updateArtist(id: number, updates: Partial<Artist>): Promise<Artist | null> {
    try {
      await query(
        'UPDATE artists SET name = COALESCE(?, name), genre = COALESCE(?, genre), bio = COALESCE(?, bio), image_url = COALESCE(?, image_url) WHERE id = ?',
        [updates.name || null, updates.genre || null, updates.bio || null, updates.image_url || null, id]
      );
    } catch {
      // fallback
    }
    const index = mockArtists.findIndex((a) => a.id === id);
    if (index === -1) return null;
    mockArtists[index] = { ...mockArtists[index], ...updates };
    return mockArtists[index];
  },

  async deleteArtist(id: number): Promise<boolean> {
    try {
      await query('DELETE FROM artists WHERE id = ?', [id]);
    } catch {
      // fallback
    }
    mockArtists = mockArtists.filter((a) => a.id !== id);
    return true;
  },

  // --- TICKET TIERS ---
  async getTiersByEventId(eventId: number): Promise<TicketTier[]> {
    try {
      const rows = await query<TicketTier>('SELECT * FROM ticket_tiers WHERE event_id = ? ORDER BY price DESC', [eventId]);
      if (rows && rows.length > 0) return rows;
    } catch {
      // fallback
    }
    return mockTicketTiers.filter((t) => t.event_id === eventId);
  },

  async getAllTiers(): Promise<TicketTier[]> {
    try {
      const rows = await query<TicketTier>('SELECT * FROM ticket_tiers ORDER BY event_id ASC, price DESC');
      if (rows && rows.length > 0) return rows;
    } catch {
      // fallback
    }
    return [...mockTicketTiers];
  },

  async createTier(tierData: Omit<TicketTier, 'id' | 'sold_count'>): Promise<TicketTier> {
    try {
      const perksStr = Array.isArray(tierData.perks_json) ? JSON.stringify(tierData.perks_json) : tierData.perks_json || '[]';
      const result: any = await query(
        'INSERT INTO ticket_tiers (event_id, name, price, total_quota, description, perks_json, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [tierData.event_id, tierData.name, tierData.price, tierData.total_quota, tierData.description || null, perksStr, tierData.status || 'active']
      );
      const newT: TicketTier = { id: result.insertId, sold_count: 0, ...tierData };
      mockTicketTiers.push(newT);
      return newT;
    } catch {
      // fallback
    }
    const newTier: TicketTier = {
      id: mockTicketTiers.length + 1,
      sold_count: 0,
      ...tierData,
    };
    mockTicketTiers.push(newTier);
    return newTier;
  },

  async updateTier(id: number, updates: Partial<TicketTier>): Promise<TicketTier | null> {
    try {
      await query(
        'UPDATE ticket_tiers SET name = COALESCE(?, name), price = COALESCE(?, price), total_quota = COALESCE(?, total_quota), status = COALESCE(?, status) WHERE id = ?',
        [updates.name || null, updates.price || null, updates.total_quota || null, updates.status || null, id]
      );
    } catch {
      // fallback
    }
    const index = mockTicketTiers.findIndex((t) => t.id === id);
    if (index === -1) return null;
    mockTicketTiers[index] = { ...mockTicketTiers[index], ...updates };
    return mockTicketTiers[index];
  },

  async deleteTier(id: number): Promise<boolean> {
    try {
      await query('DELETE FROM ticket_tiers WHERE id = ?', [id]);
    } catch {
      // fallback
    }
    mockTicketTiers = mockTicketTiers.filter((t) => t.id !== id);
    return true;
  },

  // --- ORDERS & PAYMENTS ---
  async getAllOrders(): Promise<Order[]> {
    try {
      const rows = await query<Order>(
        `SELECT o.*, e.title as event_title 
         FROM orders o 
         LEFT JOIN events e ON o.event_id = e.id 
         ORDER BY o.created_at DESC`
      );
      if (rows && rows.length > 0) return rows;
    } catch {
      // fallback
    }
    return [...mockOrders];
  },

  async getOrdersByUserOrEmail(userId?: number | null, email?: string): Promise<Order[]> {
    try {
      let sql = `SELECT o.*, e.title as event_title FROM orders o LEFT JOIN events e ON o.event_id = e.id WHERE `;
      const params: any[] = [];
      if (userId && email) {
        sql += `(o.user_id = ? OR o.customer_email = ?) ORDER BY o.created_at DESC`;
        params.push(userId, email);
      } else if (userId) {
        sql += `o.user_id = ? ORDER BY o.created_at DESC`;
        params.push(userId);
      } else if (email) {
        sql += `o.customer_email = ? ORDER BY o.created_at DESC`;
        params.push(email);
      } else {
        return [];
      }
      const rows = await query<Order>(sql, params);
      if (rows && rows.length > 0) return rows;
    } catch {
      // fallback
    }
    return mockOrders.filter(
      (o) => (userId && o.user_id === userId) || (email && o.customer_email.toLowerCase() === email.toLowerCase())
    );
  },

  async getOrderByCode(code: string): Promise<Order | null> {
    try {
      const rows = await query<Order>(
        `SELECT o.*, e.title as event_title 
         FROM orders o 
         LEFT JOIN events e ON o.event_id = e.id 
         WHERE o.order_code = ? LIMIT 1`,
        [code]
      );
      if (rows && rows.length > 0) {
        const order = rows[0];
        const items = await query<OrderItem>('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        const payments = await query<Payment>('SELECT * FROM payments WHERE order_id = ? LIMIT 1', [order.id]);
        return {
          ...order,
          items,
          payment: payments[0] || undefined,
        };
      }
    } catch {
      // fallback
    }
    return mockOrders.find((o) => o.order_code === code) || null;
  },

  async createOrder(
    orderData: {
      user_id?: number | null;
      event_id: number;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      customer_id_card?: string;
      tier_id: number;
      quantity: number;
      payment_method: 'qris' | 'virtual_account' | 'bank_transfer' | 'credit_card';
    }
  ): Promise<Order> {
    const tier = mockTicketTiers.find((t) => t.id === orderData.tier_id);
    if (!tier) throw new Error('Kategori tiket tidak ditemukan');
    if (tier.status !== 'active' || tier.sold_count + orderData.quantity > tier.total_quota) {
      throw new Error('Kuota tiket untuk kategori ini tidak mencukupi atau sudah ditutup.');
    }

    const unitPrice = tier.price;
    const subtotal = unitPrice * orderData.quantity;
    const adminFee = 25000;
    const grandTotal = subtotal + adminFee;
    const orderCode = `AP26-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const ticketCode = `TKT-AP26-${tier.name.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: mockOrders.length + 1,
      order_code: orderCode,
      user_id: orderData.user_id || null,
      event_id: orderData.event_id,
      event_title: mockEvents.find((e) => e.id === orderData.event_id)?.title || 'AURORA PULSE 2026',
      total_amount: grandTotal,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      customer_id_card: orderData.customer_id_card,
      status: 'pending',
      created_at: new Date().toISOString(),
      items: [
        {
          id: Date.now(),
          order_id: mockOrders.length + 1,
          ticket_tier_id: tier.id,
          tier_name: tier.name,
          ticket_code: ticketCode,
          quantity: orderData.quantity,
          unit_price: unitPrice,
          subtotal: subtotal,
        },
      ],
      payment: {
        id: Date.now(),
        order_id: mockOrders.length + 1,
        payment_method: orderData.payment_method,
        payment_reference: `PAY-${orderCode}`,
        amount: grandTotal,
        status: 'pending',
      },
    };

    // Increase sold count
    tier.sold_count += orderData.quantity;
    if (tier.sold_count >= tier.total_quota) {
      tier.status = 'sold_out';
    }

    mockOrders.unshift(newOrder);
    return newOrder;
  },

  async verifyPayment(orderId: number, status: 'verified' | 'rejected'): Promise<Order | null> {
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) return null;

    order.status = status === 'verified' ? 'paid' : 'rejected';
    if (order.payment) {
      order.payment.status = status;
      order.payment.verified_at = new Date().toISOString();
    }
    return order;
  },

  // --- DASHBOARD METRICS ---
  async getDashboardMetrics() {
    const totalOrders = mockOrders.length;
    const paidOrders = mockOrders.filter((o) => o.status === 'paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const totalTicketsSold = mockTicketTiers.reduce((sum, t) => sum + t.sold_count, 0);
    const totalQuota = mockTicketTiers.reduce((sum, t) => sum + t.total_quota, 0);

    return {
      totalRevenue,
      totalOrders,
      paidOrdersCount: paidOrders.length,
      pendingOrdersCount: mockOrders.filter((o) => o.status === 'pending').length,
      totalTicketsSold,
      totalQuota,
      activeEventsCount: mockEvents.filter((e) => e.status === 'open').length,
      recentOrders: mockOrders.slice(0, 10),
      ticketTiers: mockTicketTiers,
    };
  },
};
