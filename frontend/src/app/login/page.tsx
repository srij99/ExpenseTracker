"use client"

import AuthForm from "@/components/AuthForm"
import { API_BASE_URL } from "@/config/apiConfig"
import { useDispatch } from "react-redux"
import { loginSuccess } from "@/redux/slices/authSlice"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function LoginPage() {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (res.ok && result.token) {
        dispatch(loginSuccess({ token: result.token, email: result.email }))
        router.push("/")
      } else {
        toast.error(result.message || "Login failed")
      }
    } catch (error) {
      toast.error("Error logging in. Please try again.")
    }
  }

  return <AuthForm type="login" onSubmit={handleLogin} />
}
