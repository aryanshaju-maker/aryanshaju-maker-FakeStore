// src/screens/MyOrdersScreen.js
import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setOrders } from '../store/ordersSlice'
import * as api from '../services/api'

const Section = ({ title, orders, token, onRefresh }) => {
  const [expanded, setExpanded] = useState({})
  const dispatch = useDispatch()

  const toggle = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const handlePay = async orderID => {
    try {
      const res = await api.updateOrder(token, orderID, 1, 0)
      if (res.status === 'OK') {
        Alert.alert('Success', 'Order marked as paid.')
        onRefresh()
      } else {
        Alert.alert('Error', res.message || 'Failed to update order.')
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server.')
    }
  }

  const handleReceive = async orderID => {
    try {
      const res = await api.updateOrder(token, orderID, 1, 1)
      if (res.status === 'OK') {
        Alert.alert('Success', 'Order marked as delivered.')
        onRefresh()
      } else {
        Alert.alert('Error', res.message || 'Failed to update order.')
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server.')
    }
  }

  if (orders.length === 0) return null

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}: {orders.length}
      </Text>
      {orders.map(order => {
        const isExpanded = expanded[order.id]
        let items = []
        try {
          items = JSON.parse(order.order_items)
        } catch (e) {}
        return (
          <View key={order.id} style={styles.orderCard}>
            <TouchableOpacity
              style={styles.orderHeader}
              onPress={() => toggle(order.id)}
            >
              <Text style={styles.orderInfo}>
                Order ID: {order.id} Items: {order.item_numbers} Total: $
                {order.total_price?.toFixed(2)}
              </Text>
              <Text style={styles.caret}>{isExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.orderDetail}>
                {items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemText}>
                      Product #{item.prodID} Qty: {item.quantity} ${item.price}
                    </Text>
                  </View>
                ))}

                {title === 'New Orders' && (
                  <TouchableOpacity
                    style={styles.btnPay}
                    onPress={() => handlePay(order.id)}
                  >
                    <Text style={styles.btnText}>💳 Pay</Text>
                  </TouchableOpacity>
                )}
                {title === 'Paid Orders' && (
                  <TouchableOpacity
                    style={styles.btnReceive}
                    onPress={() => handleReceive(order.id)}
                  >
                    <Text style={styles.btnText}>📦 Receive</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )
      })}
    </View>
  )
}

export default function MyOrdersScreen () {
  const dispatch = useDispatch()
  const { orders } = useSelector(s => s.orders)
  const { token } = useSelector(s => s.auth)
  const [loading, setLoading] = useState(false)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.getOrders(token)
      if (res.status === 'OK') dispatch(setOrders(res.orders))
    } catch (e) {}
    setLoading(false)
  }, [token])

  const newOrders = orders.filter(o => !o.is_paid && !o.is_delivered)
  const paidOrders = orders.filter(o => o.is_paid && !o.is_delivered)
  const deliveredOrders = orders.filter(o => o.is_paid && o.is_delivered)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {loading ? (
        <ActivityIndicator
          size='large'
          color='#1a237e'
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={[1]} // single item trick for scroll with RefreshControl
          keyExtractor={() => 'orders'}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
          }
          renderItem={() => (
            <View>
              <Section
                title='New Orders'
                orders={newOrders}
                token={token}
                onRefresh={fetchOrders}
              />
              <Section
                title='Paid Orders'
                orders={paidOrders}
                token={token}
                onRefresh={fetchOrders}
              />
              <Section
                title='Delivered Orders'
                orders={deliveredOrders}
                token={token}
                onRefresh={fetchOrders}
              />
              {orders.length === 0 && (
                <Text style={styles.empty}>No orders yet.</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#1a237e',
    textAlign: 'center',
    padding: 14
  },
  section: {
    margin: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  sectionTitle: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    fontWeight: 'bold',
    color: '#1a237e',
    fontSize: 15
  },
  orderCard: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0'
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12
  },
  orderInfo: { fontSize: 14, color: '#333', flex: 1 },
  caret: { fontSize: 16, color: '#1a237e', marginLeft: 8 },
  orderDetail: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fafafa'
  },
  itemRow: { paddingVertical: 4 },
  itemText: { fontSize: 13, color: '#555' },
  btnPay: {
    backgroundColor: '#1a237e',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  btnReceive: {
    backgroundColor: '#2e7d32',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 60, color: '#999', fontSize: 18 }
})
