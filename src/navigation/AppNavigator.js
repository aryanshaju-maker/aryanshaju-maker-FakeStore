// src/navigation/AppNavigator.js
import React from 'react'
import { Alert, View, Text, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSelector } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'

import CategoryScreen from '../screens/CategoryScreen'
import ProductListScreen from '../screens/ProductListScreen'
import ProductDetailScreen from '../screens/ProductDetailScreen'
import CartScreen from '../screens/CartScreen'
import MyOrdersScreen from '../screens/MyOrdersScreen'
import UserProfileScreen from '../screens/UserProfileScreen'
import AuthScreen from '../screens/AuthScreen'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function ProductsStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Categories' component={CategoryScreen} />
      <Stack.Screen name='ProductList' component={ProductListScreen} />
      <Stack.Screen name='ProductDetail' component={ProductDetailScreen} />
    </Stack.Navigator>
  )
}

const Badge = ({ count }) =>
  count > 0 ? (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  ) : null

export default function AppNavigator () {
  const isLoggedIn = useSelector(s => s.auth.isLoggedIn)
  const cartItems = useSelector(s => s.cart.items)
  const orders = useSelector(s => s.orders.orders)

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const newOrdersCount = orders.filter(
    o => !o.is_paid && !o.is_delivered
  ).length

  const requireLogin = (navigation, routeName) => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please sign in to access this feature.')
      return true
    }
    return false
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Products: 'home-outline',
            'My Cart': 'cart-outline',
            'My Orders': 'list-outline',
            'User Profile': 'person-outline'
          }
          return (
            <Ionicons
              name={icons[route.name] || 'ellipse'}
              size={size}
              color={color}
            />
          )
        },
        tabBarActiveTintColor: '#1a237e',
        tabBarInactiveTintColor: 'gray'
      })}
    >
      <Tab.Screen name='Products' component={ProductsStack} />

      <Tab.Screen
        name='My Cart'
        component={isLoggedIn ? CartScreen : AuthScreen}
        listeners={({ navigation }) => ({
          tabPress: e => {
            if (requireLogin(navigation, 'My Cart')) e.preventDefault()
          }
        })}
        options={{
          tabBarBadge: cartCount > 0 ? cartCount : undefined
        }}
      />

      <Tab.Screen
        name='My Orders'
        component={isLoggedIn ? MyOrdersScreen : AuthScreen}
        listeners={({ navigation }) => ({
          tabPress: e => {
            if (requireLogin(navigation, 'My Orders')) e.preventDefault()
          }
        })}
        options={{
          tabBarBadge: newOrdersCount > 0 ? newOrdersCount : undefined
        }}
      />

      <Tab.Screen
        name='User Profile'
        component={isLoggedIn ? UserProfileScreen : AuthScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
})
