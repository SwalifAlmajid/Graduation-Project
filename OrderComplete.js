import { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DeliveryOrderReview() {
  const [deliveryMethod, setDeliveryMethod] = useState("scheduled");
  const [paymentMethod, setPaymentMethod] = useState("applepay");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header} />

      <View style={styles.container}>
        <Text style={styles.title}>مراجعة الطلب</Text>

        <View style={styles.section}>
          <Text style={styles.label}>العنوان</Text>
          <Text style={styles.value}>
            678 Ale street, Ilasamaja, Lagos State
          </Text>
          <TouchableOpacity>
            <Text style={styles.link}>تغيير</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>تفاصيل الطلب:</Text>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setDeliveryMethod("now")}
          >
            <View style={styles.radioCircle}>
              {deliveryMethod === "now" && <View style={styles.selectedDot} />}
            </View>
            <Text style={styles.radioText}>طلب الآن</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setDeliveryMethod("scheduled")}
          >
            <View style={styles.radioCircle}>
              {deliveryMethod === "scheduled" && (
                <View style={styles.selectedDot} />
              )}
            </View>
            <Text style={styles.radioText}>موعد محدد لاحق</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>تفاصيل الدفع:</Text>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setPaymentMethod("applepay")}
          >
            <View style={styles.radioCircle}>
              {paymentMethod === "applepay" && (
                <View style={styles.selectedDot} />
              )}
            </View>
            <Text style={styles.radioText}>Apple Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setPaymentMethod("visa")}
          >
            <View style={styles.radioCircle}>
              {paymentMethod === "visa" && <View style={styles.selectedDot} />}
            </View>
            <Text style={styles.radioText}>Credit Card / VISA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setPaymentMethod("cash")}
          >
            <View style={styles.radioCircle}>
              {paymentMethod === "cash" && <View style={styles.selectedDot} />}
            </View>
            <Text style={styles.radioText}>الدفع عند الاستلام</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payText}>Apple Pay</Text>
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
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 25,
    color: "#222",
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 10,
    color: "#222",
  },
  value: {
    fontSize: 15,
    textAlign: "right",
    color: "#666",
    marginBottom: 8,
  },
  link: {
    color: "#2F5D34",
    fontWeight: "700",
    textAlign: "right",
  },
  radioRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#2F5D34",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2F5D34",
  },
  radioText: {
    fontSize: 18,
    color: "#222",
  },
  payButton: {
    backgroundColor: "black",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 20,
  },
  payText: {
    color: "white",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
  },
});
