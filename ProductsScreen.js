import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "./firebase"; // ✅ make sure this path points to your firebase.js config

export const Colors = {
  primary: "#4A6741",
  secondary: "#F5F5DC",
  accent: "#8DA47E",
  white: "#FFFFFF",
  text: "#333333",
  muted: "#9A9A9A",
  border: "#E5E5E5",
  danger: "#E74C3C",
};

export default function ProductsScreen() {
  const { farmId, farmName } = useLocalSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("default");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState({});

  // ✅ Fetch products for that specific farm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "Products");
        const q = query(productsRef, where("farmId", "==", farmId));
        const snapshot = await getDocs(q);

        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (farmId) fetchProducts();
  }, [farmId]);

  // 🔎 Filter/sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter(
        (item) =>
          item.name?.includes(search) ||
          item.subtitle?.includes(search) ||
          item.category?.includes(search),
      );
    }

    if (organicOnly) {
      result = result.filter((item) => item.organic);
    }

    if (sortType === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortType === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [products, search, sortType, organicOnly]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const increaseQty = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const getQty = (id) => cart[id] || 0;

  const total = useMemo(() => {
    return products.reduce((sum, item) => {
      const qty = cart[item.id] || 0;
      return sum + qty * item.price;
    }, 0);
  }, [cart, products]);

  const totalItems = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => toggleFavorite(item.id)}
      >
        <Ionicons
          name={favorites.includes(item.id) ? "heart" : "heart-outline"}
          size={20}
          color={Colors.danger}
        />
      </TouchableOpacity>

      <Image
        source={{
          uri:
            item.image ||
            "[images.unsplash.com](https://images.unsplash.com/photo-1602524206271-6e755eef6dc3?auto=format&fit=crop&w=800&q=80)",
        }}
        style={styles.productImage}
      />

      <View style={styles.info}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSubtitle}>{item.subtitle}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>﷼ {item.price?.toFixed(2) || "—"}</Text>

          <View style={styles.qtyRow}>
            <TouchableOpacity onPress={() => decreaseQty(item.id)}>
              <Text style={styles.qtyBtn}>−</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{getQty(item.id)}</Text>

            <TouchableOpacity onPress={() => increaseQty(item.id)}>
              <Text style={styles.qtyBtn}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.greenHeader} />

      <View style={styles.page}>
        <Text style={styles.title}>
          منتجات {farmName ? `«${farmName}»` : ""}
        </Text>

        {/* 🔍 Search bar */}
        <View style={styles.searchBox}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="ابحث عن المنتجات..."
            style={styles.searchInput}
            textAlign="right"
          />
          <Ionicons name="search" size={20} color="black" />
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {[
            { label: "افتراضي", key: "default" },
            { label: "الأغلى", key: "priceHigh" },
            { label: "الأرخص", key: "priceLow" },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterBtn,
                sortType === filter.key && styles.activeFilterBtn,
              ]}
              onPress={() => setSortType(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  sortType === filter.key && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.filterBtn, organicOnly && styles.activeFilterBtn]}
            onPress={() => setOrganicOnly(!organicOnly)}
          >
            <Text
              style={[
                styles.filterText,
                organicOnly && styles.activeFilterText,
              ]}
            >
              عضوي فقط
            </Text>
          </TouchableOpacity>
        </View>

        {/* Product grid */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        {/* Cart summary */}
        {totalItems > 0 && (
          <TouchableOpacity
            style={styles.cartBar}
            onPress={() => router.push("/cart")}
          >
            <Text style={styles.cartBarText}>{totalItems} منتجات</Text>
            <Text style={styles.cartBarText}>{totalPrice.toFixed(2)} ريال</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
