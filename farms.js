import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "./firebase";

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchFarms();
    getUserLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [farms, search, selectedFilter, userLocation]);

  const fetchFarms = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Farms"));
      const farmsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFarms(farmsData);
    } catch (error) {
      console.log("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const applyFilters = () => {
    let data = [...farms];

    data = data.map((farm) => {
      let distance = null;

      if (userLocation && farm.lat && farm.lng) {
        distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          farm.lat,
          farm.lng,
        );
      }

      return {
        ...farm,
        distance,
      };
    });

    if (search.trim()) {
      data = data.filter(
        (farm) =>
          farm.name?.toLowerCase().includes(search.toLowerCase()) ||
          farm.description?.toLowerCase().includes(search.toLowerCase()) ||
          farm.category?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (selectedFilter === "nearest") {
      data = data.sort((a, b) => {
        const da = a.distance ? parseFloat(a.distance) : 9999;
        const db = b.distance ? parseFloat(b.distance) : 9999;
        return da - db;
      });
    }

    if (selectedFilter === "rating") {
      data = data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (selectedFilter === "organic") {
      data = data.filter((farm) => farm.organic === true);
    }

    if (selectedFilter === "vegetables") {
      data = data.filter((farm) => farm.category === "خضار");
    }

    if (selectedFilter === "fruits") {
      data = data.filter((farm) => farm.category === "فواكه");
    }

    setFilteredData(data);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#4A6741" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header} />

      <View style={styles.container}>
        <Text style={styles.title}>المزارع القريبة</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#4A6741" />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن مزرعة..."
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "all" && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "all" && styles.activeFilterText,
              ]}
            >
              الكل
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "nearest" && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter("nearest")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "nearest" && styles.activeFilterText,
              ]}
            >
              الأقرب
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "rating" && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter("rating")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "rating" && styles.activeFilterText,
              ]}
            >
              الأعلى تقييم
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "organic" && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter("organic")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "organic" && styles.activeFilterText,
              ]}
            >
              عضوي
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "vegetables" && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter("vegetables")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "vegetables" && styles.activeFilterText,
              ]}
            >
              خضار
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "fruits" && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter("fruits")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "fruits" && styles.activeFilterText,
              ]}
            >
              فواكه
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredData.map((farm) => (
            <TouchableOpacity
              key={farm.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/farmdetail",
                  params: { farmId: farm.id },
                })
              }
            >
              <Image
                source={{
                  uri:
                    farm.image ||
                    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
                }}
                style={styles.image}
              />

              <View style={styles.info}>
                <View>
                  <Text>⭐ {farm.rating || 0}</Text>
                  <Text>{farm.distance ? `${farm.distance} كم` : "—"}</Text>
                </View>

                <View style={styles.right}>
                  <Text style={styles.name}>{farm.name || "اسم المزرعة"}</Text>
                  <Text>{farm.description || "لا يوجد وصف"}</Text>
                  <Text>{farm.category || "غير محدد"}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4A6741",
  },
  header: {
    height: 90,
    backgroundColor: "#4A6741",
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 12,
    color: "#333",
  },
  searchBox: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
  },
  filtersRow: {
    paddingBottom: 12,
  },
  filterButton: {
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginLeft: 8,
  },
  activeFilter: {
    backgroundColor: "#4A6741",
  },
  filterText: {
    color: "#333",
    fontWeight: "600",
  },
  activeFilterText: {
    color: "white",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  right: {
    alignItems: "flex-end",
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
