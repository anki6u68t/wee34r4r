"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const ADMIN_PASSWORD = "ankit07"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simple password check
    if (password === ADMIN_PASSWORD) {
      // Store admin session
      localStorage.setItem("admin_authenticated", "true")
      localStorage.setItem("admin_login_time", Date.now().toString())

      // Redirect to admin panel
      window.location.href = "/admin"
    } else {
      setError("Incorrect password. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
<div className="text-center mt-6">
  <a
    href="https://otieu.com/4/9607342"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-gradient-to-r from-yellow-400 to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
  >
    🎁 Click Here to Get Your Reward
  </a>
</div>

      <Card className="w-full max-w-md bg-white/10 border-white/20">
        {" "}
        {/* Removed backdrop-blur-md */}
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-500/20 p-3 rounded-full">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <p className="text-gray-300 mt-2">Enter password to access Smart Saathi Admin Panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Admin Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400 pr-10"
                  placeholder="Enter admin password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
            >
              {loading ? "Verifying..." : "Login to Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white bg-transparent"
            >
              Back to Website
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
