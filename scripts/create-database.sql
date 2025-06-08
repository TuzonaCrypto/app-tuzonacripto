-- Crear tablas para TuZonaCripto

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'business_owner', 'admin')),
  avatar_url TEXT,
  bio TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de negocios
CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  phone VARCHAR(20),
  website VARCHAR(255),
  hours TEXT,
  verified BOOLEAN DEFAULT FALSE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de criptomonedas aceptadas
CREATE TABLE IF NOT EXISTS business_crypto (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  crypto_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de imágenes de negocios
CREATE TABLE IF NOT EXISTS business_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reseñas
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  crypto_used VARCHAR(50),
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, user_id) -- Un usuario solo puede reseñar una vez por negocio
);

-- Tabla de redes sociales de negocios
CREATE TABLE IF NOT EXISTS business_social (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin', 'telegram', 'whatsapp', 'youtube', 'tiktok')),
  username VARCHAR(255),
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de seguidores de negocios
CREATE TABLE IF NOT EXISTS business_followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, user_id)
);

-- Tabla de posts/actualizaciones de negocios
CREATE TABLE IF NOT EXISTS business_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  post_type VARCHAR(50) DEFAULT 'update' CHECK (post_type IN ('update', 'promotion', 'event', 'news')),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de likes en posts
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES business_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Tabla de comentarios en posts
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES business_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(lat, lng);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_business_posts_business ON business_posts(business_id);
CREATE INDEX IF NOT EXISTS idx_business_followers_business ON business_followers(business_id);
CREATE INDEX IF NOT EXISTS idx_business_followers_user ON business_followers(user_id);

-- Función para actualizar el rating promedio de un negocio
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE businesses 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    )
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar rating automáticamente
DROP TRIGGER IF EXISTS trigger_update_business_rating ON reviews;
CREATE TRIGGER trigger_update_business_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_business_rating();

-- Función para actualizar contadores de posts
CREATE OR REPLACE FUNCTION update_post_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'post_likes' THEN
    UPDATE business_posts 
    SET likes_count = (
      SELECT COUNT(*) 
      FROM post_likes 
      WHERE post_id = COALESCE(NEW.post_id, OLD.post_id)
    )
    WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  END IF;
  
  IF TG_TABLE_NAME = 'post_comments' THEN
    UPDATE business_posts 
    SET comments_count = (
      SELECT COUNT(*) 
      FROM post_comments 
      WHERE post_id = COALESCE(NEW.post_id, OLD.post_id)
    )
    WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para contadores
DROP TRIGGER IF EXISTS trigger_update_likes_count ON post_likes;
CREATE TRIGGER trigger_update_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_counters();

DROP TRIGGER IF EXISTS trigger_update_comments_count ON post_comments;
CREATE TRIGGER trigger_update_comments_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_counters();
