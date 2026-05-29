import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'

import ProductStackNavigator from './ProductStackNavigator'
import CartScreen from '../screens/CartScreen'
import { selectCartTotalQuantity } from '../store/cartSlice'

const Tab = createBottomTabNavigator()

// Badge component shown on the cart tab icon
function CartBadge ({ count }) {
  if (count === 0) return null
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  )
}

export default function BottomTabNavigator () {
  const totalQuantity = useSelector(selectCartTotalQuantity)

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        }
      }}
    >
      <Tab.Screen
        name='Products'
        component={ProductStackNavigator}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='Shopping Cart'
        component={CartScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          title: 'Shopping Cart',
          tabBarLabel: 'My Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name='cart-outline' size={size} color={color} />
              <CartBadge count={totalQuantity} />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800'
  }
})
