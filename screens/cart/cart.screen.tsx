import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { deleteById, getAllCartByEmail } from "@/API/Cart/cartAPI";
import { Cart, CartItem } from "@/constants/Cart/cartList";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<Cart | null>(null);
  const email = "user@example.com";
  const calculateTotal = () => {
    const total = cartItems?.courses?.reduce((total, item) => {
      const price = item.courseId.price ? item.courseId.price : "0";
      return total + parseFloat(price);
    }, 0);
  
    return total ? total.toLocaleString("vi-VN") + " ₫" : "0 ₫";
  };
  
  const cartLength = cartItems?.courses?.length ?? 0;
  const courseIdToDelete = (item: CartItem) => item.courseId._id;

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const token = "nhap token";
      if (token) {
        if (cartItems && cartItems.cartId) {
          await deleteById(cartItems.cartId, token, courseId);
          const updatedCart = await getAllCartByEmail(email, token);
          setCartItems(updatedCart);
        } else {
          console.error("cartItems or cartId is null");
        }
      } else {
        Alert.alert("Xin lỗi!", "Bạn cần đăng nhập để thực hiện hành động này");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = "nhap token";
        if (token) {
          const result: Cart= await getAllCartByEmail(email, token);
          console.log("Test result: " + result.Cart);
          if (result && result.Cart) {
            const coursesArray = Array.isArray(result.Cart.courses)
              ? result.Cart.courses
              : [];
            setCartItems({
              ...result.Cart,
              courses: coursesArray,
            });
          } else {
            setCartItems({
              _id: "",
              cartId: "",
              courses: [],
              userGenerated: "",
              __v: 0,
            });
          }
        } else {
          console.warn("Token is null, unable to fetch content");
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };
    console.log("Test cartItem: " + cartItems);
    fetchData();
  }, [email]);

  const confirmDeleteCourse = (item: CartItem) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa khóa học này khỏi giỏ hàng không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: () => handleDeleteCourse(courseIdToDelete(item)),
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#e2e9f9", "#d7e2fb"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerCart}>
          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="arrow-back" size={30} color="#000" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerCart_Text}>Shopping Cart</Text>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="shopping-cart" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.bodyOne}>
          <Text style={styles.bodyOne_Text}>
            You have {cartLength} items in your cart
          </Text>
        </View>
        <View style={styles.body}>
          {cartItems && cartItems.courses && cartItems.courses.length > 0 ? (
            cartItems.courses.map((item) => (
              <View key={item._id} style={styles.cart}>
                <View style={styles.cart_img}>
                  <Text></Text>
                </View>
                <View style={styles.cart_Text}>
                  <View>
                    <Text style={styles.cart_Text_One}>
                      {item.courseId.courseName}
                    </Text>
                    <Text></Text>
                    <Text style={styles.cart_Text_One}>
                      {parseFloat(item.courseId.price).toLocaleString("vi-VN")}{" "}
                      ₫
                    </Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity onPress={() => confirmDeleteCourse(item)}>
                    <MaterialIcons name="delete" size={25} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>No items in your cart.</Text>
          )}
        </View>

        {/* Footer */}
        <View>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.checkoutContainer}>
              <View style={styles.checkoutBackground}>
                <Text style={styles.totalPriceText}>{calculateTotal()}</Text>
                <View style={styles.checkoutButton}>
                  <Text style={styles.checkoutButtonText}>Checkout</Text>
                  <MaterialIcons name="arrow-forward" size={25} color="#fff" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerCart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: height * 0.1,
  },
  headerCart_Text: {
    fontSize: 22,
    fontWeight: "bold",
  },
  bodyOne: {
    width: width * 0.45,
    height: 40,
    backgroundColor: "#000",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  bodyOne_Text: {
    color: "#fff",
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 10,
  },
  body: {
    flex: 1,
  },
  cart: {
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  cart_img: {
    backgroundColor: "#3a62bf",
    height: 80,
    flex: 1,
    margin: 10,
    borderRadius: 20,
  },
  cart_Text: {
    flex: 2,
    paddingHorizontal: 8,
  },
  cart_Text_One: {
    fontSize: 14,
  },
  checkoutContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    padding: 15,
  },
  checkoutBackground: {
    backgroundColor: "#4169E1",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    width: width * 0.8,
    borderRadius: 15,
  },
  totalPriceText: {
    fontSize: 18,
    color: "#fff",
  },
  checkoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  checkoutButtonText: {
    fontSize: 18,
    color: "#fff",
    paddingHorizontal: 3,
  },
});
