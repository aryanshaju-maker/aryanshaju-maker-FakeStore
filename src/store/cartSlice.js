import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [] // each item: { id, title, price, image, quantity }
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.quantity += 1
    },
    decreaseQuantity: (state, action) => {
      const index = state.items.findIndex(i => i.id === action.payload)
      if (index !== -1) {
        if (state.items[index].quantity === 1) {
          // Remove item when quantity hits 0
          state.items.splice(index, 1)
        } else {
          state.items[index].quantity -= 1
        }
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    }
  }
})

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } =
  cartSlice.actions

// Selectors
export const selectCartItems = state => state.cart.items
export const selectCartTotalQuantity = state =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartTotalPrice = state =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export default cartSlice.reducer
