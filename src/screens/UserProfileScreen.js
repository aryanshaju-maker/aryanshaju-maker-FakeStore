// src/screens/UserProfileScreen.js
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { logout, updateUserName } from '../store/authSlice'
import { clearCart } from '../store/cartSlice'
import { clearOrders } from '../store/ordersSlice'
import * as api from '../services/api'

export default function UserProfileScreen () {
  const dispatch = useDispatch()
  const { user, token } = useSelector(s => s.auth)
  const [modalVisible, setModalVisible] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignOut = () => {
    dispatch(logout())
    dispatch(clearCart())
    dispatch(clearOrders())
  }

  const handleUpdate = async () => {
    if (!newName || !newPassword) {
      Alert.alert('Error', 'Name and password cannot be empty.')
      return
    }
    setLoading(true)
    try {
      const res = await api.updateUser(token, newName, newPassword)
      if (res.status === 'OK') {
        dispatch(updateUserName(res.name))
        Alert.alert('Success', 'Profile updated successfully.')
        setModalVisible(false)
        setNewName('')
        setNewPassword('')
      } else {
        Alert.alert('Update Failed', res.message || 'Unknown error')
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>User Name:</Text>
        <Text style={styles.value}>{user?.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.btnUpdate}
          onPress={() => {
            setNewName(user?.name || '')
            setNewPassword('')
            setModalVisible(true)
          }}
        >
          <Text style={styles.btnText}>✏️ Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSignOut} onPress={handleSignOut}>
          <Text style={styles.btnText}>🚪 Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Update Modal */}
      <Modal visible={modalVisible} transparent animationType='slide'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>User Profile</Text>

            <TextInput
              style={styles.input}
              placeholder='New User Name'
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder='New Password'
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            {loading ? (
              <ActivityIndicator size='large' color='#1a237e' />
            ) : (
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={handleUpdate}
                >
                  <Text style={styles.btnText}>✓ Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.btnText}>✕ Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#1a237e',
    textAlign: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 24
  },
  infoRow: { flexDirection: 'row', marginBottom: 14 },
  label: { fontWeight: 'bold', width: 110, fontSize: 16 },
  value: { fontSize: 16, color: '#333' },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  btnUpdate: {
    flex: 1,
    backgroundColor: '#1a237e',
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center'
  },
  btnSignOut: {
    flex: 1,
    backgroundColor: '#c62828',
    padding: 14,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center'
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24
  },
  modalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 24 },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
    fontSize: 16
  },
  btnConfirm: {
    flex: 1,
    backgroundColor: '#1a237e',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center'
  },
  btnCancel: {
    flex: 1,
    backgroundColor: '#607d8b',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center'
  }
})
