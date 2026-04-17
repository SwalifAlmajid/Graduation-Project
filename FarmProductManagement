import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "@react-native-firebase/firestore";

export default function ProductManagementScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeBottom, setActiveBottom] = useState("products");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user || null);
      if (!user) {
        setOffers([]);
        setLoading(false);
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!firebaseUser?.uid) return;

    const db = getFirestore();
    const productsRef = collection(db, "Products");
    const q = query(productsRef, where("farmerId", "==", firebaseUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            docId: docSnap.id,
            id: data.id || docSnap.id,
            statusKey: data.statusKey || "draft",
            statusLabel: data.statusLabel || "مسودة",
            title: data.title || "",
            date: data.date || "",
            oldPrice: data.oldPrice || "",
            newPrice: data.newPrice || "",
            sold: data.sold || "",
            category: data.category || "",
            emoji1: data.emoji1 || "🍅",
            emoji2: data.emoji2 || "",
            full: data.full ?? true,
          };
        });

        setOffers(list);
        setLoading(false);
      },
      (error) => {
        console.log("Products Firestore error:", error);
        Alert.alert("خطأ", "تعذر جلب المنتجات");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [firebaseUser]);

  const handleSaveEdit = async (updatedOffer) => {
    try {
      const db = getFirestore();
      await updateDoc(doc(db, "Products", updatedOffer.docId), {
        statusKey: updatedOffer.statusKey,
        statusLabel: updatedOffer.statusLabel,
        title: updatedOffer.title,
        date: updatedOffer.date,
        oldPrice: updatedOffer.oldPrice,
        newPrice: updatedOffer.newPrice,
        sold: updatedOffer.sold,
        category: updatedOffer.category,
        emoji1: updatedOffer.emoji1,
        emoji2: updatedOffer.emoji2,
        full: updatedOffer.full,
      });
    } catch (error) {
      console.log("Save product error:", error);
      Alert.alert("خطأ", "تعذر حفظ التعديلات");
    }
  };

  const handleStopOffer = async (offerId) => {
    try {
      const target = offers.find((item) => item.id === offerId);
      if (!target?.docId) return;

      const db = getFirestore();
      await updateDoc(doc(db, "Products", target.docId), {
        statusKey: "ended",
        statusLabel: "منتهية",
      });
    } catch (error) {
      console.log("Stop product error:", error);
      Alert.alert("خطأ", "تعذر إيقاف العرض");
    }
  };

  const filteredOffers = useMemo(() => {
    switch (activeTab) {
      case "active":
        return offers.filter((item) => item.statusKey === "active");
      case "ended":
        return offers.filter((item) => item.statusKey === "ended");
      case "draft":
        return offers.filter((item) => item.statusKey === "draft");
      default:
        return offers;
    }
  }, [activeTab, offers]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greenHeader}>
        <View style={styles.headerTop}>
          <View style={styles.leftHeader}>
            <TouchableOpacity style={styles.iconCircleSmall}>
              <Ionicons name="arrow-back" size={16} color="#1E1E1E" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconCircleBell}>
              <Ionicons name="notifications" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.brandRow}>
            <Text style={styles.brandText}>حصاد</Text>

            <View style={styles.leafBadge}>
              <Ionicons name="leaf" size={11} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.titleRow}>
        <TouchableOpacity style={styles.titleIconWrap}>
          <Ionicons name="stats-chart" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>إدارة المنتجات</Text>
      </View>

      <View style={styles.sheet}>
        {loading ? (
          <View style={{ paddingTop: 30 }}>
            <ActivityIndicator size="large" color="#4FAF5B" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.statsGrid}>
              <StatCard
                label="في الانتظار"
                value={`${offers.filter((i) => i.statusKey === "draft").length}`}
                icon="time"
                iconColor="#5D8EF7"
                iconBg="#EDF2FF"
              />
              <StatCard
                label="العروض النشطة"
                value={`${offers.filter((i) => i.statusKey === "active").length}`}
                icon="pricetag"
                iconColor="#67B96E"
                iconBg="#EEF8EF"
              />
              <StatCard
                label="الإيرادات"
                value="18,250"
                icon="cash"
                iconColor="#49B55B"
                iconBg="#EBF8EE"
              />
              <StatCard
                label="المبيعات"
                value="2,450"
                icon="stats-chart"
                iconColor="#F0B23E"
                iconBg="#FFF5E7"
              />
            </View>

            <View style={styles.tabsRow}>
              <Tab
                text="مسودة"
                active={activeTab === "draft"}
                onPress={() => setActiveTab("draft")}
              />
              <Tab
                text="منتهية"
                active={activeTab === "ended"}
                onPress={() => setActiveTab("ended")}
                medium
              />
              <Tab
                text="نشطة"
                active={activeTab === "active"}
                onPress={() => setActiveTab("active")}
                medium
              />
              <Tab
                text="جميع العروض"
                active={activeTab === "all"}
                onPress={() => setActiveTab("all")}
                wide
              />
            </View>

            {filteredOffers.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20, color: "#8E8E8E" }}>
                لا توجد عروض
              </Text>
            ) : (
              filteredOffers.map((offer, index) => (
                <OfferCard
                  key={offer.docId}
                  offer={offer}
                  first={index === 0}
                  onSave={handleSaveEdit}
                  onStop={handleStopOffer}
                />
              ))
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.bottomNav}>
        <NavItem
          icon="person"
          label="الحساب"
          active={activeBottom === "account"}
          onPress={() => setActiveBottom("account")}
        />

        <NavItem
          icon="bar-chart"
          label="الإحصائيات"
          active={activeBottom === "stats"}
          onPress={() => setActiveBottom("stats")}
        />

        <View style={styles.fabSlot}>
          <TouchableOpacity style={styles.fab}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <NavItem
          icon="pricetag"
          label="المنتجات"
          active={activeBottom === "products"}
          onPress={() => setActiveBottom("products")}
        />

        <NavItem
          icon="home"
          label="الرئيسية"
          active={activeBottom === "home"}
          onPress={() => setActiveBottom("home")}
        />
      </View>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon, iconColor, iconBg }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTopRow}>
        <View style={[styles.statIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>

        <Text style={styles.statLabel}>{label}</Text>
      </View>

      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function Tab({ text, active, onPress, wide, medium }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tab,
        wide && styles.tabWide,
        medium && styles.tabMedium,
        active && styles.activeTab,
      ]}
    >
      <Text style={[styles.tabText, active && styles.activeTabText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

function OfferCard({ offer, first = false, onSave, onStop }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(offer);

  useEffect(() => {
    setDraft(offer);
  }, [offer]);

  const startEdit = () => {
    setDraft(offer);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(offer);
    setIsEditing(false);
  };

  const saveEdit = () => {
    onSave(draft);
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const data = isEditing ? draft : offer;
  const showStatus =
    offer.statusKey === "active" ||
    offer.statusKey === "ending" ||
    offer.statusKey === "ended";

  return (
    <View style={[styles.offerCard, first && styles.firstOfferCard]}>
      <TouchableOpacity style={styles.moreBtn}>
        <Entypo name="dots-three-vertical" size={11} color="#A7A7A7" />
      </TouchableOpacity>

      {offer.full && (
        <TouchableOpacity style={styles.deleteBtn}>
          <Ionicons name="trash" size={14} color="#F25555" />
        </TouchableOpacity>
      )}

      <View style={styles.offerContent}>
        <View style={styles.offerTopRow}>
          <View style={styles.offerTextSide}>
            <View style={styles.titleLine}>
              {showStatus && (
                <Text
                  style={[
                    styles.statusInline,
                    offer.statusKey === "ending" && styles.statusEnding,
                    offer.statusKey === "ended" && styles.statusEnded,
                  ]}
                >
                  {offer.statusLabel}
                </Text>
              )}

              {isEditing ? (
                <TextInput
                  value={data.title}
                  onChangeText={(text) => updateField("title", text)}
                  style={styles.editInputTitle}
                  textAlign="right"
                />
              ) : (
                <Text style={styles.offerTitle}>{data.title}</Text>
              )}
            </View>

            {isEditing ? (
              <TextInput
                value={data.date}
                onChangeText={(text) => updateField("date", text)}
                style={styles.editInputDate}
                textAlign="right"
              />
            ) : (
              <Text style={styles.offerDate}>{data.date}</Text>
            )}
          </View>

          <View style={styles.emojiColumn}>
            <Text style={styles.emoji}>{offer.emoji1}</Text>
            <Text style={styles.emoji}>{offer.emoji2}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <InfoCol
            label="السعر الأصلي"
            value={data.oldPrice}
            editable={isEditing}
            onChangeText={(text) => updateField("oldPrice", text)}
          />
          <InfoCol
            label="السعر بعد الخصم"
            value={data.newPrice}
            green
            editable={isEditing}
            onChangeText={(text) => updateField("newPrice", text)}
          />
        </View>

        <View style={styles.infoRow}>
          <InfoCol
            label="المبيعات"
            value={data.sold}
            editable={isEditing}
            onChangeText={(text) => updateField("sold", text)}
          />
          <InfoCol
            label="التصنيف"
            value={data.category}
            green={offer.full}
            editable={isEditing}
            onChangeText={(text) => updateField("category", text)}
          />
        </View>

        {offer.full && (
          <View style={styles.actionsRow}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                  <Text style={styles.cancelText}>إلغاء</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                  <Text style={styles.saveText}>حفظ</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.stopBtn}
                  onPress={() => onStop(offer.id)}
                >
                  <Text style={styles.stopText}>إيقاف</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.editBtn} onPress={startEdit}>
                  <Text style={styles.editText}>تعديل</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

function InfoCol({
  label,
  value,
  green,
  editable = false,
  onChangeText = () => {},
}) {
  return (
    <View style={styles.infoCol}>
      <Text style={styles.infoLabel}>{label}</Text>
      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.infoInput, green && styles.infoInputGreen]}
          textAlign="right"
        />
      ) : (
        <Text style={[styles.infoValue, green && styles.infoValueGreen]}>
          {value}
        </Text>
      )}
    </View>
  );
}

function NavItem({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={19} color={active ? "#4DA85B" : "#BDBDBD"} />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6FB972",
  },

  greenHeader: {
    backgroundColor: "#6FB972",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rightHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  iconCircleSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  iconCircleBell: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
  },

  filterCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#27C565",
    justifyContent: "center",
    alignItems: "center",
  },

  leafBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#4FA85B",
    justifyContent: "center",
    alignItems: "center",
  },

  brandText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#2E6E31",
    marginTop: 1,
  },

  titleRow: {
    marginTop: 19,
    flexDirection: "row",
    marginBottom: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 11,
  },

  titleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.23)",
    justifyContent: "center",
    alignItems: "center",
  },

  screenTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },

  sheet: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    paddingTop: 14,
    paddingHorizontal: 14,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  statCard: {
    width: "48.3%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: "#F1F1F1",
  },

  statTopRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  statLabel: {
    color: "#A7A7A7",
    fontSize: 11,
    textAlign: "right",
    marginRight: 6,
  },

  statValue: {
    textAlign: "center",
    color: "#242424",
    fontSize: 22,
    fontWeight: "800",
  },

  tabsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
    marginBottom: 10,
  },

  tab: {
    minWidth: 58,
    height: 31,
    paddingHorizontal: 12,
    borderRadius: 11,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },

  tabWide: {
    minWidth: 104,
    paddingHorizontal: 16,
  },

  tabMedium: {
    minWidth: 68,
    paddingHorizontal: 14,
  },

  activeTab: {
    backgroundColor: "#67B562",
  },

  tabText: {
    color: "#888888",
    fontSize: 12,
    fontWeight: "500",
  },

  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  offerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F1F1",
    position: "relative",
  },

  firstOfferCard: {
    minHeight: 178,
  },

  moreBtn: {
    position: "absolute",
    left: 9,
    top: 16,
    zIndex: 3,
  },

  deleteBtn: {
    position: "absolute",
    left: 14,
    bottom: 25,
    zIndex: 3,
  },

  offerContent: {
    marginLeft: 14,
  },

  offerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  offerTextSide: {
    flex: 1,
    alignItems: "flex-end",
  },

  titleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  statusInline: {
    color: "#57B45C",
    fontSize: 11,
    fontWeight: "500",
  },

  statusEnding: {
    color: "#E39A36",
  },

  statusEnded: {
    color: "#8E8E8E",
  },

  offerTitle: {
    textAlign: "right",
    color: "#2C2C2C",
    fontSize: 15,
    fontWeight: "800",
  },

  offerDate: {
    marginTop: 2,
    color: "#959595",
    fontSize: 12,
    textAlign: "right",
  },

  emojiColumn: {
    width: 30,
    alignItems: "center",
    marginLeft: 8,
    paddingTop: 2,
  },

  emoji: {
    fontSize: 18,
    lineHeight: 18,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  infoCol: {
    width: "48%",
    alignItems: "flex-end",
  },

  infoLabel: {
    color: "#B2B2B2",
    fontSize: 11,
    marginBottom: 3,
  },

  infoValue: {
    color: "#272727",
    fontSize: 16,
    fontWeight: "700",
  },

  infoValueGreen: {
    color: "#4FAF5B",
  },

  infoInput: {
    minWidth: 88,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    color: "#272727",
    backgroundColor: "#FAFAFA",
  },

  infoInputGreen: {
    color: "#4FAF5B",
    fontWeight: "700",
  },

  editInputTitle: {
    minWidth: 170,
    maxWidth: 210,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: "700",
    color: "#2C2C2C",
    backgroundColor: "#FAFAFA",
  },

  editInputDate: {
    minWidth: 150,
    maxWidth: 210,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 12,
    color: "#959595",
    backgroundColor: "#FAFAFA",
    marginTop: 4,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    paddingHorizontal: 2,
  },

  stopBtn: {
    width: "47.5%",
    height: 34,
    borderRadius: 11,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
  },

  stopText: {
    color: "#8E8E8E",
    fontSize: 14,
    fontWeight: "700",
  },

  editBtn: {
    width: "47.5%",
    height: 34,
    borderRadius: 11,
    backgroundColor: "#E7F3E6",
    justifyContent: "center",
    alignItems: "center",
  },

  editText: {
    color: "#5AAE61",
    fontSize: 14,
    fontWeight: "700",
  },

  cancelBtn: {
    width: "47.5%",
    height: 34,
    borderRadius: 11,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: "#8E8E8E",
    fontSize: 14,
    fontWeight: "700",
  },

  saveBtn: {
    width: "47.5%",
    height: 34,
    borderRadius: 11,
    backgroundColor: "#DFF1DE",
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#4FAF5B",
    fontSize: 14,
    fontWeight: "700",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 88,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 11,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },

  fabSlot: {
    width: 62,
    alignItems: "center",
    justifyContent: "center",
  },

  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#53A958",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 58,
  },

  navLabel: {
    marginTop: 4,
    fontSize: 11,
    color: "#BDBDBD",
    fontWeight: "500",
  },

  navLabelActive: {
    color: "#4DA85B",
    fontWeight: "700",
  },
});
