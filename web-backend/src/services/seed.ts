// Data contoh festival "Gelar Tikar" (fiktif, untuk tugas sekolah).
// Dipakai saat MySQL tidak tersambung. Isinya sama dengan bagian SEEDER di database/schema.sql.
import bcrypt from 'bcryptjs';
import type { User, Artist, Event, LineupSlot, TicketTier, Order } from './store.js';

export const seedUsers: User[] = [
  {
    id: 1,
    name: 'Panitia Gelar Tikar',
    email: 'admin@gelartikar.id',
    password: bcrypt.hashSync('Admin12345!', 10),
    phone: '081122334455',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Raditya Pratama',
    email: 'raditya@example.com',
    password: bcrypt.hashSync('User12345!', 10),
    phone: '081234567890',
    role: 'customer',
  },
];

export const seedArtists: Artist[] = [
  { id: 1, name: 'Kapal Kertas', genre: 'Pop indie', bio: 'Kuintet asal Bekasi yang menulis lagu tentang perjalanan pulang kerja.' },
  { id: 2, name: 'Radio Tetangga', genre: 'Rock alternatif', bio: 'Trio gitar dari Surabaya; liriknya diambil dari obrolan di gang rumah.' },
  { id: 3, name: 'Jemuran Basah', genre: 'Folk', bio: 'Duo akustik dari Yogyakarta dengan gitar, ukulele, dan harmonika.' },
  { id: 4, name: 'Anak Tangga', genre: 'Math rock', bio: 'Empat orang dari Bandung yang gemar birama ganjil.' },
  { id: 5, name: 'Lampu Kuning', genre: 'Dream pop', bio: 'Band lima orang dari Jakarta Selatan dengan suara gitar yang berlapis.' },
  { id: 6, name: 'Sepatu Lumpur', genre: 'Punk', bio: 'Punk cepat dan pendek dari Tangerang. Setiap lagu kurang dari dua menit.' },
  { id: 7, name: 'Ombak Pagi', genre: 'Surf pop', bio: 'Band empat orang dari Denpasar dengan gitar bergema dan lagu musim panas.' },
  { id: 8, name: 'Tukang Pos Kesiangan', genre: 'Ska', bio: 'Tujuh personel dari Malang dengan seksi tiup yang selalu mengajak berdansa.' },
  { id: 9, name: 'Nadia Laras', genre: 'Pop balada', bio: 'Penyanyi dan penulis lagu dari Medan, tampil bersama band lengkap.' },
  { id: 10, name: 'Kebun Belakang', genre: 'Shoegaze', bio: 'Band empat orang dari Bogor; banyak pedal, sedikit bicara.' },
  { id: 11, name: 'Pita Kaset', genre: 'Indie pop', bio: 'Trio dari Semarang yang merilis semua lagunya dalam bentuk kaset.' },
  { id: 12, name: 'Rumah Jamur', genre: 'Rock psikedelik', bio: 'Band empat orang dari Malang dengan jam session panjang di tengah lagu.' },
];

export const seedEvents: Event[] = [
  {
    id: 1,
    title: 'Gelar Tikar 2027 Jakarta',
    slug: 'gelar-tikar-2027-jakarta',
    description:
      'Tiga hari musik band dan indie lokal di tiga panggung. Bawa tikar, datang dari sore, pulang setelah band terakhir.',
    banner_url: '',
    venue_name: 'Lapangan Parkir Timur Senayan',
    venue_address: 'Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat',
    event_date: '2027-02-19T15:00:00+07:00',
    end_date: '2027-02-21T23:00:00+07:00',
    status: 'open',
  },
  {
    id: 2,
    title: 'Gelar Tikar 2027 Bandung',
    slug: 'gelar-tikar-2027-bandung',
    description: 'Satu hari penuh di Bandung dengan band math rock, shoegaze, dan dream pop.',
    banner_url: '',
    venue_name: 'Lapangan Saparua',
    venue_address: 'Jl. Banda No. 28, Citarum, Bandung Wetan, Kota Bandung',
    event_date: '2027-03-13T14:00:00+07:00',
    end_date: '2027-03-13T23:00:00+07:00',
    status: 'open',
  },
  {
    id: 3,
    title: 'Gelar Tikar 2027 Yogyakarta',
    slug: 'gelar-tikar-2027-yogyakarta',
    description: 'Dua hari di Yogyakarta: folk dan pop di hari Sabtu, rock di hari Minggu.',
    banner_url: '',
    venue_name: 'Stadion Kridosono',
    venue_address: 'Jl. Yos Sudarso, Kotabaru, Gondokusuman, Kota Yogyakarta',
    event_date: '2027-04-10T15:00:00+07:00',
    end_date: '2027-04-11T23:00:00+07:00',
    status: 'open',
  },
  {
    id: 4,
    title: 'Gelar Tikar 2027 Surabaya',
    slug: 'gelar-tikar-2027-surabaya',
    description: 'Satu malam ska, punk, dan rock alternatif di Surabaya.',
    banner_url: '',
    venue_name: 'Jatim Expo',
    venue_address: 'Jl. Ahmad Yani No. 99, Gayungan, Kota Surabaya',
    event_date: '2027-05-08T15:00:00+07:00',
    end_date: '2027-05-08T23:00:00+07:00',
    status: 'open',
  },
];

