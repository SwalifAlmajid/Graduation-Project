import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebase";

export default function Orders() {

  const router = useRouter();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {

    try {

      const querySnapshot = await getDocs(collection(db, "Orders"));

      const list = [];

      querySnapshot.forEach((doc) => {

        const data = doc.data();

        list.push({

          id: doc.id,
          date: data.CreatedAt?.toDate().toLocaleDateString(),
          time: data.CreatedAt?.toDate().toLocaleTimeString(),
          amount: data.TotalAmount,
          status: data.Status,

        });

      });

      setOrders(list);

    } catch (error) {

      console.log(error);

    }

  };


  const renderItem = ({ item }) => (

    <View style={styles.orderCard}>

      <View>

        <Text style={styles.orderNumber}>
          #{item.id}
        </Text>

        <Text style={styles.date}>
          {item.date} - {item.time}
        </Text>

        <Text style={styles.price}>
          {item.amount} ريال
        </Text>

      </View>


      <View>

        <Text style={[
          styles.status,
          item.status === "تم التوصيل"
            ? styles.done
            : styles.cancel
        ]}>
          {item.status}
        </Text>


       <TouchableOpacity
  onPress={() =>
    router.push({
      pathname: "/orderDetails",
      params: { id: item.id }
    })
  }
>
  <Text style={styles.details}>
    عرض التفاصيل
  </Text>
</TouchableOpacity>

      </View>

    </View>

  );


  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        كل الطلبات
      </Text>


      <View style={styles.card}>

        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />

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
    padding: 20,
  },

  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  orderNumber: {
    fontSize: 14,
    color: "gray",
    textAlign: "right"
  },

  date: {
    fontSize: 13,
    color: "gray",
    marginTop: 5,
    textAlign: "right"
  },

  price: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "right"
  },

  status: {
    fontSize: 13,
    marginBottom: 8,
    textAlign: "right"
  },

  done: {
    color: "green"
  },

  cancel: {
    color: "red"
  },

  details: {
    color: "#2E7D32",
    fontSize: 14,
    textAlign: "right"
  },

});