import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  LayoutAnimation,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const initialCart = [
  {
    id: "1",
    name: "Fresh Apples",
    price: 0,
    quantity: 1,
    image: "https://via.placeholder.com/80",
  },
  {
    id: "2",
    name: "Organic Honey",
    price: 25,
    quantity: 2,
    image: "https://via.placeholder.com/80",
  },
];

const QuantityButton = ({ item, decreaseQty, removeItem }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [item.quantity]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {item.quantity > 1 ? (
        <TouchableOpacity
          onPress={() => decreaseQty(item.id)}
          style={styles.qtyBtn}
        >
          <Ionicons name="remove" size={22} color="#4A6741" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => removeItem(item.id)}
          style={styles.trashBtn}
        >
          <Ionicons name="trash-outline" size={20} color="#D9534F" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default function Cart() {
  const [cart, setCart] = useState(initialCart);
  const navigation = useNavigation();

  const increaseQty = (id) => {
    LayoutAnimation.easeInEaseOut();
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    LayoutAnimation.easeInEaseOut();
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    LayoutAnimation.easeInEaseOut();
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          {/* Subtotal in subtle gray */}
          <Text style={styles.subtotal}>
            {item.price * item.quantity} SAR
          </Text>
        </View>

        <View style={styles.qtyBox}>
          <QuantityButton
            item={item}
            decreaseQty={decreaseQty}
            removeItem={removeItem}
          />
          <Text style={styles.qtyNumber}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => increaseQty(item.id)}
            style={styles.qtyBtn}
          >
            <Ionicons name="add" size={22} color="#4A6741" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.separator} />
    </View>
  );

  if (cart.length === 0) {
    return (
      <View style={styles.background}>
        <View style={styles.whiteContainer}>
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <View style={styles.whiteContainer}>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.cartCount}>
          {cart.length} items in your cart
        </Text>

        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 140 }}
        />

        <View style={styles.footer}>
          <Text style={styles.total}>Total: {total} SAR</Text>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate("checkout")}
          >
            <Text style={styles.checkoutText}>
              Checkout ({cart.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#63a775",
    paddingTop: 40,
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },

  cartCount: {
    color: "#777",
    marginBottom: 14,
  },

  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 12,
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
  },

  subtotal: {
    fontWeight: "400",
    color: "#777", // subtle gray like delivery apps
    fontSize: 14,
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  qtyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  qtyNumber: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
  },

  trashBtn: {
    marginRight: 4,
  },

  separator: {
    height: 1,
    backgroundColor: "#eee",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  total: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  checkoutBtn: {
    backgroundColor: "#4A6741",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 18,
    color: "#777",
    marginTop: 10,
  },
});