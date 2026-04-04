import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

export default function FarmInfo() {

  const router = useRouter();

  const [farmName, setFarmName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);


  useEffect(() => {

    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {

        Alert.alert("يجب تفعيل الموقع");
        return;

      }

      let location = await Location.getCurrentPositionAsync({});

      const userRegion = {

        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,

      };

      setRegion(userRegion);
      setMarker(userRegion);

    })();

  }, []);



  const saveFarm = async () => {

    if (!farmName || !category || !city || !marker) {

      Alert.alert("تنبيه", "يرجى تعبئة جميع الحقول");
      return;

    }

    try {

      const uid = auth.currentUser.uid;

      await addDoc(collection(db, "Farms"), {

        name: farmName,
        category: category,
        city: city,

        lat: marker.latitude,
        lng: marker.longitude,

        ownerId: uid, // يربط المزرعة بالمستخدم

        createdAt: Timestamp.now(),

      });

      Alert.alert("تم", "تم حفظ بيانات المزرعة");

      router.replace("/"); // أو أي صفحة رئيسية

    }

    catch (error) {

      console.log(error);
      Alert.alert("خطأ", error.message);

    }

  };



  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        بيانات المزرعة
      </Text>


      <View style={styles.card}>

        <Text style={styles.label}>
          اسم المزرعة
        </Text>

        <TextInput
          style={styles.input}
          value={farmName}
          onChangeText={setFarmName}
        />



        <Text style={styles.label}>
          نوع النشاط الزراعي
        </Text>

        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />



        <Text style={styles.label}>
          المدينة
        </Text>

        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />



        <Text style={styles.label}>
          حدد موقع المزرعة
        </Text>



        <View style={styles.mapContainer}>

          {region && (

            <MapView
              style={styles.map}
              initialRegion={region}
              onPress={(e) =>
                setMarker(e.nativeEvent.coordinate)
              }
            >

              {marker &&
                <Marker coordinate={marker} />
              }

            </MapView>

          )}

        </View>



        <TouchableOpacity
          style={styles.button}
          onPress={saveFarm}
        >

          <Text style={styles.buttonText}>
            حفظ بيانات المزرعة
          </Text>

        </TouchableOpacity>



      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#63A874",
    paddingTop: 120,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
  },

  label: {
    color: "#2f6b3c",
    marginTop: 15,
    marginBottom: 5,
    textAlign: "right"
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 8,
    textAlign: "right"
  },

  mapContainer: {
    height: height * 0.25,
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 15,
  },

  map: {
    flex: 1,
  },

  button: {
    backgroundColor: "#2E7D32",
    marginTop: 30,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

});
