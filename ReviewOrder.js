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

export default function ReviewOrder() {
  const [deliveryType, setDeliveryType] = useState("now");
  const [paymentMethod, setPaymentMethod] = useState("applepay");

  const [showSheet, setShowSheet] = useState(false);
  const [selectedDay, setSelectedDay] = useState("اليوم");
  const [selectedTime, setSelectedTime] = useState("01:00 م");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = () => {
    if (paymentMethod === "card") {
      if (!cardName || !cardNumber || !cvv) {
        Alert.alert("خطأ", "اكمل بيانات البطاقة");
        return;
      }

      if (!/^\d{16}$/.test(cardNumber)) {
        Alert.alert("خطأ", "رقم البطاقة غلط");
        return;
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        Alert.alert("خطأ", "CVV غلط");
        return;
      }
    }

    Alert.alert("تم", "تم الطلب بنجاح 🎉");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        {/* العنوان */}
        <View style={styles.header}>
          <Text style={styles.title}>مراجعة الطلب</Text>
        </View>

        {/* العنوان */}
        <View style={styles.box}>
          <Text style={styles.bold}>المنزل</Text>
          <Text style={styles.gray}>6/8 Alq street</Text>
          <Text style={styles.link}>تغيير</Text>
        </View>

        {/* تفاصيل الطلب */}
        <View style={styles.box}>
          <Text style={styles.bold}>تفاصيل الطلب:</Text>

          <View style={styles.row}>
            <Text>اطلب الآن</Text>
            <TouchableOpacity onPress={() => setDeliveryType("now")}>
              <View style={styles.radio}>
                {deliveryType === "now" && <View style={styles.dot} />}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text>موعد مجدول</Text>
            <TouchableOpacity
              onPress={() => {
                setDeliveryType("scheduled");
                setShowSheet(true);
              }}
            >
              <View style={styles.radio}>
                {deliveryType === "scheduled" && <View style={styles.dot} />}
              </View>
            </TouchableOpacity>
          </View>

          {deliveryType === "scheduled" && (
            <Text style={{ marginTop: 10 }}>
              {selectedDay} - {selectedTime}
            </Text>
          )}
        </View>

        {/* الدفع */}
        <View style={styles.box}>
          <Text style={styles.bold}>تفاصيل الدفع:</Text>

          <TouchableOpacity
            style={[
              styles.payOption,
              paymentMethod === "applepay" && styles.active,
            ]}
            onPress={() => setPaymentMethod("applepay")}
          >
            <Text> Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.payOption,
              paymentMethod === "card" && styles.active,
            ]}
            onPress={() => setPaymentMethod("card")}
          >
            <Text>Credit Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.payOption,
              paymentMethod === "cash" && styles.active,
            ]}
            onPress={() => setPaymentMethod("cash")}
          >
            <Text>الدفع عند الاستلام</Text>
          </TouchableOpacity>

          {/* الكارد */}
          {paymentMethod === "card" && (
            <>
              <TextInput
                placeholder="اسم البطاقة"
                style={styles.input}
                value={cardName}
                onChangeText={setCardName}
              />

              <TextInput
                placeholder="رقم البطاقة"
                style={styles.input}
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
              />

              <TextInput
                placeholder="CVV"
                style={styles.input}
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
              />
            </>
          )}
        </View>

        {/* زر */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {paymentMethod === "cash" ? "إتمام الطلب" : " Pay"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Sheet */}
      {showSheet && (
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.bold}>حدد موعد طلبك</Text>

            {/* الأيام */}
            <View style={{ flexDirection: "row-reverse", marginTop: 10 }}>
              {["اليوم", "غداً"].map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.option, selectedDay === day && styles.active]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* الأوقات */}
            <View style={{ marginTop: 10 }}>
              {["01:00 م", "01:30 م", "02:00 م", "02:30 م"].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.option,
                    selectedTime === time && styles.active,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.save}
              onPress={() => setShowSheet(false)}
            >
              <Text style={{ fontWeight: "bold" }}>حفظ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#4A6741" },

  header: { height: 100, justifyContent: "center", alignItems: "center" },

  title: { color: "white", fontSize: 20, fontWeight: "bold" },

  box: {
    backgroundColor: "#E8F3EC",
    margin: 15,
    padding: 15,
    borderRadius: 15,
  },

  bold: { fontWeight: "bold" },

  gray: { color: "gray" },

  link: { color: "#4A6741", marginTop: 5 },

  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 10,
  },

  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#4A6741",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#4A6741",
    borderRadius: 5,
  },

  payOption: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },

  active: {
    backgroundColor: "#E8F3EC",
    borderColor: "#4A6741",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    backgroundColor: "white",
  },

  button: {
    backgroundColor: "black",
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: { color: "white", fontWeight: "bold" },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  option: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginLeft: 10,
    marginTop: 5,
  },

  save: {
    backgroundColor: "#095611",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
});
