import { useRouter } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../firebase";

export default function AddProduct() {

  const router = useRouter();

  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAddProduct = async () => {

    if (!type || !name || !description || !price || !quantity) {
      Alert.alert("تنبيه", "يرجى تعبئة جميع الحقول");
      return;
    }

    try {

      await addDoc(collection(db, "Products"), {

        type,
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        createdAt: Timestamp.now(),

      });

      Alert.alert("تم", "تم إضافة المنتج بنجاح");

      router.back(); // يرجع للصفحة السابقة

    } catch (error) {

      console.log(error);
      Alert.alert("خطأ", error.message);

    }
  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>إضافة المنتجات</Text>

      <View style={styles.card}>

        <Text style={styles.label}>نوع المنتج</Text>
        <TextInput
          style={styles.input}
          placeholder="خضار"
          value={type}
          onChangeText={setType}
        />

        <Text style={styles.label}>اسم المنتج</Text>
        <TextInput
          style={styles.input}
          placeholder="بروكلي"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>وصف المنتج</Text>
        <TextInput
          style={styles.input}
          placeholder="بروكلي عضوي طازج..."
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>سعر المنتج</Text>
        <TextInput
          style={styles.input}
          placeholder="9"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>الكمية المتوفرة</Text>
        <TextInput
          style={styles.input}
          placeholder="13"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddProduct}
        >
          <Text style={styles.buttonText}>إضافة</Text>
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
