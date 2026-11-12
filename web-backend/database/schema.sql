-- ====================================================================
-- DATABASE SCHEMA: AURORA PULSE CONCERT TICKETING SYSTEM
-- Engine: MySQL 8.0+ / MariaDB 10.5+
-- ====================================================================

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
-- SEEDER DATA (Initial Default Records)
-- ====================================================================

-- 1. Insert Default Users (Admin & Customer)
-- Admin Password: AdminAurora2026! (Bcrypt hashed)
-- Customer Password: User12345! (Bcrypt hashed)
INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES
(1, 'Administrator Aurora', 'admin@aurorapulse.com', '$2b$10$cOJGFBHh4IWF4uTICQ2iS.eFU5jCloEIeUdkCNnLqUmBLUaFIp0ay', '081122334455', 'admin'),
(2, 'Raditya Pratama', 'customer@gmail.com', '$2b$10$pTULJU3LYV2FL92tIgIRXe1d43Uh.SttoXuYqemCxNX64fYifObr.', '081234567890', 'customer');


-- 2. Insert Artists
INSERT IGNORE INTO artists (id, name, genre, bio, image_url, spotify_url, instagram_url) VALUES
(1, 'Cyber Nexus', 'Progressive Synthwave / Electro', 'Produser musik elektronik pelopor tata suara spatial 360 audio dari Amsterdam.', '/assets/artist_headliner.jpg', 'https://spotify.com', 'https://instagram.com'),
(2, 'Stella Vortex', 'Melodic Techno & Live Vocals', 'Vokalis & DJ dengan performa visual panggung interaktif pemenang Grammy nominee.', '/assets/festival_atmosphere.jpg', 'https://spotify.com', 'https://instagram.com'),
(3, 'Kinetic Pulse', 'Modular Synth Live Ensemble', 'Duo komposer modular synth dengan pertunjukan live laser multi-dimensi.', '/assets/hero_stage.jpg', 'https://spotify.com', 'https://instagram.com'),
(4, 'Hyperion Echo', 'Future Bass / Cinematic', 'Produser musik bass melodis nomor satu dengan 500M+ total streaming global.', '/assets/artist_headliner.jpg', 'https://spotify.com', 'https://instagram.com');

-- 3. Insert Events
INSERT IGNORE INTO events (id, title, slug, description, banner_url, venue_name, venue_address, event_date, end_date, status) VALUES
(1, 'AURORA PULSE: WORLD TOUR 2026', 'aurora-pulse-world-tour-2026', 'Festival musik audio visual 360 spatial sound termegah di Asia Tenggara dengan 40+ artis dunia, laser show 64 unit, dan panggung multi-dimensi.', '/assets/hero_stage.jpg', 'Stadion Madya Gelora Bung Karno', 'Jl. Gerbang Pemuda No.3, Gelora, Tanah Abang, Jakarta Pusat 10270', '2026-10-18 16:00:00', '2026-10-20 23:30:00', 'open'),
(2, 'BALI SUNSET SOUNDSCAPE 2026', 'bali-sunset-soundscape-2026', 'Konser intim tepi pantai dengan aransemen ambient house, live orchestra sunset session, dan culinary art festival.', '/assets/festival_atmosphere.jpg', 'GWK Cultural Park & Lotus Pond', 'Jl. Raya Uluwatu, Ungasan, Kuta Selatan, Badung, Bali 80364', '2026-11-28 15:00:00', '2026-11-29 23:00:00', 'open'),
(3, 'NEON TOKYO CYBER RAVE 2026', 'neon-tokyo-cyber-rave-2026', 'Eksplorasi musik electronic & future rave berkonsep cyberpunk dengan panggung hologram 3D dan tata cahaya laser multi-spektrum.', '/assets/artist_headliner.jpg', 'PIK 2 International Convention & Arena', 'Kawasan Pantai Indah Kapuk 2, Tangerang, Banten 15510', '2026-12-12 17:00:00', '2026-12-13 03:00:00', 'open'),
(4, 'JAVA JAZZ & ELECTRO FUSION 2026', 'java-jazz-electro-fusion-2026', 'Kolaborasi magis musisi jazz legendaris berpadu modulasi electronic synth modern di bawah hawa sejuk kota Bandung.', '/assets/festival_atmosphere.jpg', 'Eldorado Dome & Amphitheater', 'Jl. Dr. Setiabudi No.438, Isola, Sukasari, Kota Bandung 40154', '2026-12-31 18:00:00', '2027-01-01 01:30:00', 'open'),
(5, 'SURABAYA ROCK SYMPHONY 2026', 'surabaya-rock-symphony-2026', 'Distorsi rock spektakuler berbalut orkestrasi simfoni megah 60-piece orchestra membawakan anthem legendaris sepanjang masa.', '/assets/hero_stage.jpg', 'Grand City Convention & Exhibition', 'Jl. Walikota Mustajab No.1, Ketabang, Genteng, Kota Surabaya 60272', '2027-01-16 19:00:00', '2027-01-16 23:30:00', 'open');

