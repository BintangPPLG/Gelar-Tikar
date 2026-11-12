-- ====================================================================
-- DATABASE SCHEMA: GELAR TIKAR (WEB TIKET FESTIVAL)
-- Engine: MySQL 8.0+ / MariaDB 10.5+
-- ====================================================================

-- Pastikan teks (mis. tanda –) tersimpan benar walau diimpor dari terminal Windows.
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS concert_tickets_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE concert_tickets_db;

-- 1. Table: Users (Admin and Customer Accounts)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NULL,
    role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. Table: Artists (Singers / Performers)
CREATE TABLE IF NOT EXISTS artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    bio TEXT NULL,
    image_url VARCHAR(255) NULL,
    spotify_url VARCHAR(255) NULL,
    instagram_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_artist_genre (genre)
) ENGINE=InnoDB;

-- 3. Table: Events (Concerts / Festivals)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    banner_url VARCHAR(255) NOT NULL,
    venue_name VARCHAR(150) NOT NULL,
    venue_address TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    end_date DATETIME NULL,
    status ENUM('draft', 'open', 'closed', 'sold_out') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_status (status),
    INDEX idx_event_date (event_date)
) ENGINE=InnoDB;

-- 4. Table: Event_Artists (Pivot relation between Events and Artists)
CREATE TABLE IF NOT EXISTS event_artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    artist_id INT NOT NULL,
    stage_name VARCHAR(100) NOT NULL DEFAULT 'Main Stage',
    performance_time VARCHAR(50) NOT NULL,
    day_number INT NOT NULL DEFAULT 1,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    INDEX idx_event_artist_link (event_id, artist_id)
) ENGINE=InnoDB;

-- 5. Table: Ticket_Tiers (Ticket Categories: VIP, CAT 1, CAT 2, etc.)
CREATE TABLE IF NOT EXISTS ticket_tiers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    total_quota INT NOT NULL DEFAULT 100,
    sold_count INT NOT NULL DEFAULT 0,
    description TEXT NULL,
    perks_json JSON NULL,
    status ENUM('active', 'closed', 'sold_out') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_ticket_event (event_id),
    INDEX idx_ticket_status (status)
) ENGINE=InnoDB;

-- 6. Table: Orders (Customer Booking Orders)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NULL,
    event_id INT NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_id_card VARCHAR(50) NULL,
    status ENUM('pending', 'paid', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_order_status (status),
    INDEX idx_order_email (customer_email)
) ENGINE=InnoDB;

-- 7. Table: Order_Items (Items inside an order)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    ticket_tier_id INT NOT NULL,
    ticket_code VARCHAR(60) NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_tier_id) REFERENCES ticket_tiers(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 8. Table: Payments (Payment transactions & verification)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    payment_method ENUM('qris', 'virtual_account', 'bank_transfer', 'credit_card') NOT NULL,
    payment_reference VARCHAR(100) NULL,
    amount DECIMAL(12, 2) NOT NULL,
    proof_image_url VARCHAR(255) NULL,
    status ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    verified_by INT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_payment_status (status)
) ENGINE=InnoDB;

-- ====================================================================
-- DATA AWAL (fiktif, untuk demo)
-- Admin  : admin@gelartikar.id / Admin12345!
-- Pembeli: customer@gmail.com  / User12345!
-- ====================================================================

-- 1. Users
INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES
(1, 'Panitia Gelar Tikar', 'admin@gelartikar.id', '$2b$10$opw14/uPxi4drknJZ/9NmeGRU.KcPRMOEq9YoGNy.168LR4Q0Bjjm', '081122334455', 'admin'),
(2, 'Raditya Pratama', 'raditya@example.com', '$2b$10$zCSKQO/LQsKfYI0IflKooeS85yZKOhYI7S8UKn7wy2wePe/C9hRx2', '081234567890', 'customer');

