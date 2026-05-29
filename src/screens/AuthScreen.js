// src/screens/AuthScreen.js
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'
import { setCart } from '../store/cartSlice'
import { setOrders } from '../store/ordersSlice'
import * as api from '../services/api'

export default function AuthScreen () {
  const dispatch = useDispatch()
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClear = () => {
    setName('')
    setEmail('')
    setPassword('')
  }

  const loginAndLoadData = async (token, id, userName, userEmail) => {
    dispatch(loginSuccess({ token, id, name: userName, email: userEmail }))
    // Restore server cart
    try {
      const cartRes = await api.getCart(token)
      if (cartRes.status === 'OK' && cartRes.items?.length > 0) {
        // items from server: { id, price, count } — we need full product info
        // For now set minimal items; ProductDetail will have full info when re-added
        const restored = cartRes.items.map(ci => ({
          id: ci.id,
          price: ci.price,
          quantity: ci.count,
          title: `Product #${ci.id}`,
          image: ''
        }))
        dispatch(setCart(restored))
      } else {
        dispatch(setCart([]))
      }
    } catch (e) {
      dispatch(setCart([]))
    }
    // Restore orders
    try {
      const ordersRes = await api.getOrders(token)
      if (ordersRes.status === 'OK') {
        dispatch(setOrders(ordersRes.orders))
      }
    } catch (e) {}
  }

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required.')
      return
    }
    setLoading(true)
    try {
      const res = await api.signUp(name, email, password)
      if (res.status === 'OK') {
        await loginAndLoadData(res.token, res.id, res.name, res.email)
      } else {
        Alert.alert('Sign Up Failed', res.message || 'Unknown error')
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.')
      return
    }
    setLoading(true)
    try {
      const res = await api.signIn(email, password)
      if (res.status === 'OK') {
        await loginAndLoadData(res.token, res.id, res.name, res.email)
      } else {
        Alert.alert('Sign In Failed', res.message || 'Wrong email or password')
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        {isSignUp
          ? 'Sign up a new user'
          : 'Sign in with your email and password'}
      </Text>

      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder='User Name'
          value={name}
          onChangeText={setName}
          autoCapitalize='words'
        />
      )}

      <TextInput
        style={styles.input}
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <TextInput
        style={styles.input}
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator
          size='large'
          color='#1a237e'
          style={{ marginTop: 20 }}
        />
      ) : (
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnClear} onPress={handleClear}>
            <Text style={styles.btnText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnMain}
            onPress={isSignUp ? handleSignUp : handleSignIn}
          >
            <Text style={styles.btnText}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={() => {
          setIsSignUp(!isSignUp)
          handleClear()
        }}
      >
        <Text style={styles.toggle}>
          {isSignUp
            ? 'Switch to: sign in with an existing user'
            : 'Switch to: sign up a new user'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a237e',
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#f5f5f5'
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  btnClear: {
    flex: 1,
    backgroundColor: '#607d8b',
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center'
  },
  btnMain: {
    flex: 1,
    backgroundColor: '#1a237e',
    padding: 14,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center'
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  toggle: {
    marginTop: 24,
    textAlign: 'center',
    color: '#1a237e',
    textDecorationLine: 'underline'
  }
})