// Panggung: A = Teras, B = Pendopo, C = Serambi
export const seedLineup: LineupSlot[] = [
  // Jakarta, hari 1 (Jumat)
  { id: 1, event_id: 1, artist_id: 11, stage_name: 'A · Teras', performance_time: '16:00', day_number: 1 },
  { id: 2, event_id: 1, artist_id: 3, stage_name: 'C · Serambi', performance_time: '17:30', day_number: 1 },
  { id: 3, event_id: 1, artist_id: 5, stage_name: 'B · Pendopo', performance_time: '19:00', day_number: 1 },
  { id: 4, event_id: 1, artist_id: 1, stage_name: 'A · Teras', performance_time: '21:00', day_number: 1 },
  // Jakarta, hari 2 (Sabtu)
  { id: 5, event_id: 1, artist_id: 6, stage_name: 'C · Serambi', performance_time: '16:00', day_number: 2 },
  { id: 6, event_id: 1, artist_id: 7, stage_name: 'B · Pendopo', performance_time: '17:30', day_number: 2 },
  { id: 7, event_id: 1, artist_id: 4, stage_name: 'B · Pendopo', performance_time: '19:00', day_number: 2 },
  { id: 8, event_id: 1, artist_id: 2, stage_name: 'A · Teras', performance_time: '21:00', day_number: 2 },
  // Jakarta, hari 3 (Minggu)
  { id: 9, event_id: 1, artist_id: 10, stage_name: 'C · Serambi', performance_time: '16:00', day_number: 3 },
  { id: 10, event_id: 1, artist_id: 12, stage_name: 'A · Teras', performance_time: '17:30', day_number: 3 },
  { id: 11, event_id: 1, artist_id: 8, stage_name: 'B · Pendopo', performance_time: '19:00', day_number: 3 },
  { id: 12, event_id: 1, artist_id: 9, stage_name: 'A · Teras', performance_time: '21:00', day_number: 3 },
  // Bandung
  { id: 13, event_id: 2, artist_id: 10, stage_name: 'A · Teras', performance_time: '16:00', day_number: 1 },
  { id: 14, event_id: 2, artist_id: 5, stage_name: 'A · Teras', performance_time: '18:30', day_number: 1 },
  { id: 15, event_id: 2, artist_id: 4, stage_name: 'A · Teras', performance_time: '21:00', day_number: 1 },
  // Yogyakarta
  { id: 16, event_id: 3, artist_id: 3, stage_name: 'A · Teras', performance_time: '17:00', day_number: 1 },
  { id: 17, event_id: 3, artist_id: 1, stage_name: 'A · Teras', performance_time: '20:30', day_number: 1 },
  { id: 18, event_id: 3, artist_id: 7, stage_name: 'A · Teras', performance_time: '17:00', day_number: 2 },
  { id: 19, event_id: 3, artist_id: 12, stage_name: 'A · Teras', performance_time: '20:30', day_number: 2 },
  // Surabaya
  { id: 20, event_id: 4, artist_id: 6, stage_name: 'A · Teras', performance_time: '16:30', day_number: 1 },
  { id: 21, event_id: 4, artist_id: 8, stage_name: 'A · Teras', performance_time: '19:00', day_number: 1 },
  { id: 22, event_id: 4, artist_id: 2, stage_name: 'A · Teras', performance_time: '21:00', day_number: 1 },
];

