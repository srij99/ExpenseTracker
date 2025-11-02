"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AuthFormProps {
  type: "login" | "signup"
  onSubmit?: (formData: { email: string; password: string }) => void
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    onSubmit?.(formData)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
      <Card className="w-full max-w-md border-zinc-700 bg-zinc-900 text-zinc-100 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {type === "login" ? "Welcome Back" : "Create Your Account"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-zinc-400">Email</label>
              <Input
                name="email"
                type="email"
                required
                placeholder="Enter email"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-zinc-400">Password</label>
              <Input
                name="password"
                type="password"
                required
                placeholder="Enter password"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-all" disabled={loading}>
              {loading ? "Please wait..." : type === "login" ? "Login" : "Sign Up"}
            </Button>
          </form>

          <div className="text-center mt-4 text-sm text-zinc-400">
            {type === "login" ? (
              <>
                Don’t have an account?{" "}
                <Link href="/signup" className="text-blue-500 hover:underline">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
