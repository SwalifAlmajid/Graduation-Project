import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
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
  gold: "#F4C542",
  danger: "#E74C3C",
  light: "#DCEBDD",
  muted: "#8A8A8A",
  border: "#E5E5E5",
};

const farmProducts = [
  {
    id: "1",
    name: "طماطم",
    subtitle: "حوالي 6 قطع/كجم",
    weight: "1kg",
    price: 5.0,
    organic: true,
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop",
    description: "طماطم طازجة يومية من المزرعة، مناسبة للسلطات والطبخ.",
  },
  {
    id: "2",
    name: "بروكلي",
    subtitle: "حوالي 7 قطع/كجم",
    weight: "1kg",
    price: 9.0,
    organic: true,
    image:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=1200&auto=format&fit=crop",
    description: "بروكلي طازج عالي الجودة وغني بالعناصر الغذائية.",
  },
  {
    id: "3",
    name: "خيار",
    subtitle: "حوالي 8 قطع/كجم",
    weight: "1kg",
    price: 4.0,
    organic: false,
    image:
      "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?q=80&w=1200&auto=format&fit=crop",
    description: "خيار طازج ومقرمش من المزرعة مباشرة.",
  },
  {
    id: "4",
    name: "فلفل أخضر",
    subtitle: "حوالي 10 قطع/كجم",
    weight: "1kg",
    price: 6.5,
    organic: true,
    image: "https://share.google/fxl16imKPozLTZGub",
    description: "فلفل أخضر طازج مناسب للطبخ والسلطات.",
  },
  {
    id: "5",
    name: "جزر",
    subtitle: "حوالي 9 قطع/كجم",
    weight: "1kg",
    price: 4.5,
    organic: true,
    image: "https://share.google/CRUqPFJRqC3z75sYC",
    description: "جزر طازج حلو المذاق وغني بالفيتامينات.",
  },
  {
    id: "6",
    name: "خس",
    subtitle: "حوالي 2 رأس/كجم",
    weight: "1kg",
    price: 3.8,
    organic: false,
    image:
      "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=1200&auto=format&fit=crop",
    description: "خس طازج مناسب للسلطات والسندويتشات.",
  },
  {
    id: "7",
    name: "بطاطس",
    subtitle: "حوالي 8 قطع/كجم",
    weight: "1kg",
    price: 3.2,
    organic: false,
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1200&auto=format&fit=crop",
    description: "بطاطس طازجة ممتازة للقلي والطبخ.",
  },
  {
    id: "8",
    name: "باذنجان",
    subtitle: "حوالي 5 قطع/كجم",
    weight: "1kg",
    price: 5.5,
    organic: true,
    image: "https://share.google/Q6QSG2etalS8j9RFG",
    description: "باذنجان طازج مناسب للمقليات والطبخ.",
  },
];