export const seedTiers: TicketTier[] = [
  // Jakarta
  { id: 1, event_id: 1, name: 'Tiket Jumat', price: 175000, total_quota: 2500, sold_count: 1640, description: 'Masuk hari Jumat, 19 Februari.', perks_json: ['Berlaku Jumat, 19 Februari', 'Akses ketiga panggung', 'Gelang kain festival'], status: 'active' },
  { id: 2, event_id: 1, name: 'Tiket Sabtu', price: 200000, total_quota: 2500, sold_count: 2210, description: 'Masuk hari Sabtu, 20 Februari.', perks_json: ['Berlaku Sabtu, 20 Februari', 'Akses ketiga panggung', 'Gelang kain festival'], status: 'active' },
  { id: 3, event_id: 1, name: 'Tiket Minggu', price: 200000, total_quota: 2500, sold_count: 1985, description: 'Masuk hari Minggu, 21 Februari.', perks_json: ['Berlaku Minggu, 21 Februari', 'Akses ketiga panggung', 'Gelang kain festival'], status: 'active' },
  { id: 4, event_id: 1, name: 'Terusan 3 Hari', price: 495000, total_quota: 1500, sold_count: 1310, description: 'Masuk Jumat sampai Minggu dengan satu gelang.', perks_json: ['Berlaku 19–21 Februari', 'Akses ketiga panggung', 'Gelang kain festival', 'Jalur masuk terpisah di Gerbang 2'], status: 'active' },
  // Bandung
  { id: 5, event_id: 2, name: 'Reguler', price: 150000, total_quota: 2000, sold_count: 870, description: 'Masuk untuk satu orang.', perks_json: ['Berlaku Sabtu, 13 Maret', 'Gelang kain festival'], status: 'active' },
  { id: 6, event_id: 2, name: 'Tikar Berdua', price: 280000, total_quota: 300, sold_count: 214, description: 'Satu tiket untuk dua orang, termasuk tikar resmi Gelar Tikar.', perks_json: ['Untuk 2 orang', 'Tikar anyam ukuran 1×2 m', 'Gelang kain festival'], status: 'active' },
  // Yogyakarta
  { id: 7, event_id: 3, name: 'Tiket Sabtu', price: 150000, total_quota: 1800, sold_count: 640, description: 'Masuk hari Sabtu, 10 April.', perks_json: ['Berlaku Sabtu, 10 April', 'Gelang kain festival'], status: 'active' },
  { id: 8, event_id: 3, name: 'Tiket Minggu', price: 150000, total_quota: 1800, sold_count: 590, description: 'Masuk hari Minggu, 11 April.', perks_json: ['Berlaku Minggu, 11 April', 'Gelang kain festival'], status: 'active' },
  { id: 9, event_id: 3, name: 'Terusan 2 Hari', price: 260000, total_quota: 800, sold_count: 455, description: 'Masuk Sabtu dan Minggu dengan satu gelang.', perks_json: ['Berlaku 10–11 April', 'Gelang kain festival'], status: 'active' },
  // Surabaya
  { id: 10, event_id: 4, name: 'Presale', price: 110000, total_quota: 500, sold_count: 500, description: 'Harga presale, terbatas 500 tiket.', perks_json: ['Berlaku Sabtu, 8 Mei', 'Gelang kain festival'], status: 'sold_out' },
  { id: 11, event_id: 4, name: 'Reguler', price: 140000, total_quota: 1500, sold_count: 380, description: 'Masuk untuk satu orang.', perks_json: ['Berlaku Sabtu, 8 Mei', 'Gelang kain festival'], status: 'active' },
];

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const seedOrders: Order[] = [
  {
    id: 1,
    order_code: 'GT-7K2M9Q',
    user_id: 2,
    event_id: 1,
    total_amount: 505000,
    customer_name: 'Raditya Pratama',
    customer_email: 'raditya@example.com',
    customer_phone: '081234567890',
    customer_id_card: '3171029384756102',
    status: 'paid',
    created_at: hoursAgo(50),
    items: [{ id: 1, order_id: 1, ticket_tier_id: 4, tier_name: 'Terusan 3 Hari', ticket_code: 'GT-JKT-7K2M9Q-1', quantity: 1, unit_price: 495000, subtotal: 495000 }],
    payment: { id: 1, order_id: 1, payment_method: 'qris', payment_reference: 'QRIS-7K2M9Q', amount: 505000, status: 'verified', payment_time: hoursAgo(50), verified_at: hoursAgo(48) },
  },
  {
    id: 2,
    order_code: 'GT-P4X8WD',
    user_id: null,
    event_id: 1,
    total_amount: 410000,
    customer_name: 'Siti Nurhaliza',
    customer_email: 'siti.nur@example.com',
    customer_phone: '085712349911',
    customer_id_card: '3201948572019283',
    status: 'pending',
    created_at: hoursAgo(3),
    items: [{ id: 2, order_id: 2, ticket_tier_id: 2, tier_name: 'Tiket Sabtu', ticket_code: 'GT-JKT-P4X8WD-1', quantity: 2, unit_price: 200000, subtotal: 400000 }],
    payment: { id: 2, order_id: 2, payment_method: 'virtual_account', payment_reference: '8808 0812 3412 9911', amount: 410000, status: 'pending', payment_time: hoursAgo(3) },
  },
];
