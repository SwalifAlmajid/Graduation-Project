import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  const [location, setLocation] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
  });

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={(e) => setLocation(e.nativeEvent.coordinate)}
      >
        <Marker coordinate={location} />
      </MapView>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 40,
          alignSelf: "center",
          backgroundColor: "#4A6741",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={() =>
          router.replace({
            pathname: "/ReviewOrder",
            params: {
              address: "تم اختيار الموقع 📍",
            },
          })
        }
      >
        <Text style={{ color: "white" }}>تأكيد الموقع</Text>
      </TouchableOpacity>
    </View>
  );
}
