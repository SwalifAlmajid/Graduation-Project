import { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DeliveryHome() {
  const [available, setAvailable] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header} />

      <View style={styles.container}>
        <Text style={styles.welcome}>أهلاً كابتن أحمد</Text>

        <View style={styles.availabilityRow}>
          <Text style={styles.label}>متاح للتوصيل</Text>
          <Switch
            value={available}
            onValueChange={setAvailable}
            thumbColor="#fff"
            trackColor={{ true: "#2F5D34", false: "#ccc" }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>التوصيل الحالي</Text>

          <Text style={styles.orderId}>#1234 طلب</Text>
          <Text style={styles.text}>مزرعة البساتين</Text>
          <Text style={styles.text}>شارع الملك عبدالله</Text>
          <Text style={styles.text}>25 ريال</Text>

          <TouchableOpacity style={styles.doneBtn}>
            <Text style={styles.doneText}>تم التوصيل</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>الطلبات القادمة</Text>

          <Text style={styles.orderId}>#1235 طلب</Text>
          <Text style={styles.text}>مزرعة النخيل</Text>
          <Text style={styles.text}>15 دقيقة</Text>

          <TouchableOpacity style={styles.acceptBtn}>
            <Text style={styles.acceptText}>قبول الطلب</Text>
          </TouchableOpacity>
        </View>
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
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 15,
  },
  availabilityRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "right",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  text: {
    textAlign: "right",
    marginTop: 4,
    color: "#555",
  },
  doneBtn: {
    backgroundColor: "#2F5D34",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  doneText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  acceptBtn: {
    backgroundColor: "#4A6741",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  acceptText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
