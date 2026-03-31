import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "/Users/lujain/harvest-app/app/(tabs)/firebase.js";

import {
    Image,
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
};

export default function App() {
  const [farms, setFarms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("nearest");
  const [userLocation, setUserLocation] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchFarms();
    getLocation();
  }, []);

  useEffect(() => {
    if (userLocation && farms.length > 0) {
      applyFilter();
    }
  }, [filter, userLocation, farms]);

  const fetchFarms = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Farms"));

      const firebaseData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFarms(firebaseData);
    } catch (error) {
      console.log("Error fetching farms:", error);
    }
  };

  const handleSearch = () => {
    console.log("SEARCH:", search);

    if (!search.trim()) return;

    router.push({
      pathname: "/products",
      params: { q: search },
    });
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setUserLocation({ lat: 26.3927, lng: 49.9777 });
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    } catch {
      setUserLocation({ lat: 26.3927, lng: 49.9777 });
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const applyFilter = () => {
    let result = farms.map((f) => ({
      ...f,
      distance:
        f.lat && f.lng
          ? getDistance(
              userLocation.lat,
              userLocation.lng,
              f.lat,
              f.lng,
            ).toFixed(1)
          : "0.0",
    }));

    if (filter === "nearest") {
      result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (filter === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filter === "organic") {
      result = result.filter((f) => f.organic);
    } else if (filter === "fruits") {
      result = result.filter((f) => f.category === "فواكه");
    } else if (filter === "vegetables") {
      result = result.filter((f) => f.category === "خضار");
    } else if (filter === "dates") {
      result = result.filter((f) => f.category === "تمور");
    }

    setData(result);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header} />

      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>المزارع القريبة</Text>

          <View style={styles.searchBox}>
            <TextInput
              placeholder="ابحث عن مزرعة أو منتج..."
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              style={styles.input}
              textAlign="right"
            />
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons name="search" size={20} color="green" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filters}>
              {[
                ["nearest", "الأقرب"],
                ["rating", "الأعلى تقييم"],
                ["organic", "عضوي"],
                ["fruits", "فواكه"],
                ["vegetables", "خضار"],
                ["dates", "تمور"],
              ].map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.filterBtn, filter === key && styles.active]}
                  onPress={() => setFilter(key)}
                >
                  <Text style={filter === key ? { color: "white" } : {}}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {data.map((farm) => (
            <View key={farm.id} style={styles.card}>
              <Image source={{ uri: farm.image }} style={styles.image} />

              <View style={styles.info}>
                <View>
                  <Text>⭐ {farm.rating}</Text>
                  <Text>{farm.distance} كم</Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.name}>{farm.name}</Text>
                  <Text>{farm.description}</Text>
                  <Text>{farm.category}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#4A6741" },
  header: { height: 90 },
  container: {
    flex: 1,
    backgroundColor: "#eee",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
  },
  title: { fontSize: 22, textAlign: "center", marginBottom: 10 },
  searchBox: {
    flexDirection: "row-reverse",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  input: { flex: 1 },
  filters: { flexDirection: "row-reverse", marginBottom: 10 },
  filterBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    marginLeft: 5,
  },
  active: { backgroundColor: "#4A6741" },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 10,
    overflow: "hidden",
  },
  image: { width: "100%", height: 150 },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  name: { fontWeight: "bold", fontSize: 16 },
});
