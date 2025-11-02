"use client"

import AuthForm from "@/components/AuthForm"
import { API_BASE_URL } from "@/config/apiConfig"
import { useDispatch } from "react-redux"
import { loginSuccess } from "@/redux/slices/authSlice"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function SignupPage() {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSignup = async (data: { email: string; password: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (res.ok && result.token) {
        // Save token + email in Redux + localStorage
        dispatch(loginSuccess({ token: result.token, email: result.email }))
        router.push("/") // redirect to dashboard
      } else {
        toast.error(result.message || "Registration failed")
      }
    } catch (error) {
      toast.error("Error registering user. Please try again.")
    }
  }

  return <AuthForm type="signup" onSubmit={handleSignup} />
}
