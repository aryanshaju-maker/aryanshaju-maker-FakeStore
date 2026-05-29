// src/services/api.js
// Base URL — change to 10.0.2.2 for Android emulator, 127.0.0.1 for iOS
const BASE_URL = 'http://10.0.2.2:3000'

const headers = token => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
})

// ── Auth ──────────────────────────────────────────────
export const signUp = (name, email, password) =>
  fetch(`${BASE_URL}/users/signup`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name, email, password })
  }).then(r => r.json())

export const signIn = (email, password) =>
  fetch(`${BASE_URL}/users/signin`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password })
  }).then(r => r.json())

export const updateUser = (token, name, password) =>
  fetch(`${BASE_URL}/users/update`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ name, password })
  }).then(r => r.json())

// ── Cart ──────────────────────────────────────────────
export const getCart = token =>
  fetch(`${BASE_URL}/cart`, { headers: headers(token) }).then(r => r.json())

export const putCart = (token, items) =>
  fetch(`${BASE_URL}/cart`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ items })
  }).then(r => r.json())

// ── Orders ────────────────────────────────────────────
export const getOrders = token =>
  fetch(`${BASE_URL}/orders/all`, { headers: headers(token) }).then(r =>
    r.json()
  )

export const createOrder = (token, items) =>
  fetch(`${BASE_URL}/orders/neworder`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ items })
  }).then(r => r.json())

export const updateOrder = (token, orderID, isPaid, isDelivered) =>
  fetch(`${BASE_URL}/orders/updateorder`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ orderID, isPaid, isDelivered })
  }).then(r => r.json())

// ── Products (local server alternative) ──────────────
export const getCategories = () =>
  fetch(`${BASE_URL}/products/categories`).then(r => r.json())

export const getProductsByCategory = category =>
  fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`).then(
    r => r.json()
  )

export const getProductById = id =>
  fetch(`${BASE_URL}/products/${id}`).then(r => r.json())

export const buildImageUrl = path =>
  path?.startsWith('http') ? path : `${BASE_URL}${path}`
