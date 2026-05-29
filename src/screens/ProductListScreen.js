import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert
} from 'react-native'
import BASE_URL from '../config/api'

export default function ProductListScreen ({ route, navigation }) {
  const { category } = route.params
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Must URL-encode: men's clothing → men%27s%20clothing
      const encodedCategory = encodeURIComponent(category)
      const response = await fetch(
        `${BASE_URL}/products/category/${encodedCategory}`
      )
      const data = await response.json()
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        Alert.alert('Error', 'Could not load products for this category.')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load products. Is your server running?')
    } finally {
      setLoading(false)
    }
  }

  // Handles both absolute URLs (third-party API) and relative paths (local server)
  const getImageUri = imagePath => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `${BASE_URL}${imagePath}`
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color='#007AFF' />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('ProductDetail', { productId: item.id })
            }
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: getImageUri(item.image) }}
              style={styles.image}
              resizeMode='contain'
            />
            <View style={styles.cardInfo}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.productPrice}>
                Price: ${item.price?.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8'
  },
  list: {
    padding: 16
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
  cardInfo: {
    flex: 1,
    marginLeft: 12
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a2e',
    marginBottom: 6,
    lineHeight: 20
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333'
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
