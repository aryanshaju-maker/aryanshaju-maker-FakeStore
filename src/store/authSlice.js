// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null, // { id, name, email }
    isLoggedIn: false
  },
  reducers: {
    loginSuccess (state, action) {
      // payload: { token, id, name, email }
      state.token = action.payload.token
      state.user = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email
      }
      state.isLoggedIn = true
    },
    logout (state) {
      state.token = null
      state.user = null
      state.isLoggedIn = false
    },
    updateUserName (state, action) {
      if (state.user) state.user.name = action.payload
    }
  }
})

export const { loginSuccess, logout, updateUserName } = authSlice.actions
export default authSlice.reducer