export default function FarmScreen() {
  const params = useLocalSearchParams();

  const farmName = params.name || "مزرعة البساتين";
  const farmImage =
    params.image ||
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop";
  const farmRating = params.rating || "4.7";
  const farmDistance = params.distance || "2.2";

  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalQty, setModalQty] = useState(1);

  const filteredProducts = useMemo(() => {
    let result = [...farmProducts];

    if (search.trim()) {
      result = result.filter(
        (item) =>
          item.name.includes(search) ||
          item.subtitle.includes(search) ||
          item.description.includes(search),
      );
    }

    return result;
  }, [search]);

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
    return farmProducts.reduce((sum, item) => {
      const qty = cart[item.id] || 0;
      return sum + qty * item.price;
    }, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalQty(1);
    setShowModal(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const addModalToCart = () => {
    if (!selectedProduct) return;

    setCart((prev) => ({
      ...prev,
      [selectedProduct.id]: (prev[selectedProduct.id] || 0) + modalQty,
    }));

    closeProductModal();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.greenHeader} />

      <View style={styles.page}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>

          <Image source={{ uri: farmImage }} style={styles.heroImage} />

          <View style={styles.farmInfoCard}>
            <View style={styles.infoLeft}>
              <View style={styles.rowItem}>
                <Ionicons name="star" size={20} color={Colors.gold} />
                <Text style={styles.leftText}>{farmRating}</Text>
              </View>

              <View style={styles.rowItem}>
                <Ionicons name="location" size={20} color={Colors.primary} />
                <Text style={styles.leftText}>{farmDistance} كم</Text>
              </View>

              <TouchableOpacity style={styles.favoriteFarmRow}>
                <Ionicons name="heart" size={18} color={Colors.danger} />
                <Text style={styles.favoriteFarmText}>إضافة للمفضلة</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoRight}>
              <Text style={styles.farmName}>{farmName}</Text>
              <Text style={styles.farmDesc}>
                مزرعة متخصصة في بيع الخضروات العضوية والمنتجات الطازجة
              </Text>
              <Text style={styles.sinceText}>منذ 2012</Text>
            </View>
          </View>

          <Text style={styles.productsTitle}>البحث عن المنتجات</Text>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={22} color={Colors.text} />
            <TextInput
              placeholder="ابحث عن الفواكه، الخضروات..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              textAlign="right"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View style={styles.productsGrid}>
            {filteredProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productCard}
                activeOpacity={0.9}
                onPress={() => openProductModal(item)}
              >
                <TouchableOpacity
                  style={styles.favoriteBtn}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Ionicons
                    name={
                      favorites.includes(item.id) ? "heart" : "heart-outline"
                    }
                    size={20}
                    color={Colors.danger}
                  />
                </TouchableOpacity>

                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />

                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productSubtitle}>{item.subtitle}</Text>
                <Text style={styles.productPrice}>
                  ﷼ {item.price.toFixed(2)}
                </Text>

                <View style={styles.qtyRow}>
                  <TouchableOpacity onPress={() => increaseQty(item.id)}>
                    <Text style={styles.qtyBtn}>+</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyText}>{getQty(item.id)}</Text>

                  <TouchableOpacity onPress={() => decreaseQty(item.id)}>
                    <Text style={styles.qtyBtn}>−</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {totalItems > 0 && (
          <TouchableOpacity style={styles.cartBar}>
            <Text style={styles.cartBarText}>عرض السلة</Text>
            <Text style={styles.cartBarText}>﷼ {total.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={closeProductModal}
            >
              <Ionicons name="close" size={26} color={Colors.text} />
            </TouchableOpacity>

            {selectedProduct && (
              <>
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={styles.modalImage}
                />

                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                <Text style={styles.modalDesc}>
                  {selectedProduct.description}
                </Text>
                <Text style={styles.modalMeta}>
                  {selectedProduct.weight} •{" "}
                  {selectedProduct.organic ? "عضوي" : "عادي"}
                </Text>

                <View style={styles.modalBottomRow}>
                  <View style={styles.modalQtyRow}>
                    <TouchableOpacity
                      onPress={() =>
                        setModalQty((prev) => (prev > 1 ? prev - 1 : 1))
                      }
                    >
                      <Text style={styles.qtyBtn}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{modalQty}</Text>

                    <TouchableOpacity
                      onPress={() => setModalQty((prev) => prev + 1)}
                    >
                      <Text style={styles.qtyBtn}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.modalPrice}>
                    ﷼ {(selectedProduct.price * modalQty).toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={addModalToCart}
                >
                  <Text style={styles.addBtnText}>إضافة إلى السلة</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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

  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  heroImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignSelf: "center",
    marginBottom: 14,
  },

  farmInfoCard: {
    backgroundColor: Colors.light,
    borderRadius: 28,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  infoLeft: {
    justifyContent: "space-between",
    minWidth: 110,
  },

  infoRight: {
    flex: 1,
    alignItems: "flex-end",
    marginLeft: 14,
  },

  rowItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
  },

  leftText: {
    marginHorizontal: 6,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },

  farmName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "right",
  },

  farmDesc: {
    marginTop: 6,
    fontSize: 15,
    color: Colors.text,
    textAlign: "right",
    lineHeight: 22,
  },

  sinceText: {
    marginTop: 8,
    fontSize: 15,
    color: Colors.muted,
    textAlign: "right",
  },

  favoriteFarmRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  favoriteFarmText: {
    marginRight: 6,
    fontSize: 14,
    color: Colors.text,
  },

  productsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
    marginBottom: 10,
  },

  searchBox: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 14,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: Colors.text,
    marginRight: 8,
  },

  productsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  productCard: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 8,
    marginBottom: 14,
    overflow: "hidden",
  },

  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  productImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 8,
  },

  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
  },

  productSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.muted,
    textAlign: "right",
  },

  productPrice: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "right",
  },

  qtyRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "flex-start",
  },

  qtyBtn: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginHorizontal: 8,
  },

  qtyText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    minWidth: 20,
    textAlign: "center",
  },

  cartBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: 22,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    minHeight: 430,
  },

  closeBtn: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  modalImage: {
    width: "100%",
    height: 210,
    borderRadius: 16,
    resizeMode: "cover",
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "right",
  },

  modalDesc: {
    marginTop: 8,
    fontSize: 15,
    color: Colors.text,
    textAlign: "right",
    lineHeight: 24,
  },

  modalMeta: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.muted,
    textAlign: "right",
  },

  modalBottomRow: {
    marginTop: 18,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalQtyRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  modalPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
  },

  addBtn: {
    marginTop: 22,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },

  addBtnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
