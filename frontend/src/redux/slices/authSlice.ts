import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  token: string | null
  email: string | null
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  email: typeof window !== "undefined" ? localStorage.getItem("email") : null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; email: string }>) => {
      state.token = action.payload.token
      state.email = action.payload.email
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token)
        localStorage.setItem("email", action.payload.email)
      }
    },
    logout: (state) => {
      state.token = null
      state.email = null
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("email")
      }
    }
  }
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
