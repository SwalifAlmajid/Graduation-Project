import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const Colors = {
  primary: "#4A6741",
  secondary: "#F5F5DC",
  accent: "#8DA47E",
  white: "#FFFFFF",
  text: "#333333",
  muted: "#9A9A9A",
  border: "#E5E5E5",
  danger: "#E74C3C",
};

const initialProducts = [
  {
    id: "1",
    name: "سبانخ محلية",
    subtitle: "سبانخ طازجة محلية",
    price: 2.2,
    weight: "1kg",
    category: "خضار",
    organic: true,
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "موز",
    subtitle: "حوالي 7 قطع/1kg",
    price: 3.2,
    weight: "1kg",
    category: "فواكه",
    organic: true,
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e37f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "خس",
    subtitle: "خس طازج",
    price: 1.0,
    weight: "1kg",
    category: "خضار",
    organic: false,
    image:
      "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "تفاح أحمر",
    subtitle: "حوالي 6 قطع/1kg",
    price: 5.0,
    weight: "1kg",
    category: "فواكه",
    organic: true,
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "تمر سكري",
    subtitle: "تمر طازج محلي",
    price: 9.5,
    weight: "1kg",
    category: "تمور",
    organic: true,
    image:
      "https://images.unsplash.com/photo-1603048719539-9ecb7bd1f5ba?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "طماطم",
    subtitle: "طماطم حمراء طازجة",
    price: 2.8,
    weight: "1kg",
    category: "خضار",
    organic: false,
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function ProductsScreen() {
  const params = useLocalSearchParams();
  const initialQuery = typeof params.q === "string" ? params.q : "";

  const [search, setSearch] = useState(initialQuery);
  const [sortType, setSortType] = useState("default");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState({});

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (search.trim()) {
      result = result.filter(
        (item) =>
          item.name.includes(search) ||
          item.subtitle.includes(search) ||
          item.category.includes(search),
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
  }, [search, sortType, organicOnly]);

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

      return {
        ...prev,
        [id]: current - 1,
      };
    });
  };

  const getQty = (id) => cart[id] || 0;

  const total = useMemo(() => {
    return initialProducts.reduce((sum, item) => {
      const qty = cart[item.id] || 0;
      return sum + qty * item.price;
    }, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

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

      <Image source={{ uri: item.image }} style={styles.productImage} />

      <View style={styles.info}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSubtitle}>{item.subtitle}</Text>
        <Text style={styles.productWeight}>
          {item.weight} {item.organic ? "• عضوي" : ""}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>﷼ {item.price.toFixed(2)}</Text>

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
        <Text style={styles.title}>البحث عن المنتجات</Text>

        <View style={styles.searchBox}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="ابحث عن المنتجات..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            textAlign="right"
          />
          <Ionicons name="search" size={20} color={Colors.primary} />
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              sortType === "default" && styles.activeFilterBtn,
            ]}
            onPress={() => setSortType("default")}
          >
            <Text
              style={[
                styles.filterText,
                sortType === "default" && styles.activeFilterText,
              ]}
            >
              افتراضي
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              sortType === "priceHigh" && styles.activeFilterBtn,
            ]}
            onPress={() => setSortType("priceHigh")}
          >
            <Text
              style={[
                styles.filterText,
                sortType === "priceHigh" && styles.activeFilterText,
              ]}
            >
              الأغلى
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              sortType === "priceLow" && styles.activeFilterBtn,
            ]}
            onPress={() => setSortType("priceLow")}
          >
            <Text
              style={[
                styles.filterText,
                sortType === "priceLow" && styles.activeFilterText,
              ]}
            >
              الأرخص
            </Text>
          </TouchableOpacity>

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

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        {totalItems > 0 && (
          <TouchableOpacity style={styles.cartBar}>
            <Text style={styles.cartBarText}>عرض السلة</Text>
            <Text style={styles.cartBarText}>{total.toFixed(2)} ريال</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  greenHeader: {
    height: 90,
    backgroundColor: Colors.primary,
  },

  page: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -20,
    paddingTop: 10,
    paddingHorizontal: 14,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
    marginBottom: 14,
  },

  searchBox: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.text,
  },

  filterRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    marginBottom: 14,
  },

  filterBtn: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  activeFilterBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  filterText: {
    color: Colors.text,
    fontWeight: "600",
  },

  activeFilterText: {
    color: Colors.white,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  card: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    position: "relative",
  },

  favoriteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "rgba (255,255,255,0.9)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  productImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 8,
  },

  info: {
    alignItems: "flex-end",
  },

  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
  },

  productSubtitle: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
    textAlign: "right",
  },

  productWeight: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
    textAlign: "right",
  },

  bottomRow: {
    width: "100%",
    marginTop: 8,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },

  qtyRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  qtyBtn: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginHorizontal: 6,
  },

  qtyText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    minWidth: 18,
    textAlign: "center",
  },

  cartBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cartBarText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
