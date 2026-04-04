import * as ImagePicker from "expo-image-picker";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { db } from "./firebase";

export default function DriverSignup() {
  const [vehicleType, setVehicleType] = useState("");
  const [city, setCity] = useState("");
  const [licenseImage, setLicenseImage] = useState(null);
  const handleSignup = async () => {
    await addDoc(collection(db, "Captins"), {
      username,
      idNumber,
      city,
      vehicleType,
      vehicleName,
      phone,
      password,
      licenseImage,
    });

    alert("تم التسجيل");
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setLicenseImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>ادخل بياناتك</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>اسم المستخدم</Text>
          <TextInput style={styles.input} />

          <Text style={styles.label}>رقم الهوية / الإقامة</Text>
          <TextInput style={styles.input} keyboardType="numeric" />

          <Text style={styles.label}>المدينة</Text>
          <RNPickerSelect
            onValueChange={(value) => setCity(value)}
            items={[
              { label: "أبها", value: "abha" },
              { label: "خميس مشيط", value: "khamis" },
              { label: "جازان", value: "jazan" },
              { label: "نجران", value: "najran" },
              { label: "الباحة", value: "baha" },
            ]}
            placeholder={{ label: "اختر المدينة", value: null }}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
            }}
          />

          <Text style={styles.label}>نوع المركبة</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.option, vehicleType === "car" && styles.selected]}
              onPress={() => setVehicleType("car")}
            >
              <Text style={vehicleType === "car" && { color: "white" }}>
                سيارة
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, vehicleType === "bike" && styles.selected]}
              onPress={() => setVehicleType("bike")}
            >
              <Text style={vehicleType === "bike" && { color: "white" }}>
                دباب
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>اسم المركبة</Text>
          <TextInput style={styles.input} />

          <Text style={styles.label}>رقم الجوال</Text>
          <View style={styles.phoneRow}>
            <Text style={styles.code}>+966</Text>
            <TextInput style={styles.phoneInput} keyboardType="numeric" />
          </View>

          <Text style={styles.label}>كلمة المرور</Text>
          <TextInput style={styles.input} secureTextEntry />

          <Text style={styles.label}>الرجاء إرفاق صورة رخصة القيادة</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            <Text>{licenseImage ? "تم رفع الصورة ✔" : "ارفع صورة الرخصة"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>اشترك</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#4A6741" },

  header: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  container: {
    padding: 15,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
  },

  label: {
    marginTop: 10,
    marginBottom: 5,
    color: "#555",
    textAlign: "right",
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    textAlign: "right",
  },

  row: {
    flexDirection: "row-reverse",
    marginTop: 10,
  },

  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },

  selected: {
    backgroundColor: "#4A6741",
    borderColor: "#4A6741",
  },

  phoneRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  code: {
    marginLeft: 10,
  },

  phoneInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    textAlign: "right",
  },

  uploadBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  button: {
    backgroundColor: "#4A6741",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

