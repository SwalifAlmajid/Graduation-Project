import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function DeliveryHome() {
  const [available, setAvailable] = useState(true);
  const [nearOrders, setNearOrders] = useState([]);

  
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
  
        let { status } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        let location = await Location.getCurrentPositionAsync({});
        const myLat = location.coords.latitude;
        const myLng = location.coords.longitude;

   
        const querySnapshot = await getDocs(collection(db, "Orders"));

        let filtered = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.status !== "pending") return;

          const distance = getDistance(
            myLat,
            myLng,
            data.location.lat,
            data.location.lng
          );

          if (distance <= 10) {
            filtered.push({
              id: doc.id,
              ...data,
              distance: distance.toFixed(1),
            });
          }
        });

        setNearOrders(filtered);
      } catch (err) {
        console.log("🔥 Error:", err);
      }
    };

    loadOrders();
  }, []);



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header} />

      <View style={styles.container}>
        <Text style={styles.welcome}>أهلاً كابتن 👋</Text>

        {/* التوفر */}
        <View style={styles.availabilityRow}>
          <Text style={styles.label}>متاح للتوصيل</Text>
          <Switch
            value={available}
            onValueChange={setAvailable}
            thumbColor="#fff"
            trackColor={{ true: "#2F5D34", false: "#ccc" }}
          />
        </View>

        <ScrollView>
          {/* الطلبات */}
          <Text style={styles.sectionTitle}>الطلبات القريبة</Text>

          {nearOrders.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              لا يوجد طلبات قريبة حالياً
            </Text>
          ) : (
            nearOrders.map((order) => (
              <View key={order.id} style={styles.card}>
                <Text style={styles.orderId}>طلب #{order.id}</Text>
                <Text style={styles.text}>{order.farmName}</Text>
                <Text style={styles.text}>
                  {order.distance} كم يبعد عنك
                </Text>
                <Text style={styles.text}>{order.price} ريال</Text>

                <TouchableOpacity style={styles.acceptBtn}>
                  <Text style={styles.acceptText}>قبول الطلب</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#5C8A57",
  },
  header: {
    height: 90,
    backgroundColor: "#5C8A57",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -20,
    padding: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 15,
  },
  availabilityRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "right",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  text: {
    textAlign: "right",
    marginTop: 4,
    color: "#555",
  },
  acceptBtn: {
    backgroundColor: "#4A6741",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  acceptText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});