-- 2. Artists
INSERT IGNORE INTO artists (id, name, genre, bio, image_url, spotify_url, instagram_url) VALUES
(1, 'Kapal Kertas', 'Pop indie', 'Kuintet asal Bekasi yang menulis lagu tentang perjalanan pulang kerja.', NULL, NULL, NULL),
(2, 'Radio Tetangga', 'Rock alternatif', 'Trio gitar dari Surabaya; liriknya diambil dari obrolan di gang rumah.', NULL, NULL, NULL),
(3, 'Jemuran Basah', 'Folk', 'Duo akustik dari Yogyakarta dengan gitar, ukulele, dan harmonika.', NULL, NULL, NULL),
(4, 'Anak Tangga', 'Math rock', 'Empat orang dari Bandung yang gemar birama ganjil.', NULL, NULL, NULL),
(5, 'Lampu Kuning', 'Dream pop', 'Band lima orang dari Jakarta Selatan dengan suara gitar yang berlapis.', NULL, NULL, NULL),
(6, 'Sepatu Lumpur', 'Punk', 'Punk cepat dan pendek dari Tangerang. Setiap lagu kurang dari dua menit.', NULL, NULL, NULL),
(7, 'Ombak Pagi', 'Surf pop', 'Band empat orang dari Denpasar dengan gitar bergema dan lagu musim panas.', NULL, NULL, NULL),
(8, 'Tukang Pos Kesiangan', 'Ska', 'Tujuh personel dari Malang dengan seksi tiup yang selalu mengajak berdansa.', NULL, NULL, NULL),
(9, 'Nadia Laras', 'Pop balada', 'Penyanyi dan penulis lagu dari Medan, tampil bersama band lengkap.', NULL, NULL, NULL),
(10, 'Kebun Belakang', 'Shoegaze', 'Band empat orang dari Bogor; banyak pedal, sedikit bicara.', NULL, NULL, NULL),
(11, 'Pita Kaset', 'Indie pop', 'Trio dari Semarang yang merilis semua lagunya dalam bentuk kaset.', NULL, NULL, NULL),
(12, 'Rumah Jamur', 'Rock psikedelik', 'Band empat orang dari Malang dengan jam session panjang di tengah lagu.', NULL, NULL, NULL);

-- 3. Events
INSERT IGNORE INTO events (id, title, slug, description, banner_url, venue_name, venue_address, event_date, end_date, status) VALUES
(1, 'Gelar Tikar 2027 Jakarta', 'gelar-tikar-2027-jakarta', 'Tiga hari musik band dan indie lokal di tiga panggung. Bawa tikar, datang dari sore, pulang setelah band terakhir.', '', 'Lapangan Parkir Timur Senayan', 'Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat', '2027-02-19 15:00:00', '2027-02-21 23:00:00', 'open'),
(2, 'Gelar Tikar 2027 Bandung', 'gelar-tikar-2027-bandung', 'Satu hari penuh di Bandung dengan band math rock, shoegaze, dan dream pop.', '', 'Lapangan Saparua', 'Jl. Banda No. 28, Citarum, Bandung Wetan, Kota Bandung', '2027-03-13 14:00:00', '2027-03-13 23:00:00', 'open'),
(3, 'Gelar Tikar 2027 Yogyakarta', 'gelar-tikar-2027-yogyakarta', 'Dua hari di Yogyakarta: folk dan pop di hari Sabtu, rock di hari Minggu.', '', 'Stadion Kridosono', 'Jl. Yos Sudarso, Kotabaru, Gondokusuman, Kota Yogyakarta', '2027-04-10 15:00:00', '2027-04-11 23:00:00', 'open'),
(4, 'Gelar Tikar 2027 Surabaya', 'gelar-tikar-2027-surabaya', 'Satu malam ska, punk, dan rock alternatif di Surabaya.', '', 'Jatim Expo', 'Jl. Ahmad Yani No. 99, Gayungan, Kota Surabaya', '2027-05-08 15:00:00', '2027-05-08 23:00:00', 'open');

-- 4. Lineup (panggung A = Teras, B = Pendopo, C = Serambi)
INSERT IGNORE INTO event_artists (id, event_id, artist_id, stage_name, performance_time, day_number) VALUES
(1, 1, 11, 'A · Teras', '16:00', 1),
(2, 1, 3, 'C · Serambi', '17:30', 1),
(3, 1, 5, 'B · Pendopo', '19:00', 1),
(4, 1, 1, 'A · Teras', '21:00', 1),
(5, 1, 6, 'C · Serambi', '16:00', 2),
(6, 1, 7, 'B · Pendopo', '17:30', 2),
(7, 1, 4, 'B · Pendopo', '19:00', 2),
(8, 1, 2, 'A · Teras', '21:00', 2),
(9, 1, 10, 'C · Serambi', '16:00', 3),
(10, 1, 12, 'A · Teras', '17:30', 3),
(11, 1, 8, 'B · Pendopo', '19:00', 3),
(12, 1, 9, 'A · Teras', '21:00', 3),
(13, 2, 10, 'A · Teras', '16:00', 1),
(14, 2, 5, 'A · Teras', '18:30', 1),
(15, 2, 4, 'A · Teras', '21:00', 1),
(16, 3, 3, 'A · Teras', '17:00', 1),
(17, 3, 1, 'A · Teras', '20:30', 1),
(18, 3, 7, 'A · Teras', '17:00', 2),
(19, 3, 12, 'A · Teras', '20:30', 2),
(20, 4, 6, 'A · Teras', '16:30', 1),
(21, 4, 8, 'A · Teras', '19:00', 1),
(22, 4, 2, 'A · Teras', '21:00', 1);

