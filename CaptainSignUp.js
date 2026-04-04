import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "./firebase";

export const Colors = {
  primary: '#4A6741',
  secondary: '#F5F5DC', 
  accent: '#8DA47E',
  white: '#FFFFFF',
  text: '#333333',
};

export default function CaptainSignUp() {
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [city, setCity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCaptainSignUp = async () => {
    if (
      !name ||
      !nationalId ||
      !city ||
      !vehicleType ||
      !phone ||
      !email ||
      !password
    ) {
      Alert.alert("تنبيه", "عبّي كل الحقول الأساسية");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "Captins", user.uid), {
        CaptinID: user.uid,
        Name: name,
        NationalID: nationalId,
        City: city,
        Phone: phone,
        Email: email,
        CurrentLocation: {
          lat: 0,
          lng: 0,
        },
        VehicleType: {
          Type: vehicleType,
          Brand: vehicleBrand,
          Color: vehicleColor,
          Model: vehicleModel,
        },
        isAvailable: true,
        role: "captain",
        createdAt: new Date().toISOString(),
      });

      Alert.alert("تم", "تم تسجيل الكابتن بنجاح");
      router.push("/captainlogin");
    } catch (error) {
      Alert.alert("خطأ", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>ادخل بياناتك</Text>

          <Text style={styles.label}>اسم المستخدم</Text>
          <TextInput
            style={styles.input}
            placeholder="حصاد"
            value={name}
            onChangeText={setName}
            textAlign="right"
          />

          <Text style={styles.label}>رقم الهوية/الإقامة</Text>
          <TextInput
            style={styles.input}
            placeholder="ادخل رقم الهوية"
            value={nationalId}
            onChangeText={setNationalId}
            textAlign="right"
          />

          <Text style={styles.label}>المدينة</Text>
          <TextInput
            style={styles.input}
            placeholder="أبها"
            value={city}
            onChangeText={setCity}
            textAlign="right"
          />

          <Text style={styles.label}>نوع المركبة</Text>
          <TextInput
            style={styles.input}
            placeholder="سيارة أو دباب"
            value={vehicleType}
            onChangeText={setVehicleType}
            textAlign="right"
          />

          <Text style={styles.label}>اسم المركبة</Text>
          <TextInput
            style={styles.input}
            placeholder="تويوتا"
            value={vehicleBrand}
            onChangeText={setVehicleBrand}
            textAlign="right"
          />

          <Text style={styles.label}>لون المركبة</Text>
          <TextInput
            style={styles.input}
            placeholder="أبيض"
            value={vehicleColor}
            onChangeText={setVehicleColor}
            textAlign="right"
          />

          <Text style={styles.label}>موديل المركبة</Text>
          <TextInput
            style={styles.input}
            placeholder="2022"
            value={vehicleModel}
            onChangeText={setVehicleModel}
            textAlign="right"
          />

          <Text style={styles.label}>رقم الجوال</Text>
          <TextInput
            style={styles.input}
            placeholder="+966"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            textAlign="right"
          />

          <Text style={styles.label}>الإيميل</Text>
          <TextInput
            style={styles.input}
            placeholder="captain@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textAlign="right"
          />

          <Text style={styles.label}>كلمة المرور</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textAlign="right"
          />

          <TouchableOpacity style={styles.button} onPress={handleCaptainSignUp}>
            <Text style={styles.buttonText}>اشترك</Text>
          </TouchableOpacity>
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
    backgroundColor: "#F3F3F3",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  back: {
    fontSize: 28,
    color: "#333",
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "#4A6741",
    paddingVertical: 12,
    borderRadius: 18,
  },
  label: {
    fontSize: 18,
    color: "#333",
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    marginTop: 25,
    backgroundColor: "#4A6741",
    borderRadius: 18,
    paddingVertical: 15,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
  },
});