-- 4. Link Event with Artists
INSERT IGNORE INTO event_artists (id, event_id, artist_id, stage_name, performance_time, day_number) VALUES
(1, 1, 1, 'Aurora Mainframe Stage', '22:30 WIB', 1),
(2, 1, 2, 'Cosmic Dome', '20:45 WIB', 1),
(3, 1, 3, 'Neon Realm', '19:15 WIB', 1),
(4, 1, 4, 'Aurora Mainframe Stage', '18:00 WIB', 1),
(5, 2, 2, 'Sunset Amphitheater', '17:30 WITA', 1),
(6, 2, 3, 'Lotus Sanctuary', '20:00 WITA', 1);

-- 5. Insert Ticket Tiers
INSERT IGNORE INTO ticket_tiers (id, event_id, name, price, total_quota, sold_count, description, perks_json, status) VALUES
(1, 1, 'VIP Cosmic Holographic Pass', 2850000.00, 150, 65, 'Akses baris terdepan dengan fasilitas lounge eksklusif dan merchandise resmi festival.', '["Akses Baris Paling Depan Main Stage", "Fast-Track VIP Entrance", "Akses VIP AC Lounge & Free Flow Drink", "Official Limited Boxset Merch", "Akses Soundcheck Artis"]', 'active'),
(2, 1, 'CAT 1 Front Standing', 1650000.00, 800, 520, 'Pengalaman festival terbaik di area berdiri dengan akustik 360 spatial audio paling bertenaga.', '["Area Berdiri di Belakang VIP", "Akses 3 Panggung Festival", "Sound Stage 360 Spatial Sweetspot", "Smart RFID LED Wristband"]', 'active'),
(3, 1, 'CAT 2 Tribune Seating', 950000.00, 1200, 310, 'Kenyamanan tempat duduk bernomor di tribun beratap dengan pandangan menyeluruh panggung.', '["Nomor Kursi Tetap Berkanopi", "Pandangan Penuh Efek Laser", "Akses Toilet & F&B Khusus Tribun", "Smart RFID LED Wristband"]', 'active'),
(4, 1, '3-Day All-Access Pass', 4200000.00, 300, 190, 'Tiket terusan 3 hari penuh untuk menyaksikan seluruh 40+ artis dan pesta kembang api penutupan.', '["Akses Terusan 3 Hari Penuh", "Fast-Track Entrance Tiap Hari", "Akses After-Party Penutupan", "RFID Commemorative Metal Band"]', 'active'),
(5, 2, 'Sunset Beach Club VIP Bed Pass', 3200000.00, 80, 42, 'Daybed privat pinggir tebing GWK termasuk welcome cocktails dan canapés eksklusif.', '["Private Daybed Lounge (Up to 2 Pax)", "Welcome Artisan Cocktail & Canapés", "Priority Parking & Buggy Shuttle", "Sunset Photo Session Pass"]', 'active'),
(6, 2, 'Lotus General Admission', 1250000.00, 1500, 890, 'Akses bebas area amfiteater taman budaya GWK dan zona seni instalasi malam.', '["Akses Sunset Amphitheater", "Akses Culinary Arts Zone", "Free Eco Bamboo Straw & Drink Voucher"]', 'active'),
(7, 2, '2-Day Sunset Weekend Pass', 2100000.00, 500, 320, 'Tiket terusan akhir pekan 2 hari penuh termasuk sesi yoga akustik pagi hari.', '["Akses 2 Hari Weekend Penuh", "Morning Acoustic Yoga Session", "Merchandise Festival Bag"]', 'active'),
(8, 3, 'Cyber Rave Mainstage GA', 850000.00, 2000, 1150, 'Akses penuh dance floor laser arena dengan tata audio 120.000 watt.', '["Akses Cyber Dancefloor", "Neon LED Glow Glasses", "RFID Access Band"]', 'active'),
(9, 3, 'Hologram Deck VIP Pass', 1950000.00, 200, 140, 'Akses panggung dek bertingkat dengan pemandangan langsung ke set hologram artis.', '["Elevated VIP Hologram Deck", "Private Bar & Quick Queue", "Complimentary Energy Glow Drink"]', 'active'),
(10, 4, 'Amphitheater Seating Pass', 750000.00, 900, 410, 'Tempat duduk berjenjang dengan akustik alami terbaik di Eldorado Dome Bandung.', '["Reserved Seating Area", "Akses Zona Kuliner Kopi Bandung", "Festival Programme Booklet"]', 'active'),
(11, 4, 'New Year Eve VIP Celebration Pass', 1850000.00, 250, 180, 'Paket countdown tahun baru eksklusif dengan gala dinner dan countdown toast.', '["Front Row VIP Table", "New Year Dinner Buffet & Toast", "Meet & Greet Musisi Jazz"]', 'active'),
(12, 5, 'Rock Pit Standing Pass', 650000.00, 1200, 730, 'Area berdiri tepat di depan panggung rock orchestra dengan atmosfer paling bertenaga.', '["Akses Rock Pit Standing", "Official Band & Orchestra Tour Pick Badge", "Fast-Track Entrance"]', 'active'),
(13, 5, 'Orchestra Platinum Hall Pass', 1450000.00, 400, 260, 'Tempat duduk platinum dengan sudut pandang dan perpaduan suara orkestra paling sempurna.', '["Platinum Numbered Seating", "Akses Platinum Lounge", "Exclusive Vinyl Sleeve Souvenir"]', 'active');