-- 5. Ticket tiers
INSERT IGNORE INTO ticket_tiers (id, event_id, name, price, total_quota, sold_count, description, perks_json, status) VALUES
(1, 1, 'Tiket Jumat', 175000.00, 2500, 1640, 'Masuk hari Jumat, 19 Februari.', '["Berlaku Jumat, 19 Februari","Akses ketiga panggung","Gelang kain festival"]', 'active'),
(2, 1, 'Tiket Sabtu', 200000.00, 2500, 2210, 'Masuk hari Sabtu, 20 Februari.', '["Berlaku Sabtu, 20 Februari","Akses ketiga panggung","Gelang kain festival"]', 'active'),
(3, 1, 'Tiket Minggu', 200000.00, 2500, 1985, 'Masuk hari Minggu, 21 Februari.', '["Berlaku Minggu, 21 Februari","Akses ketiga panggung","Gelang kain festival"]', 'active'),
(4, 1, 'Terusan 3 Hari', 495000.00, 1500, 1310, 'Masuk Jumat sampai Minggu dengan satu gelang.', '["Berlaku 19–21 Februari","Akses ketiga panggung","Gelang kain festival","Jalur masuk terpisah di Gerbang 2"]', 'active'),
(5, 2, 'Reguler', 150000.00, 2000, 870, 'Masuk untuk satu orang.', '["Berlaku Sabtu, 13 Maret","Gelang kain festival"]', 'active'),
(6, 2, 'Tikar Berdua', 280000.00, 300, 214, 'Satu tiket untuk dua orang, termasuk tikar resmi Gelar Tikar.', '["Untuk 2 orang","Tikar anyam ukuran 1×2 m","Gelang kain festival"]', 'active'),
(7, 3, 'Tiket Sabtu', 150000.00, 1800, 640, 'Masuk hari Sabtu, 10 April.', '["Berlaku Sabtu, 10 April","Gelang kain festival"]', 'active'),
(8, 3, 'Tiket Minggu', 150000.00, 1800, 590, 'Masuk hari Minggu, 11 April.', '["Berlaku Minggu, 11 April","Gelang kain festival"]', 'active'),
(9, 3, 'Terusan 2 Hari', 260000.00, 800, 455, 'Masuk Sabtu dan Minggu dengan satu gelang.', '["Berlaku 10–11 April","Gelang kain festival"]', 'active'),
(10, 4, 'Presale', 110000.00, 500, 500, 'Harga presale, terbatas 500 tiket.', '["Berlaku Sabtu, 8 Mei","Gelang kain festival"]', 'sold_out'),
(11, 4, 'Reguler', 140000.00, 1500, 380, 'Masuk untuk satu orang.', '["Berlaku Sabtu, 8 Mei","Gelang kain festival"]', 'active');

-- 6. Contoh pesanan
INSERT IGNORE INTO orders (id, order_code, user_id, event_id, total_amount, customer_name, customer_email, customer_phone, customer_id_card, status) VALUES
(1, 'GT-7K2M9Q', 2, 1, 505000.00, 'Raditya Pratama', 'raditya@example.com', '081234567890', '3171029384756102', 'paid'),
(2, 'GT-P4X8WD', NULL, 1, 410000.00, 'Siti Nurhaliza', 'siti.nur@example.com', '085712349911', '3201948572019283', 'pending');

INSERT IGNORE INTO order_items (id, order_id, ticket_tier_id, ticket_code, quantity, unit_price, subtotal) VALUES
(1, 1, 4, 'GT-JKT-7K2M9Q-1', 1, 495000.00, 495000.00),
(2, 2, 2, 'GT-JKT-P4X8WD-1', 2, 200000.00, 400000.00);

INSERT IGNORE INTO payments (id, order_id, payment_method, payment_reference, amount, proof_image_url, status, verified_at, verified_by) VALUES
(1, 1, 'qris', 'QRIS-7K2M9Q', 505000.00, NULL, 'verified', NOW(), 1),
(2, 2, 'virtual_account', '8808 0812 3412 9911', 410000.00, NULL, 'pending', NULL, NULL);

