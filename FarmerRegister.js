import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

import { auth, db } from "../firebase";

export default function FarmerRegister() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {

    if (!name || !phone || !idNumber || !password || !confirmPassword) {

      Alert.alert("تنبيه", "يرجى تعبئة جميع الحقول");
      return;

    }

    if (password !== confirmPassword) {

      Alert.alert("خطأ", "كلمتا المرور غير متطابقتين");
      return;

    }

    try {

      const cleanPhone = phone.replace(/\D/g, "");

const fakeEmail = `${cleanPhone}@hassad.com`;

const userCredential = await createUserWithEmailAndPassword(
  auth,
  fakeEmail,
  password
);

    

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "Farmers", uid), {
  Name: name,
  Phone: phone,
  IdNumber: idNumber,
  Role: "farmer",
  CreatedAt: Timestamp.now(),
});

      Alert.alert("تم", "تم إنشاء الحساب");

      // الانتقال لصفحة بيانات المزرعة
     router.push({
  pathname: "/FarmInfo",
  params: { uid },
});

    }

    catch (error) {

      console.log(error);
      Alert.alert("خطأ", error.message);

    }

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>سجل اشتراكك في حصاد</Text>

      <View style={styles.card}>

        <Text style={styles.label}>اسم المزارع</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>رقم الجوال</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>رقم الهوية / الإقامة</Text>
        <TextInput
          style={styles.input}
          value={idNumber}
          onChangeText={setIdNumber}
        />

        <Text style={styles.label}>كلمة المرور</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>تأكيد كلمة المرور</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
        >

          <Text style={styles.buttonText}>
            اكمل بيانات المزرعة
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
  textAlign: "right",
  writingDirection: "rtl", // هذا المهم
},

  button: {

    backgroundColor: "#4E8F5C",
    marginTop: 40,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",

  },

  buttonText: {

    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",

  },

});
