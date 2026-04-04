import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "./firebase";
export default function DeliveryLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("تنبيه", "ادخل الإيميل وكلمة المرور");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      const workerRef = doc(db, "Captins", user.uid);
      const workerSnap = await getDoc(workerRef);

      if (!workerSnap.exists()) {
        Alert.alert("خطأ", "هذا الحساب ليس عامل توصيل");
        return;
      }

      Alert.alert("تم", "تم تسجيل الدخول بنجاح");
      router.push("/DeliveryHome");
    } catch (error) {
      Alert.alert("خطأ", "الإيميل أو كلمة المرور غير صحيحة");
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header} />

      <View style={styles.container}>
        <Text style={styles.title}>تسجيل دخول عامل التوصيل</Text>

        <Text style={styles.label}>الإيميل</Text>
        <TextInput
          style={styles.input}
          placeholder="worker@email.com"
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>دخول</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 25,
    color: "#222",
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 8,
    marginTop: 12,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#2F5D34",
    borderRadius: 18,
    paddingVertical: 15,
    marginTop: 25,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
