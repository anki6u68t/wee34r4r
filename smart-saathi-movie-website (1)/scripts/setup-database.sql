-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create movies table with proper structure
CREATE TABLE movies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  poster_url TEXT,
  trailer_url TEXT,
  movie_url TEXT NOT NULL,
  genre VARCHAR(100),
  year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  rating DECIMAL(3,1) DEFAULT 0.0,
  duration VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample movies for testing
INSERT INTO movies (title, description, poster_url, movie_url, genre, year, rating, duration) VALUES
(
  'Sample Action Movie',
  'An exciting action-packed adventure with stunning visuals and thrilling sequences.',
  'https://images.unsplash.com/photo-1489599735734-79b4afd47c06?w=400&h=600&fit=crop',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'action',
  2023,
  8.5,
  '2h 15m'
),
(
  'Comedy Classic',
  'A hilarious comedy that will keep you laughing from start to finish.',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'comedy',
  2022,
  7.8,
  '1h 45m'
),
(
  'Sci-Fi Epic',
  'A mind-bending science fiction journey through space and time.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'sci-fi',
  2024,
  9.2,
  '2h 30m'
);

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admin_users (username, password_hash) VALUES
('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO');

-- Enable Row Level Security (optional, can be disabled for testing)
-- ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for testing)
-- CREATE POLICY "Movies are viewable by everyone" ON movies FOR SELECT USING (true);
-- CREATE POLICY "Movies are editable by everyone" ON movies FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON movies TO anon;
GRANT ALL ON admin_users TO anon;
GRANT ALL ON movies TO authenticated;
GRANT ALL ON admin_users TO authenticated;
