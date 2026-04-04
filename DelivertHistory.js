import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DeliveryHistory() {
  const orders = [
    {
      id: "#12345",
      customer: "أحمد محمد",
      date: "15 مارس 2024 - 2:30 مساء",
      amount: "250 ريال",
      status: "عرض التفاصيل",
    },
    {
      id: "#12344",
      customer: "فاطمة عبدالله",
      date: "14 مارس 2024 - 10:15 صباحًا",
      amount: "180 ريال",
      status: "تم التوصيل",
    },
    {
      id: "#12343",
      customer: "محمد السالم",
      date: "13 مارس 2024 - 5:45 مساء",
      amount: "320 ريال",
      status: "تم التوصيل",
    },
    {
      id: "#12342",
      customer: "سارة أحمد",
      date: "12 مارس 2024 - 11:20 صباحًا",
      amount: "150 ريال",
      status: "عرض التفاصيل",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header} />

      <View style={styles.container}>
        <Text style={styles.title}>الطلبات السابقة</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.map((order) => (
            <View key={order.id} style={styles.card}>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.customer}>{order.customer}</Text>
              <Text style={styles.date}>{order.date}</Text>
              <Text style={styles.amount}>{order.amount}</Text>

              <TouchableOpacity style={styles.linkBtn}>
                <Text style={styles.linkText}>{order.status}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 20,
    color: "#222",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    color: "#444",
  },
  customer: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 6,
    color: "#222",
  },
  date: {
    fontSize: 14,
    textAlign: "right",
    marginTop: 4,
    color: "#666",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 6,
    color: "#2F5D34",
  },
  linkBtn: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  linkText: {
    color: "#2F5D34",
    fontWeight: "700",
  },
});
