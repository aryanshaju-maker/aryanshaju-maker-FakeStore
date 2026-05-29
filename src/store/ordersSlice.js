// src/store/ordersSlice.js
import { createSlice } from '@reduxjs/toolkit'

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [] // array of order objects from server
  },
  reducers: {
    setOrders (state, action) {
      state.orders = action.payload
    },
    clearOrders (state) {
      state.orders = []
    }
  }
})

export const { setOrders, clearOrders } = ordersSlice.actions
export default ordersSlice.reducer
