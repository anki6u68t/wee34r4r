"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react" // useRef को वापस जोड़ा गया
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getLocalMovies,
  toggleFeaturedStatus,
  type Movie,
} from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save, X, LogOut, Star, CheckCircle, Sun, Moon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { useTheme } from "next-themes"

export default function AdminPanel() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isUsingDatabase, setIsUsingDatabase] = useState(false)
  const { toast } = useToast()
  const [isHeaderVisible, setIsHeaderVisible] = useState(true) // isHeaderVisible state को वापस जोड़ा गया
  const lastScrollY = useRef(0) // lastScrollY ref को वापस जोड़ा गया
  const { theme, setTheme } = useTheme()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    poster_url: "",
    trailer_url: "",
    movie_url: "",
    genre: "",
    year: new Date().getFullYear(),
    rating: 0,
    duration: "",
    is_featured: false,
  })

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadMovies()
    }
  }, [isAuthenticated])

  // useEffect for handleScroll को वापस जोड़ा गया
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 100) {
        setIsHeaderVisible(false)
      } else if (window.scrollY < lastScrollY.current) {
        setIsHeaderVisible(true)
      }
      lastScrollY.current = window.scrollY
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const checkAuthentication = () => {
    const isAuth = localStorage.getItem("admin_authenticated")
    const loginTime = localStorage.getItem("admin_login_time")

    if (isAuth === "true" && loginTime) {
      const currentTime = Date.now()
      const loginTimestamp = Number.parseInt(loginTime)
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (currentTime - loginTimestamp < twentyFourHours) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem("admin_authenticated")
        localStorage.removeItem("admin_login_time")
        window.location.href = "/admin/login"
      }
    } else {
      window.location.href = "/admin/login"
    }

    setCheckingAuth(false)
  }

  const loadMovies = async () => {
    try {
      const result = await getMovies()
      setMovies(result.movies)
      setIsUsingDatabase(result.isUsingDatabase)

      if (!result.isUsingDatabase) {
        const localMovies = getLocalMovies()
        setMovies(localMovies)
      }
    } catch (error) {
      console.error("Error loading movies:", error)
      const localMovies = getLocalMovies()
      setMovies(localMovies)
      setIsUsingDatabase(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_login_time")
    window.location.href = "/admin/login"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingMovie) {
        const result = await updateMovie(editingMovie.id!, formData)

        if (result.success) {
          toast({
            title: "Success",
            description: isUsingDatabase ? "Movie updated in database" : "Movie updated locally",
          })
          resetForm()
          loadMovies()
        } else {
          throw new Error(result.error)
        }
      } else {
        const result = await addMovie(formData)

        if (result.success) {
          toast({
            title: "Success",
            description: isUsingDatabase ? "Movie added to database" : "Movie saved locally",
          })
          resetForm()
          loadMovies()
        } else {
          throw new Error(result.error)
        }
      }
    } catch (error) {
      console.error("Error saving movie:", error)
      toast({
        title: "Error",
        description: "Failed to save movie",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteMovie(id)

      if (result.success) {
        toast({
          title: "Success",
          description: isUsingDatabase ? "Movie deleted from database" : "Movie deleted locally",
        })
        loadMovies()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error deleting movie:", error)
      toast({
        title: "Error",
        description: "Failed to delete movie",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie)
    setFormData({
      title: movie.title,
      description: movie.description,
      poster_url: movie.poster_url,
      trailer_url: movie.trailer_url || "",
      movie_url: movie.movie_url,
      genre: movie.genre || "",
      year: movie.year || new Date().getFullYear(),
      rating: movie.rating || 0,
      duration: movie.duration || "",
      is_featured: movie.is_featured || false,
    })
    setIsEditing(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      poster_url: "",
      trailer_url: "",
      movie_url: "",
      genre: "",
      year: new Date().getFullYear(),
      rating: 0,
      duration: "",
      is_featured: false,
    })
    setEditingMovie(null)
    setIsEditing(false)
  }

  const handleToggleFeatured = async (movie: Movie) => {
    if (!isUsingDatabase) {
      toast({
        title: "Error",
        description: "Featured status can only be updated when connected to the database.",
        variant: "destructive",
      })
      return
    }

    const currentFeaturedCount = movies.filter((m) => m.is_featured).length
    if (!movie.is_featured && currentFeaturedCount >= 5) {
      toast({
        title: "Limit Reached",
        description: "You can only have up to 5 featured movies at a time.",
      })
      return
    }

    const result = await toggleFeaturedStatus(movie.id, !movie.is_featured)
    if (result.success) {
      toast({
        title: "Success",
        description: `Movie "${movie.title}" featured status updated.`,
      })
      loadMovies()
    } else {
      toast({
        title: "Error",
        description: `Failed to update featured status: ${result.error}`,
        variant: "destructive",
      })
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Checking authentication...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-teal-950 to-blue-950">
      {/* Header */}
      <header
        className={`bg-black/20 border-b border-white/10 sticky top-0 z-50 transition-transform duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="container mx-auto px-2 sm:px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
                Smart Saathi - Admin Panel
              </h1>
            </div>
            <div className="flex items-center gap-1 xs:gap-2 sm:gap-4">
              {/* Theme Toggle Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white transition-all duration-300 bg-transparent"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                size="sm"
                className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white"
              >
                Back to Website
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add/Edit Movie Form */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Edit className="w-5 h-5" />
                    Edit Movie
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add New Movie
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="poster_url" className="text-white">
                    Poster URL
                  </Label>
                  <Input
                    id="poster_url"
                    value={formData.poster_url}
                    onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="https://example.com/poster.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="movie_url" className="text-white">
                    Movie URL *
                  </Label>
                  <Input
                    id="movie_url"
                    value={formData.movie_url}
                    onChange={(e) => setFormData({ ...formData, movie_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="https://example.com/movie.mp4"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="trailer_url" className="text-white">
                    Trailer URL
                  </Label>
                  <Input
                    id="trailer_url"
                    value={formData.trailer_url}
                    onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="https://example.com/trailer.mp4"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="genre" className="text-white">
                      Genre
                    </Label>
                    <Select
                      value={formData.genre}
                      onValueChange={(value) => setFormData({ ...formData, genre: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="comedy">Comedy</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                        <SelectItem value="horror">Horror</SelectItem>
                        <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                        <SelectItem value="romance">Romance</SelectItem>
                        <SelectItem value="thriller">Thriller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="year" className="text-white">
                      Year
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                      className="bg-white/10 border-white/20 text-white"
                      min="1900"
                      max="2030"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating" className="text-white">
                      Rating (0-10)
                    </Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number.parseFloat(e.target.value) })}
                      className="bg-white/10 border-white/20 text-white"
                      min="0"
                      max="10"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-white">
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="2h 30m"
                    />
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    id="is_featured"
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-cyan-600 bg-white/10 border-white/20 rounded focus:ring-cyan-500"
                  />
                  <Label htmlFor="is_featured" className="text-white">
                    Mark as Featured
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Save Changes" : "Add Movie"}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    onClick={resetForm}
                    className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 mt-2"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Movies List */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Movies ({movies.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 flex items-center justify-between glow-on-hover"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{movie.title}</h3>
                      <p className="text-gray-300 text-sm mt-1">
                        {movie.genre} • {movie.year}
                      </p>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{movie.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUsingDatabase && (
                        <Button
                          onClick={() => handleToggleFeatured(movie)}
                          variant="outline"
                          size="sm"
                          className={`${
                            movie.is_featured
                              ? "border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                              : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                          }`}
                          title={movie.is_featured ? "Unmark as Featured" : "Mark as Featured"}
                        >
                          {movie.is_featured ? <CheckCircle className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                        </Button>
                      )}
                      <Button
                        onClick={() => handleEdit(movie)}
                        variant="outline"
                        size="sm"
                        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(movie.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {movies.length === 0 && <p className="text-gray-400 text-center py-8">No movies added yet.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
