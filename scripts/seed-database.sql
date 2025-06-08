-- Insertar datos de ejemplo

-- Insertar usuarios de ejemplo
INSERT INTO users (id, email, name, role, bio, phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@tuzonacripto.com', 'Administrador TuZonaCripto', 'admin', 'Administrador principal de la plataforma', '+52 55 1234 5678'),
('550e8400-e29b-41d4-a716-446655440002', 'owner@cafebitcoin.mx', 'María González', 'business_owner', 'Dueña del Café Bitcoin, apasionada por las criptomonedas', '+52 55 9876 5432'),
('550e8400-e29b-41d4-a716-446655440003', 'carlos@techcrypto.com', 'Carlos Ruiz', 'business_owner', 'CTO de TechCrypto Solutions', '+52 55 5555 1234'),
('550e8400-e29b-41d4-a716-446655440004', 'usuario@email.com', 'Ana Martínez', 'user', 'Entusiasta de las criptomonedas', '+52 55 7777 8888');

-- Insertar negocios de ejemplo
INSERT INTO businesses (id, name, category, description, address, lat, lng, phone, website, hours, verified, owner_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Café Bitcoin', 'Restaurante', 'Café especializado que acepta Bitcoin y otras criptomonedas. Ambiente acogedor para trabajar.', 'Av. Reforma 123, CDMX', 19.4326, -99.1332, '+52 55 1234 5678', 'cafebitcoin.mx', '7:00 - 22:00', true, '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440002', 'TechCrypto Solutions', 'Tecnología', 'Consultoría en blockchain y desarrollo de aplicaciones descentralizadas.', 'Polanco, CDMX', 19.4284, -99.1276, '+52 55 9876 5432', 'techcrypto.com', '9:00 - 18:00', true, '550e8400-e29b-41d4-a716-446655440003'),
('650e8400-e29b-41d4-a716-446655440003', 'Crypto Dental', 'Salud', 'Clínica dental moderna que acepta pagos en criptomonedas.', 'Roma Norte, CDMX', 19.415, -99.162, '+52 55 5555 1234', 'cryptodental.mx', '8:00 - 20:00', true, '550e8400-e29b-41d4-a716-446655440002');

-- Insertar criptomonedas aceptadas
INSERT INTO business_crypto (business_id, crypto_name) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Bitcoin'),
('650e8400-e29b-41d4-a716-446655440001', 'Ethereum'),
('650e8400-e29b-41d4-a716-446655440001', 'USDT'),
('650e8400-e29b-41d4-a716-446655440002', 'Bitcoin'),
('650e8400-e29b-41d4-a716-446655440002', 'Ethereum'),
('650e8400-e29b-41d4-a716-446655440002', 'Polygon'),
('650e8400-e29b-41d4-a716-446655440003', 'Bitcoin'),
('650e8400-e29b-41d4-a716-446655440003', 'USDC');

-- Insertar redes sociales de ejemplo (actualizar esta sección)
INSERT INTO business_social (business_id, platform, username, url) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'instagram', '@cafebitcoin', 'https://instagram.com/cafebitcoin'),
('650e8400-e29b-41d4-a716-446655440001', 'facebook', 'CafeBitcoinMX', 'https://facebook.com/CafeBitcoinMX'),
('650e8400-e29b-41d4-a716-446655440001', 'twitter', '@cafebitcoinmx', 'https://twitter.com/cafebitcoinmx'),
('650e8400-e29b-41d4-a716-446655440001', 'whatsapp', '+525512345678', 'https://wa.me/525512345678'),
('650e8400-e29b-41d4-a716-446655440002', 'linkedin', 'techcrypto-solutions', 'https://linkedin.com/company/techcrypto-solutions'),
('650e8400-e29b-41d4-a716-446655440002', 'twitter', '@techcryptomx', 'https://twitter.com/techcryptomx'),
('650e8400-e29b-41d4-a716-446655440002', 'telegram', 'techcryptosolutions', 'https://t.me/techcryptosolutions'),
('650e8400-e29b-41d4-a716-446655440002', 'instagram', '@tuzonacripto', 'https://instagram.com/tuzonacripto'),
('650e8400-e29b-41d4-a716-446655440003', 'instagram', '@cryptodental', 'https://instagram.com/cryptodental'),
('650e8400-e29b-41d4-a716-446655440003', 'facebook', 'CryptoDentalMX', 'https://facebook.com/CryptoDentalMX');

-- Insertar imágenes de ejemplo
INSERT INTO business_images (business_id, image_url, alt_text, is_primary) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop', 'Interior del Café Bitcoin', true),
('650e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop', 'Área de trabajo con laptop', false),
('650e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop', 'Oficina TechCrypto', true),
('650e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop', 'Clínica dental moderna', true);

-- Insertar reseñas de ejemplo
INSERT INTO reviews (business_id, user_id, rating, title, comment, crypto_used) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 5, 'Excelente experiencia pagando con Bitcoin', 'El proceso de pago con Bitcoin fue súper fácil y rápido. El café está delicioso y el ambiente es perfecto para trabajar.', 'Bitcoin'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 5, 'Consultoría blockchain excepcional', 'Excelente servicio de consultoría. Me ayudaron a implementar smart contracts para mi proyecto.', 'Ethereum');

-- Insertar posts de ejemplo
INSERT INTO business_posts (business_id, author_id, title, content, post_type) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '¡Nuevo menú cripto-temático!', 'Estamos emocionados de presentar nuestro nuevo menú con nombres inspirados en criptomonedas. ¡Ven a probar el "Bitcoin Latte" y el "Ethereum Frappé"!', 'promotion'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Workshop gratuito de Smart Contracts', 'Este sábado ofrecemos un workshop gratuito sobre desarrollo de Smart Contracts. ¡Cupos limitados!', 'event');

-- Insertar seguidores de ejemplo
INSERT INTO business_followers (business_id, user_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004');