-- 6. Insert Sample Orders & Payment
INSERT IGNORE INTO orders (id, order_code, user_id, event_id, total_amount, customer_name, customer_email, customer_phone, customer_id_card, status) VALUES
(1, 'AP26-ORD-839102', 2, 1, 2875000.00, 'Raditya Pratama', 'customer@gmail.com', '081234567890', '3171029384756102', 'paid'),
(2, 'AP26-ORD-519284', NULL, 1, 1675000.00, 'Siti Nurhaliza', 'siti.nur@example.com', '085712349911', '3201948572019283', 'pending');

INSERT IGNORE INTO order_items (id, order_id, ticket_tier_id, ticket_code, quantity, unit_price, subtotal) VALUES
(1, 1, 1, 'TKT-AP26-VIP-839102', 1, 2850000.00, 2850000.00),
(2, 2, 2, 'TKT-AP26-CAT1-519284', 1, 1650000.00, 1650000.00);

INSERT IGNORE INTO payments (id, order_id, payment_method, payment_reference, amount, proof_image_url, status, verified_at, verified_by) VALUES
(1, 1, 'qris', 'QRIS-NMID-98237419', 2875000.00, NULL, 'verified', NOW(), 1),
(2, 2, 'virtual_account', 'VA-BCA-8801928374619283', 1675000.00, NULL, 'pending', NULL, NULL);
