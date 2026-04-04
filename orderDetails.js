import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebase";

export default function OrderDetails() {

  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderDetails();
  }, []);

  const getOrderDetails = async () => {

    try {

      const docRef = doc(db, "Orders", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        setOrder(docSnap.data());

      }

    } catch (error) {

      console.log(error);

    }

  };


  if (!order) {
    return (
      <View style={styles.container}>
        <Text>جاري التحميل...</Text>
      </View>
    );
  }


  return (

    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.title}>
          الطلب #{id}
        </Text>


        <Text style={styles.text}>
          حالة الطلب: {order.Status}
        </Text>


        <Text style={styles.text}>
          تاريخ الطلب:
          {order.CreatedAt?.toDate().toLocaleDateString()}
        </Text>


        <Text style={styles.text}>
          المبلغ: {order.TotalAmount} ريال
        </Text>


        <Text style={styles.text}>
          طريقة الدفع:
          {order.Payment?.PaymentMethod}
        </Text>


        <Text style={styles.text}>
          حالة الدفع:
          {order.Payment?.PaymentStatus}
        </Text>


        <View style={styles.buttons}>

          <TouchableOpacity style={styles.accept}>

            <Text style={styles.btnText}>
              قبول
            </Text>

          </TouchableOpacity>


          <TouchableOpacity style={styles.reject}>

            <Text style={styles.btnText}>
              رفض
            </Text>

          </TouchableOpacity>

        </View>


        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.close}>
            رجوع
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
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 25,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  text: {
    marginBottom: 10,
    fontSize: 15,
    textAlign: "right"
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  accept: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 20,
    width: 100,
    alignItems: "center"
  },

  reject: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 20,
    width: 100,
    alignItems: "center"
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold"
  },

  close: {
    marginTop: 20,
    textAlign: "center",
    color: "gray"
  }

});