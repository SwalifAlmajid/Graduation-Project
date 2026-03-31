import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;

const MOYASAR_API_KEY = "pk_test_xnwLJ4UZt7WBjkmkS3H3isTxn3kpvAEMnmYsJenQ";

export default function Checkout() {
  const navigation = useNavigation();

  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [schedule, setSchedule] = useState("now");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loadingPay, setLoadingPay] = useState(false);

  const mapStyle = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "on" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#333" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#e0e0e0" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
    { featureType: "poi", elementType: "all", stylers: [{ visibility: "on" }] },
    { featureType: "poi.business", elementType: "labels.text.fill", stylers: [{ color: "#4A6741" }] },
    { featureType: "poi.business", elementType: "labels.icon", stylers: [{ visibility: "on" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d0f0c0" }] },
  ];

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Enable location access to detect your position");
        setLoadingLocation(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;
      setCoords({ latitude, longitude });

      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const formatted = `${address.street || ""} ${address.name || ""}, ${address.city || ""}`.trim();
      setLocation(formatted);
    } catch (e) {
      console.log(e);
      alert("Could not detect location.");
    }
    setLoadingLocation(false);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const confirmLocation = async () => {
    if (!coords) return;
    const [address] = await Location.reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude });
    const formatted = `${address.street || ""} ${address.name || ""}, ${address.city || ""}`.trim();
    setLocation(formatted);
    setMapVisible(false);
  };

  const RadioOption = ({ label, value }) => (
    <TouchableOpacity style={styles.radioBtn} onPress={() => setPaymentMethod(value)}>
      <View style={styles.radioOuter}>{paymentMethod === value && <View style={styles.radioInner} />}</View>
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );

  const handleSelectMada = () => {
    setPaymentMethod("mada");
    setCardNumber("");
    setExpiry("");
    setCvv("");
  };

  const isPayEnabled = () => {
    if (!paymentMethod) return false;
    if (paymentMethod === "mada") return cardNumber && expiry && cvv;
    return true;
  };

  const handleCardNumberChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted);
  };

  const handleExpiryChange = (text) => {
    let formatted = text.replace(/\D/g, "");
    if (formatted.length > 2) formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
    setExpiry(formatted);
  };

  const handlePayMada = async () => {
    setLoadingPay(true);

    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      Alert.alert("Invalid Card Number", "الرجاء إدخال رقم بطاقة صالح (16 رقم)");
      setLoadingPay(false);
      return;
    }

    if (!expiry || !expiry.includes("/")) {
      Alert.alert("Invalid Expiry Date", "الرجاء إدخال تاريخ انتهاء صالح MM/YY");
      setLoadingPay(false);
      return;
    }

    const [month, year] = expiry.split("/");
    const monthInt = parseInt(month, 10);
    const yearInt = 2000 + parseInt(year, 10);

    if (!monthInt || monthInt < 1 || monthInt > 12) {
      Alert.alert("Invalid Expiry Month", "شهر انتهاء البطاقة غير صالح");
      setLoadingPay(false);
      return;
    }

    if (!yearInt || yearInt < new Date().getFullYear()) {
      Alert.alert("Invalid Expiry Year", "سنة انتهاء البطاقة غير صالحة");
      setLoadingPay(false);
      return;
    }

    if (!cvv || cvv.length !== 3) {
      Alert.alert("Invalid CVV", "الرجاء إدخال CVV صالح (3 أرقام)");
      setLoadingPay(false);
      return;
    }

    const auth = Buffer.from(MOYASAR_API_KEY + ":").toString("base64");

    try {
      const res = await fetch("https://api.moyasar.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          source: {
            type: "creditcard",
            number: cardNumber.replace(/\s/g, ""),
            cvc: cvv,
            month: monthInt,
            year: yearInt,
          },
          amount: 100, 
          currency: "SAR",
          description: "حصاد - طلب جديد",
        }),
      });

      const data = await res.json();
      if (data.status === "paid") {
        Alert.alert("Payment Successful", "تم الدفع بنجاح!");
        navigation.navigate("thankyou");
      } else {
        Alert.alert("Payment Failed", data.message || "حدث خطأ أثناء الدفع.");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Payment Error", "تعذر الاتصال بالسيرفر.");
    }

    setLoadingPay(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#63a775" }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <View style={{ flex: 1, marginTop: 50, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: "#fff", overflow: "hidden" }}>
        <ScrollView contentContainerStyle={{ padding: 16, minHeight: "100%" }}>
          <Text style={styles.title}>Checkout</Text>

          {/* Delivery Location */}
          <Text style={styles.label}>Delivery Location</Text>
          <View style={styles.locationCard}>
            {loadingLocation ? <ActivityIndicator size="small" color="#4A6741" style={{ marginRight: 10 }} /> : <Ionicons name="location-sharp" size={24} color="#4A6741" style={{ marginRight: 8 }} />}
            <TextInput style={styles.input} placeholder="Street, building, city" value={location} editable={false} />
            <TouchableOpacity onPress={() => setMapVisible(true)} style={{ marginLeft: 8 }}>
              <Ionicons name="pencil" size={24} color="#4A6741" />
            </TouchableOpacity>
          </View>

          {mapVisible && (
            <View style={styles.mapBox}>
              <View style={styles.mapHeader}>
                <Text style={{ fontWeight: "700" }}>Select Location</Text>
                <TouchableOpacity onPress={() => setMapVisible(false)}>
                  <Ionicons name="close" size={28} color="#4A6741" />
                </TouchableOpacity>
              </View>
              <MapView
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapStyle}
                initialRegion={{
                  latitude: coords?.latitude || 24.7136,
                  longitude: coords?.longitude || 46.6753,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={(e) => setCoords(e.nativeEvent.coordinate)}
              >
                {coords && <Marker coordinate={coords} draggable onDragEnd={(e) => setCoords(e.nativeEvent.coordinate)} />}
              </MapView>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation}>
                <Text style={styles.payText}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Delivery Time</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.optionBtn, schedule === "now" && styles.selectedOption]} onPress={() => setSchedule("now")}>
              <Text style={styles.optionText}>Order Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionBtn, schedule === "later" && styles.selectedOption]} onPress={() => setSchedule("later")}>
              <Text style={styles.optionText}>Schedule</Text>
            </TouchableOpacity>
          </View>

          {schedule === "later" && (
            <>
              {Platform.OS === "android" && (
                <TouchableOpacity style={styles.androidPickerBtn} onPress={() => setShowPicker(true)}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Select Date & Time</Text>
                </TouchableOpacity>
              )}
              {(showPicker || Platform.OS === "ios") && (
                <DateTimePicker
                  value={date}
                  mode="datetime"
                  display="default"
                  onChange={(_, selected) => {
                    if (Platform.OS === "android") setShowPicker(false);
                    if (selected) setDate(selected);
                  }}
                  minimumDate={new Date()}
                />
              )}
              <Text style={{ marginBottom: 16, fontWeight: "600" }}>
                Selected: {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </>
          )}

          <Text style={styles.label}>Payment Method</Text>

          <TouchableOpacity style={styles.radioBtn} onPress={handleSelectMada}>
            <View style={styles.radioOuter}>{paymentMethod === "mada" && <View style={styles.radioInner} />}</View>
            <Text style={styles.radioText}>Mada</Text>
          </TouchableOpacity>

          <RadioOption label="Pay on Delivery (Cash)" value="cash" />

          {paymentMethod === "mada" && (
            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setCardNumber("4111 1111 1111 1111");
                  const now = new Date();
                  const month = String(now.getMonth() + 1).padStart(2, "0");
                  const year = String((now.getFullYear() + 1) % 100).padStart(2, "0");
                  setExpiry(`${month}/${year}`);
                  setCvv("123");
                }}
                style={{
                  backgroundColor: "#1C8733",
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: "white", textAlign: "center" }}>Use Test Card</Text>
              </TouchableOpacity>

              <View style={styles.cardBox}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput placeholder="1234 5678 9012 3456" style={styles.input} keyboardType="numeric" value={cardNumber} onChangeText={handleCardNumberChange} maxLength={19} />
                <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
                <TextInput placeholder="MM/YY" style={styles.input} keyboardType="numeric" value={expiry} onChangeText={handleExpiryChange} maxLength={5} />
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput placeholder="123" style={styles.input} keyboardType="numeric" maxLength={3} value={cvv} onChangeText={setCvv} />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.payBtn, { opacity: isPayEnabled() && !loadingPay ? 1 : 0.5 }]}
            onPress={handlePayMada}
            disabled={!isPayEnabled() || loadingPay}
          >
            <Text style={styles.payText}>{loadingPay ? "Processing..." : "Pay with Mada"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 14, color: "#333" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" },
  inputLabel: { fontSize: 13, fontWeight: "600", marginBottom: 4, color: "#555" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", flex: 1 },
  locationCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  mapBox: { height: 300, borderRadius: 14, overflow: "hidden", marginBottom: 20, borderWidth: 1, borderColor: "#8DA47E" },
  mapHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 8, backgroundColor: "#fff" },
  confirmBtn: { backgroundColor: "#4A6741", padding: 12, alignItems: "center" },
  payText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  row: { flexDirection: "row", marginBottom: 16 },
  optionBtn: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#8DA47E", alignItems: "center", backgroundColor: "#fff", marginRight: 8 },
  selectedOption: { backgroundColor: "#8DA47E" },
  optionText: { fontWeight: "600", color: "#333" },
  androidPickerBtn: { backgroundColor: "#4A6741", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 },
  radioBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#8DA47E", marginBottom: 10 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#4A6741", alignItems: "center", justifyContent: "center", marginRight: 10 },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#4A6741" },
  radioText: { fontWeight: "600", color: "#333" },
  cardBox: { backgroundColor: "#fff", padding: 12, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: "#8DA47E" },
  payBtn: { backgroundColor: "#4A6741", padding: 16, borderRadius: 16, alignItems: "center", marginBottom: 20 },
});
