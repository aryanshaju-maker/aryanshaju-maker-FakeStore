// src/store/cartSlice.js — updated for server sync
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  // items: [{ id, title, price, image, quantity }]
  reducers: {
    addToCart (state, action) {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    increaseQty (state, action) {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.quantity += 1
    },
    decreaseQty (state, action) {
      const idx = state.items.findIndex(i => i.id === action.payload)
      if (idx !== -1) {
        if (state.items[idx].quantity <= 1) {
          state.items.splice(idx, 1)
        } else {
          state.items[idx].quantity -= 1
        }
      }
    },
    clearCart (state) {
      state.items = []
    },
    // Used when restoring cart from server on login
    setCart (state, action) {
      state.items = action.payload
    }
  }
})

export const { addToCart, increaseQty, decreaseQty, clearCart, setCart } =
  cartSlice.actions
export default cartSlice.reducer
