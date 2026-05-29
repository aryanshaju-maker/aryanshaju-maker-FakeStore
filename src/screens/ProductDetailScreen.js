import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert
} from 'react-native'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import BASE_URL from '../config/api'

export default function ProductDetailScreen ({ route, navigation }) {
  const { productId } = route.params
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/products/${productId}`)
      const data = await response.json()
      if (data && data.id) {
        setProduct(data)
      } else {
        Alert.alert('Error', 'Product not found.')
        navigation.goBack()
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load product details.')
      navigation.goBack()
    } finally {
      setLoading(false)
    }
  }

  const getImageUri = imagePath => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `${BASE_URL}${imagePath}`
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image
      })
    )
    Alert.alert(
      'Added to Cart',
      `"${product.title}" has been added to your cart.`
    )
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color='#007AFF' />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    )
  }

  if (!product) return null

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: getImageUri(product.image) }}
        style={styles.image}
        resizeMode='contain'
      />

      <Text style={styles.title}>{product.title}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          Rate: <Text style={styles.metaValue}>{product.rating?.rate}</Text>
        </Text>
        <Text style={styles.metaText}>
          Count: <Text style={styles.metaValue}>{product.rating?.count}</Text>
        </Text>
        <Text style={styles.metaText}>
          Price:{' '}
          <Text style={styles.metaValue}>${product.price?.toFixed(2)}</Text>
        </Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.btn, styles.backBtn]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>⬅ Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.cartBtn]}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>🛒 Add to Cart</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.descLabel}>Description:</Text>
      <View style={styles.descBox}>
        <Text style={styles.descText}>{product.description}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8'
  },
  content: {
    padding: 18,
    paddingBottom: 50
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 14,
    lineHeight: 23
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    marginBottom: 16
  },
  metaText: {
    color: '#d0e8ff',
    fontSize: 13,
    fontWeight: '500'
  },
  metaValue: {
    color: '#ffffff',
    fontWeight: '800'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22
  },
  btn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backBtn: {
    backgroundColor: '#555e70'
  },
  cartBtn: {
    backgroundColor: '#007AFF'
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15
  },
  descLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8
  },
  descBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dde4ef'
  },
  descText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#888'
  }
})
