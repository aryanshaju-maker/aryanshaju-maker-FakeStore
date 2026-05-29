import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCartItems,
  selectCartTotalQuantity,
  selectCartTotalPrice,
  increaseQuantity,
  decreaseQuantity
} from '../store/cartSlice'
import BASE_URL from '../config/api'

export default function CartScreen () {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const totalQuantity = useSelector(selectCartTotalQuantity)
  const totalPrice = useSelector(selectCartTotalPrice)

  const getImageUri = imagePath => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `${BASE_URL}${imagePath}`
  }

  // Inside your component, add:
  const { token } = useSelector(s => s.auth)
  const orders = useSelector(s => s.orders.orders)

  // Sync cart to server whenever items change
  useEffect(() => {
    if (token) {
      const serverItems = items.map(i => ({
        id: i.id,
        price: i.price,
        count: i.quantity
      }))
      api.putCart(token, serverItems).catch(() => {})
    }
  }, [items])

  // Checkout handler
  const handleCheckOut = async () => {
    if (items.length === 0) return
    try {
      const orderItems = items.map(i => ({
        prodID: i.id,
        price: i.price,
        quantity: i.quantity
      }))
      const res = await api.createOrder(token, orderItems)
      if (res.status === 'OK') {
        dispatch(clearCart())
        // Refresh orders
        const ordersRes = await api.getOrders(token)
        if (ordersRes.status === 'OK') dispatch(setOrders(ordersRes.orders))
        Alert.alert('Success', `Order #${res.id} created!`)
      } else {
        Alert.alert('Error', res.message || 'Order failed.')
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server.')
    }
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>Your shopping cart is empty</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Summary bar at the top */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          Items: <Text style={styles.summaryValue}>{totalQuantity}</Text>
        </Text>
        <Text style={styles.summaryText}>
          Total Price:{' '}
          <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
        </Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: getImageUri(item.image) }}
              style={styles.image}
              resizeMode='contain'
            />
            <View style={styles.info}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.productPrice}>
                Price: ${item.price?.toFixed(2)}
              </Text>
              {/* Quantity controls */}
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => dispatch(decreaseQuantity(item.id))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>quantity: {item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => dispatch(increaseQuantity(item.id))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.btnCheckout} onPress={handleCheckOut}>
        <Text style={styles.checkoutText}>🛒 Check Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f4f8'
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888'
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 18
  },
  summaryText: {
    color: '#cce4ff',
    fontSize: 14,
    fontWeight: '500'
  },
  summaryValue: {
    color: '#ffffff',
    fontWeight: '800'
  },
  list: {
    padding: 14
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#f8f8f8'
  },
  info: {
    flex: 1,
    marginLeft: 12
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
    lineHeight: 18
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  qtyBtn: {
    backgroundColor: '#28a745',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333'
  },
  // Style:
  btnCheckout: {
    backgroundColor: '#1a237e',
    margin: 16,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center'
  },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
})
