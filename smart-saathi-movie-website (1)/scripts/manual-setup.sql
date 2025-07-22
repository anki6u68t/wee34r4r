-- Run this SQL in your Supabase SQL Editor

-- Create the movies table
CREATE TABLE IF NOT EXISTS public.movies (
  id SERIAL PRIMARY KEY,
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

-- Insert sample movies
INSERT INTO public.movies (title, description, poster_url, movie_url, genre, year, rating, duration) VALUES
(
  'Action Hero',
  'An exciting action-packed adventure with stunning visuals and thrilling sequences that will keep you on the edge of your seat.',
  'https://images.unsplash.com/photo-1489599735734-79b4afd47c06?w=400&h=600&fit=crop',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'action',
  2023,
  8.5,
  '2h 15m'
),
(
  'Comedy Night',
  'A hilarious comedy that will keep you laughing from start to finish with amazing performances and witty dialogue.',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'comedy',
  2022,
  7.8,
  '1h 45m'
),
(
  'Space Odyssey',
  'A mind-bending science fiction journey through space and time that explores the mysteries of the universe.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'sci-fi',
  2024,
  9.2,
  '2h 30m'
);

-- Enable RLS (optional)
-- ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for testing)
-- CREATE POLICY "Allow all operations on movies" ON public.movies FOR ALL USING (true);
