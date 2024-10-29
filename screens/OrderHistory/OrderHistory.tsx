import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DataTable, Modal, Portal, Button, Provider } from 'react-native-paper';
import { getOrderHistory } from '@/API/OrderHistory/OrderHistory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderHistory, Course } from '@/constants/OrderHistory/orderHistory';
import * as Clipboard from 'expo-clipboard';

const OrderHistoryScreen = () => {
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        const token = `Bearer ${await AsyncStorage.getItem('token')}`;
        
        if (!userString) {
          console.warn("No user found in AsyncStorage.");
          return;
        }
        if (!token) {
          console.warn("No Token found in AsyncStorage.");
          return;
        }

        const user = JSON.parse(userString);
        const userEmail = user.email;

        const data = await getOrderHistory(userEmail, token);
        if (Array.isArray(data)) {
          setOrderHistory(data);
        } else {
          console.warn("Unexpected data structure:", data);
          setOrderHistory([]);
        }
      } catch (err) {
        setError(`Failed to fetch order history. ${err}`);
        console.error("Error fetching order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleCopy = async (orderId: string, price: number, courses: Course[]) => {
    const courseDetails = courses.map(course => `${course.courseName} (${new Date(course.purchaseDate).toLocaleDateString()})`).join('\n');
    const textToCopy = `Order ID: ${orderId}\nPrice: $${price.toFixed(2)}\nCourses:\n${courseDetails}`;
    
    await Clipboard.setStringAsync(textToCopy);
    alert('Order details copied to clipboard!');
  };

  const openModal = (order: OrderHistory) => {
    setSelectedOrder(order);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setSelectedOrder(null);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order History</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2467EC" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Price</DataTable.Title>
              <DataTable.Title>Courses</DataTable.Title>
              <DataTable.Title>Action</DataTable.Title>
            </DataTable.Header>

            {orderHistory.map(order => (
              <DataTable.Row key={order._id}>
                <DataTable.Cell>${order.price.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell>
                  <Text>
                    {order.courses[0]?.courseName}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <TouchableOpacity onPress={() => openModal(order)}>
                    <Text style={styles.detailButton}>Detail</Text>
                  </TouchableOpacity>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        )}

        <Portal>
          <Modal visible={visible} onDismiss={closeModal} contentContainerStyle={styles.modalContainer}>
            {selectedOrder && (
              <View>
                <Text style={styles.modalTitle}>Order Details</Text>
                <Text>Order ID: {selectedOrder.orderId}</Text>
                <Text>Price: ${selectedOrder.price.toFixed(2)}</Text>
                <Text>Courses:</Text>
                {selectedOrder.courses.map(course => (
                  <Text key={course.courseName}>
                    {course.courseName} ({new Date(course.purchaseDate).toLocaleDateString()})
                  </Text>
                ))}

                <Button onPress={() => handleCopy(selectedOrder.orderId, selectedOrder.price, selectedOrder.courses)}>
                  Copy Order Details
                </Button>

                <Button mode="contained" onPress={closeModal} style={styles.closeButton}>
                  Close
                </Button>
              </View>
            )}
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  headerTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  detailButton: {
    color: '#2467EC',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
  },
});

export default OrderHistoryScreen;
