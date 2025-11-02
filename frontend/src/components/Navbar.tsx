"use client"

import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { logout } from "@/redux/slices/authSlice"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      dispatch(logout())
      router.push("/login")
    } catch (error) {
      toast.error("Error logging out. Please try again.", {
        theme: "dark"
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!mounted) return null

  return (
    <nav
      className="
        sticky top-0 z-50 
        flex justify-between items-center 
        px-6 py-4 
        bg-zinc-900 border-b border-zinc-800 
        text-zinc-100 shadow-md
      "
    >
      <h1 className="text-2xl font-bold tracking-wide text-zinc-100">Expense Tracker</h1>

      {token && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              disabled={isLoggingOut}
              className="rounded-full p-2 hover:bg-zinc-800 transition-colors"
            >
              <User className="h-6 w-6 text-zinc-200" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-36 bg-zinc-900 border border-zinc-800 text-zinc-100">
            <DropdownMenuItem
              onClick={handleLogout}
              className="
                cursor-pointer text-red-500 
                hover:bg-zinc-800 hover:text-red-400
                transition-colors
              "
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  )
}
