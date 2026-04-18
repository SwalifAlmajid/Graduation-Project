import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  onSnapshot,
} from "@react-native-firebase/firestore";

const Colors = {
  primary: "#69B072",
  primaryDark: "#4A6741",
  white: "#FFFFFF",
  text: "#2E2E2E",
  muted: "#9B9B9B",
  border: "#E8E8E8",
  danger: "#E74C3C",
  bg: "#FFFFFF",
  softGreen: "#EDF7EE",
  softOrange: "#FFF4E8",
  softBlue: "#EEF4FF",
  gold: "#E4AC45",
  activeGreen: "#5DAE63",
};

export default function App() {
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("default");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState({});
  const [cartVisible, setCartVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFrequent, setSelectedFrequent] = useState(null);

  const [products, setProducts] = useState([]);
  const [frequentItems, setFrequentItems] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();

    const unsubProducts = onSnapshot(
      collection(db, "Products"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(list);
      },
      (error) => {
        console.log("Products error:", error);
        Alert.alert("خطأ", "تعذر جلب المنتجات");
      }
    );

    const unsubFrequent = onSnapshot(
      collection(db, "FrequentItems"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFrequentItems(list);
      },
      (error) => {
        console.log("FrequentItems error:", error);
      }
    );

    const unsubOffers = onSnapshot(
      collection(db, "Offers"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOffers(list);
        setLoading(false);
      },
      (error) => {
        console.log("Offers error:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubProducts();
      unsubFrequent();
      unsubOffers();
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter(
        (item) =>
          (item.name || "").includes(search) ||
          (item.subtitle || "").includes(search) ||
          (item.category || "").includes(search)
      );
    }

    if (organicOnly) {
      result = result.filter((item) => item.organic);
    }

    if (sortType === "priceHigh") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortType === "priceLow") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    return result;
  }, [search, sortType, organicOnly, products]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
      return sum + qty * (item.price || 0);
    }, 0);
  }, [cart, products]);

  const totalItems = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const cartItems = useMemo(() => {
    return products.filter((item) => cart[item.id]);
  }, [cart, products]);

  const onBackPress = () => {
    Alert.alert("رجوع", "زر الرجوع اشتغل");
  };

  const onProductPress = (item) => {
    setSelectedProduct(item);
  };

  const onFrequentPress = (item) => {
    setSelectedFrequent(item);
  };

  const onOfferPress = (item) => {
    const matched = products.find((p) => (p.name || "").includes(item.product));
    if (matched) {
      increaseQty(matched.id);
      Alert.alert("تمت الإضافة", `تمت إضافة ${matched.name} من العرض`);
    }
  };

  const addFrequentToCart = () => {
    if (!selectedFrequent) return;
    increaseQty(selectedFrequent.productId);
    setSelectedFrequent(null);
  };

  const renderHeader = () => (
    <>
      <Text style={styles.title}>البحث عن المنتجات</Text>

      <View style={styles.searchBox}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="ابحث عن الفواكه، الخضراوات..."
          placeholderTextColor="#A3A3A3"
          style={styles.searchInput}
          textAlign="right"
        />
        <Ionicons name="search" size={20} color={Colors.muted} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>الأشياء اللي تطلبها كثير</Text>
        <Ionicons name="sparkles-outline" size={18} color={Colors.primaryDark} />
      </View>

      <FlatList
        data={frequentItems}
        horizontal
        inverted
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickList}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => onFrequentPress(item)}
            style={[styles.quickCard, { backgroundColor: item.bg || Colors.softGreen }]}
          >
            <Image source={{ uri: item.image }} style={styles.quickImage} />
            <View style={styles.quickTextWrap}>
              <View style={styles.quickTopRow}>
                <View style={styles.quickMiniBadge}>
                  <Text style={styles.quickMiniBadgeText}>الأكثر طلبًا</Text>
                </View>
                <Text style={styles.quickFarm}>من {item.farm}</Text>
              </View>

              <Text style={styles.quickName}>{item.name}</Text>
              <Text style={styles.quickHint}>{item.note}</Text>
              <Text style={styles.quickDetails} numberOfLines={2}>
                {item.details}
              </Text>
              <Text style={styles.quickPrice}>﷼ {(item.price || 0).toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>العروض</Text>
        <Ionicons name="pricetags-outline" size={18} color={Colors.primaryDark} />
      </View>

      <Text style={styles.sectionDescription}>
        لأنك تطلب خيار كثير، جبنا لك المزارع اللي عندها عروض عليه
      </Text>

      <FlatList
        data={offers}
        horizontal
        inverted
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.offerList}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onOfferPress(item)}
            style={styles.offerCard}
          >
            <Image source={{ uri: item.image }} style={styles.offerImage} />
            <View style={styles.offerInfo}>
              <Text style={styles.offerFarm}>{item.farm}</Text>
              <Text style={styles.offerProduct}>
                عرض على <Text style={styles.offerProductBold}>{item.product}</Text>
              </Text>

              <View style={styles.offerBottomRow}>
                <TouchableOpacity
                  style={styles.offerAddBtn}
                  onPress={() => onOfferPress(item)}
                >
                  <Ionicons name="cart-outline" size={14} color="#fff" />
                  <Text style={styles.offerAddText}>إضافة</Text>
                </TouchableOpacity>

                <Text style={styles.offerPrice}>{item.price}</Text>
                <Text style={styles.offerDiscount}>{item.discount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.mainProductsTitle}>كل المنتجات</Text>

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
    </>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.92}
      style={styles.card}
      onPress={() => onProductPress(item)}
    >
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
          <Text style={styles.price}>﷼ {(item.price || 0).toFixed(2)}</Text>

          <View style={styles.actionsMiniRow}>
            {getQty(item.id) > 0 && (
              <TouchableOpacity
                style={styles.minusBtn}
                onPress={() => decreaseQty(item.id)}
              >
                <Ionicons name="remove" size={16} color="#fff" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => increaseQty(item.id)}
            >
              <Ionicons name="cart-outline" size={18} color="#fff" />
              <Text style={styles.addText}>
                {getQty(item.id) > 0 ? `إضافة (${getQty(item.id)})` : "إضافة"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeTop} />
      <View style={styles.greenHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => setCartVisible(true)}
        >
          <Ionicons name="cart" size={22} color="#fff" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalItems}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.page}>
        {loading ? (
          <View style={{ paddingTop: 30 }}>
            <ActivityIndicator size="large" color={Colors.activeGreen} />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={renderProduct}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
            contentContainerStyle={styles.listContent}
          />
        )}

        {totalItems > 0 && (
          <TouchableOpacity
            style={styles.cartBar}
            onPress={() => setCartVisible(true)}
          >
            <Text style={styles.cartBarText}>عرض السلة</Text>
            <Text style={styles.cartBarText}>{total.toFixed(2)} ريال</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={cartVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCartVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cartModal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setCartVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>السلة</Text>
            </View>

            {cartItems.length === 0 ? (
              <Text style={styles.emptyCartText}>السلة فارغة</Text>
            ) : (
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.cartItem}>
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemMeta}>
                        الكمية: {cart[item.id]} × {(item.price || 0).toFixed(2)} ريال
                      </Text>
                    </View>
                    <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                  </View>
                )}
              />
            )}

            <View style={styles.modalFooter}>
              <Text style={styles.modalTotal}>الإجمالي: {total.toFixed(2)} ريال</Text>
              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => Alert.alert("تم", "تم فتح صفحة الدفع")}
              >
                <Text style={styles.checkoutText}>إتمام الطلب</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!selectedProduct}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setSelectedProduct(null)}
        >
          {selectedProduct && (
            <View style={styles.productModal}>
              <Image
                source={{ uri: selectedProduct.image }}
                style={styles.productModalImage}
              />
              <Text style={styles.productModalName}>{selectedProduct.name}</Text>
              <Text style={styles.productModalSub}>{selectedProduct.subtitle}</Text>
              <Text style={styles.productModalPrice}>
                ﷼ {(selectedProduct.price || 0).toFixed(2)}
              </Text>

              <TouchableOpacity
                style={styles.productModalBtn}
                onPress={() => {
                  increaseQty(selectedProduct.id);
                  setSelectedProduct(null);
                }}
              >
                <Text style={styles.productModalBtnText}>إضافة للسلة</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={!!selectedFrequent}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedFrequent(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setSelectedFrequent(null)}
        >
          {selectedFrequent && (
            <View style={styles.productModal}>
              <Image
                source={{ uri: selectedFrequent.image }}
                style={styles.productModalImage}
              />
              <Text style={styles.productModalName}>{selectedFrequent.name}</Text>
              <Text style={styles.frequentFarmText}>من {selectedFrequent.farm}</Text>
              <Text style={styles.productModalSub}>{selectedFrequent.details}</Text>
              <Text style={styles.productModalPrice}>
                ﷼ {(selectedFrequent.price || 0).toFixed(2)}
              </Text>

              <TouchableOpacity
                style={styles.productModalBtn}
                onPress={addFrequentToCart}
              >
                <Text style={styles.productModalBtnText}>إضافة للسلة</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  safeTop: {
    backgroundColor: Colors.primary,
  },
  greenHeader: {
    height: 105,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: "flex-start",
  },
  backBtn: {
    marginTop: 2,
    alignSelf: "flex-start",
  },
  cartIcon: {
    position: "absolute",
    right: 16,
    top: 24,
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  page: {
    flex: 1,
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -35,
    overflow: "hidden",
  },
  flatList: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  listContent: {
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 140,
    flexGrow: 1,
    backgroundColor: Colors.bg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
    marginBottom: 14,
  },
  searchBox: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 18,
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
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
  },
  sectionDescription: {
    fontSize: 13,
    color: Colors.muted,
    textAlign: "right",
    marginBottom: 12,
    lineHeight: 20,
  },
  quickList: {
    paddingTop: 4,
    paddingBottom: 16,
  },
  quickCard: {
    width: 210,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  quickImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  quickTextWrap: {
    padding: 12,
    alignItems: "flex-end",
  },
  quickTopRow: {
    width: "100%",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  quickMiniBadge: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  quickMiniBadgeText: {
    fontSize: 10,
    color: Colors.primaryDark,
    fontWeight: "700",
  },
  quickFarm: {
    fontSize: 11,
    color: Colors.muted,
    fontWeight: "600",
  },
  quickName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
  },
  quickHint: {
    fontSize: 12,
    color: Colors.muted,
    textAlign: "right",
    marginTop: 4,
  },
  quickDetails: {
    fontSize: 12,
    color: Colors.text,
    textAlign: "right",
    marginTop: 6,
    lineHeight: 18,
  },
  quickPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primaryDark,
    marginTop: 8,
    textAlign: "right",
    alignSelf: "flex-end",
  },
  offerList: {
    paddingTop: 2,
    paddingBottom: 16,
  },
  offerCard: {
    width: 290,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  offerImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  offerInfo: {
    padding: 14,
  },
  offerFarm: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
    marginBottom: 8,
  },
  offerProduct: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: "right",
    marginBottom: 14,
  },
  offerProductBold: {
    color: Colors.text,
    fontWeight: "700",
  },
  offerBottomRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  offerPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
    textAlign: "center",
  },
  offerDiscount: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.gold,
    minWidth: 80,
    textAlign: "left",
  },
  offerAddBtn: {
    backgroundColor: Colors.activeGreen,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
    minWidth: 78,
  },
  offerAddText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  mainProductsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    marginBottom: 16,
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
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
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
    borderRadius: 16,
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
    backgroundColor: "rgba(255,255,255,0.95)",
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
    fontSize: 17,
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
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
    marginBottom: 8,
  },
  actionsMiniRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  minusBtn: {
    backgroundColor: Colors.danger,
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    flex: 1,
    backgroundColor: Colors.activeGreen,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  addText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  cartBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.activeGreen,
    borderRadius: 22,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
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
  cartModal: {
    height: "70%",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
  },
  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  emptyCartText: {
    textAlign: "center",
    color: Colors.muted,
    fontSize: 16,
    marginTop: 40,
  },
  cartItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },
  cartItemInfo: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 12,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  cartItemMeta: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 4,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  modalFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
  },
  modalTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
    marginBottom: 12,
  },
  checkoutBtn: {
    backgroundColor: Colors.activeGreen,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  productModal: {
    backgroundColor: Colors.white,
    margin: 20,
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
  },
  productModalImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 14,
  },
  productModalName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  frequentFarmText: {
    fontSize: 14,
    color: Colors.primaryDark,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  productModalSub: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
  productModalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primaryDark,
    marginTop: 12,
    marginBottom: 16,
  },
  productModalBtn: {
    backgroundColor: Colors.activeGreen,
    width: "100%",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  productModalBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
