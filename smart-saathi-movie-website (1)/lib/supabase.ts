import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://hoplqelopeygeajnmilo.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcGxxZWxvcGV5Z2Vham5taWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjEyNTUsImV4cCI6MjA2ODMzNzI1NX0.0V46_HrS0UEIjJ84BFGBzepo8zWGmFWrFoK_ufOlOJ8"

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Movie = {
  id: number
  title: string
  description: string
  poster_url: string
  trailer_url?: string
  movie_url: string
  genre: string
  year: number
  rating: number
  duration: string
  created_at: string
  is_featured: boolean // Added new field
}

// Sample movies data as fallback (updated to include is_featured)
export const sampleMovies: Movie[] = [
  {
    id: 1,
    title: "Action Hero",
    description:
      "An exciting action-packed adventure with stunning visuals and thrilling sequences that will keep you on the edge of your seat.",
    poster_url: "https://images.unsplash.com/photo-1489599735734-79b4afd47c06?w=400&h=600&fit=crop",
    trailer_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    movie_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    genre: "action",
    year: 2023,
    rating: 8.5,
    duration: "2h 15m",
    created_at: new Date().toISOString(),
    is_featured: true, // Default to true for some samples
  },
  {
    id: 2,
    title: "Comedy Night",
    description:
      "A hilarious comedy that will keep you laughing from start to finish with amazing performances and witty dialogue.",
    poster_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    trailer_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    movie_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    genre: "comedy",
    year: 2022,
    rating: 7.8,
    duration: "1h 45m",
    created_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: 3,
    title: "Space Odyssey",
    description:
      "A mind-bending science fiction journey through space and time that explores the mysteries of the universe.",
    poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    trailer_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    movie_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    genre: "sci-fi",
    year: 2024,
    rating: 9.2,
    duration: "2h 30m",
    created_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: 4,
    title: "Horror Nights",
    description: "A spine-chilling horror movie that will haunt your dreams with terrifying scenes and jump scares.",
    poster_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    trailer_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    movie_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    genre: "horror",
    year: 2023,
    rating: 7.5,
    duration: "1h 55m",
    created_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: 5,
    title: "Love Story",
    description:
      "A beautiful romantic tale that will touch your heart with its emotional depth and stunning cinematography.",
    poster_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit:crop",
    trailer_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    movie_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    genre: "romance",
    year: 2022,
    rating: 8.0,
    duration: "2h 05m",
    created_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: 6,
    title: "Mystery Thriller",
    description: "A gripping thriller that will keep you guessing until the very end with unexpected twists and turns.",
    poster_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit:crop",
    trailer_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    movie_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    genre: "thriller",
    year: 2024,
    rating: 8.8,
    duration: "2h 20m",
    created_at: new Date().toISOString(),
    is_featured: false, // This one is not featured by default
  },
]

// Function to check if database is available and get movies
export async function getMovies(): Promise<{ movies: Movie[]; isUsingDatabase: boolean; error?: string }> {
  try {
    // Try to fetch from database first
    const { data, error } = await supabase.from("movies").select("*").order("created_at", { ascending: false })

    if (error) {
      if (error.message.includes("does not exist")) {
        // Table doesn't exist, return sample data
        return { movies: sampleMovies, isUsingDatabase: false }
      }
      throw error
    }

    // Database is working, return real data
    return { movies: data || [], isUsingDatabase: true }
  } catch (error) {
    console.error("Database error, using sample data:", error)
    // Return sample data as fallback
    return { movies: sampleMovies, isUsingDatabase: false, error: "Database connection failed" }
  }
}

// Function to get featured movies
export async function getFeaturedMovies(): Promise<Movie[]> {
  try {
    const { data, error } = await supabase.from("movies").select("*").eq("is_featured", true).limit(5)
    if (error) {
      console.error("Error fetching featured movies from DB:", error)
      // Fallback to sample featured movies if DB fails
      return sampleMovies.filter((movie) => movie.is_featured).slice(0, 5)
    }
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching featured movies:", error)
    return sampleMovies.filter((movie) => movie.is_featured).slice(0, 5)
  }
}

// Function to toggle featured status
export async function toggleFeaturedStatus(id: number, status: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("movies").update({ is_featured: status }).eq("id", id)
    if (error) {
      console.error("Error toggling featured status:", error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error) {
    console.error("Unexpected error toggling featured status:", error)
    return { success: false, error: "Failed to toggle featured status" }
  }
}

// Function to add movie (works with both database and local storage)
export async function addMovie(
  movieData: Omit<Movie, "id" | "created_at">,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Try to add to database first
    const { error } = await supabase.from("movies").insert([movieData])

    if (error) {
      if (error.message.includes("does not exist")) {
        // Table doesn't exist, store in localStorage
        const localMovies = JSON.parse(localStorage.getItem("local_movies") || "[]")
        const newMovie = {
          ...movieData,
          id: Date.now(), // Simple ID generation
          created_at: new Date().toISOString(),
          is_featured: false, // Default to false for new local movies
        }
        localMovies.push(newMovie)
        localStorage.setItem("local_movies", JSON.stringify(localMovies) as string) // Ensure it's a string
        return { success: true }
      }
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding movie:", error)
    return { success: false, error: "Failed to add movie" }
  }
}

// Function to update movie (only works with database)
export async function updateMovie(
  id: number,
  movieData: Partial<Omit<Movie, "id" | "created_at">>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("movies").update(movieData).eq("id", id)
    if (error) {
      if (error.message.includes("does not exist")) {
        return { success: false, error: "Database table not found. Update not supported in local mode." }
      }
      throw error
    }
    return { success: true }
  } catch (error) {
    console.error("Error updating movie:", error)
    return { success: false, error: "Failed to update movie" }
  }
}

// Function to delete movie (only works with database)
export async function deleteMovie(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("movies").delete().eq("id", id)
    if (error) {
      if (error.message.includes("does not exist")) {
        return { success: false, error: "Database table not found. Delete not supported in local mode." }
      }
      throw error
    }
    return { success: true }
  } catch (error) {
    console.error("Error deleting movie:", error)
    return { success: false, error: "Failed to delete movie" }
  }
}

// Function to get local movies from localStorage (updated to include is_featured)
export function getLocalMovies(): Movie[] {
  if (typeof window === "undefined") return []
  const localMovies = JSON.parse(localStorage.getItem("local_movies") || "[]")
  // Combine sample movies with locally added movies, ensuring unique IDs
  const combinedMovies = [...sampleMovies]
  localMovies.forEach((localMovie: Movie) => {
    if (!combinedMovies.some((m) => m.id === localMovie.id)) {
      combinedMovies.push({ ...localMovie, is_featured: localMovie.is_featured || false }) // Ensure is_featured is set
    }
  })
  return combinedMovies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
