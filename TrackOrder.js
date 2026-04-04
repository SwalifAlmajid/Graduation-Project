import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import MapView, { Marker } from "react-native-maps";

import { useLocalSearchParams } from "expo-router";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";


export default function TrackOrder() {

  const { orderId } = useLocalSearchParams();

  const [status, setStatus] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);

  const defaultLocation = {
    latitude: 24.7136,
    longitude: 46.6753,
  };


  useEffect(() => {

    if (!orderId) return;

    const orderRef = doc(db, "Orders", orderId);

    const unsubscribe = onSnapshot(orderRef, (snapshot) => {

      if (!snapshot.exists()) {

        console.log("لا يوجد طلب");
        return;

      }

      const data = snapshot.data();

      setStatus(data.Status || "قيد المعالجة");


      if (data.CaptainID) {

        listenToCaptain(data.CaptainID);

      }

    });

    return unsubscribe;

  }, [orderId]);


  const listenToCaptain = (captainId) => {

    if (!captainId) return;

    const captainRef = doc(db, "Captains", captainId);

    onSnapshot(captainRef, (snapshot) => {

      if (!snapshot.exists()) return;

      const data = snapshot.data();

      if (!data?.CurrentLocation) return;

      setCaptainLocation({

        latitude: data.CurrentLocation.latitude,
        longitude: data.CurrentLocation.longitude,

      });

    });

  };



  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        تتبع الطلب
      </Text>


      <MapView
        style={styles.map}
        region={{
          latitude: captainLocation?.latitude || defaultLocation.latitude,
          longitude: captainLocation?.longitude || defaultLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >

        {captainLocation && (

          <Marker coordinate={captainLocation} />

        )}

      </MapView>


      {!orderId && (

        <Text style={styles.message}>
          لا يوجد طلب حالياً
        </Text>

      )}


      {orderId && !captainLocation && (

        <View style={styles.loadingBox}>

          <ActivityIndicator size="large" />

          <Text style={styles.message}>
            جاري انتظار قبول الطلب...
          </Text>

        </View>

      )}


      {status && (

        <Text style={styles.status}>
          حالة الطلب: {status}
        </Text>

      )}

    </View>

  );

}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },

  map: {
    height: 300,
    margin: 20,
    borderRadius: 20,
  },

  message: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },

  status: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },

  loadingBox: {
    alignItems: "center",
    marginTop: 20,
  },

});