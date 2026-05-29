// src/screens/SplashScreen.js
import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

export default function SplashScreen ({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      {/* Replace with your AI-generated splash image */}
      <Text style={styles.title}>FAKE STORE</Text>
      <Text style={styles.subtitle}>Your one-stop shop</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 4
  },
  subtitle: {
    fontSize: 18,
    color: '#90caf9',
    marginTop: 10
  }
})
