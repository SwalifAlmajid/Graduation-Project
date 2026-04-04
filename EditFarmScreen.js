import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import MapView, { Marker } from "react-native-maps";

import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";

export default function EditFarmScreen() {

  const router = useRouter();

  const [farmId, setFarmId] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const [location, setLocation] = useState({
    latitude: 26.4,
    longitude: 49.9,
  });


  // رقم المزارع (نفس الموجود في Farmers collection)
  const farmerID = 5; // مؤقتاً


  useEffect(() => {

    getFarm();

  }, []);



  const getFarm = async () => {

    try {

      const q = query(
        collection(db, "Farms"),
        where("FarmerID", "==", farmerID)
      );

      const snapshot = await getDocs(q);

      snapshot.forEach((docItem) => {

        const data = docItem.data();

        setFarmId(docItem.id);

        setName(data.name);
        setCategory(data.category);

        setLocation({

          latitude: data.lat,
          longitude: data.lng,

        });

      });

    } catch (error) {

      console.log(error);

    }

  };



  const saveChanges = async () => {

    try {

      await updateDoc(doc(db, "Farms", farmId), {

        name: name,
        category: category,

        lat: location.latitude,
        lng: location.longitude,

      });

      Alert.alert("تم", "تم حفظ التعديلات");

      router.back();

    } catch (error) {

      console.log(error);

    }

  };



  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        تعديل المزرعة
      </Text>



      <View style={styles.card}>

        <Text style={styles.label}>
          اسم المزرعة
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />



        <Text style={styles.label}>
          نوع المنتجات
        </Text>

        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />



        <Text style={styles.label}>
          موقع المزرعة
        </Text>



        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={(e) => setLocation(e.nativeEvent.coordinate)}
        >

          <Marker coordinate={location} />

        </MapView>



        <TouchableOpacity
          style={styles.button}
          onPress={saveChanges}
        >

          <Text style={styles.buttonText}>
            حفظ التغييرات
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
    fontSize: 26,
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

  map: {
    width: "100%",
    height: 180,
    marginTop: 15,
    borderRadius: 15,
  },

  button: {
    backgroundColor: "#2E7D32",
    marginTop: 40,
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