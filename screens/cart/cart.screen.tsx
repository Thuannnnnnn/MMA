import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
interface CartItem {
  id: number;
  name: string;
  price: number;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Intro do you want",
    price: 11000000,
  },
  {
    id: 2,
    name: "If you Want",
    price: 7000000,
  },
  {
    id: 3,
    name: "But i like you",
    price: 6000000,
  },
  {
    id: 4,
    name: "await i'm fall in luv",
    price: 6000000,
  },
];

export default function CartCsreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const calculateTotal = () => {
    const total = cartItems.reduce((total, item) => total + item.price, 0);
    return total.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#e2e9f9", "#d7e2fb"]}
      style={styles.gradient}
    >
      <SafeAreaView>
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
            You have {cartItems.length} items in your cart
          </Text>
        </View>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cart}>
            <View style={styles.cart_img}>
              <Text></Text>
            </View>
            <View style={styles.cart_Text}>
              <View>
                <Text style={styles.cart_Text_One}>{item.name}</Text>
                <Text></Text>
                <Text style={styles.cart_Text_One}>{item.price.toLocaleString('vi-VN')} ₫</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity onPress={() => {}}>
                <MaterialIcons name="delete" size={25} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 20,
  },
  //HeaderCart
  headerCart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: height * 0.12,
  },
  headerCart_Text: {
    fontSize: 22,
    fontWeight: "bold",
  },
  //Body
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
    fontSize: 16,
  },

  cart_Text_Three: {
    fontSize: 15,
  },
  checkoutContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  //footer
  checkoutBackground: {
    marginTop: 40,
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
