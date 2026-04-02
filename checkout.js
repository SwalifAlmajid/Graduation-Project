import React, { useEffect, useState, useRef } from "react";
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
  Animated,
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [savedMessage, setSavedMessage] = useState("");

  const mapStyle = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d0f0c0" }] },
  ];

  useEffect(() => { getCurrentLocation(); }, []);

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") { alert("يرجى تفعيل الوصول للموقع"); setLoadingLocation(false); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords(loc.coords);
      const [address] = await Location.reverseGeocodeAsync(loc.coords);
      const formatted = `${address.street || ""} ${address.name || ""}, ${address.city || ""}`.trim();
      setLocation(formatted);
    } catch (e) { console.log(e); alert("تعذر تحديد الموقع."); }
    setLoadingLocation(false);
  };

  const confirmLocation = async () => {
    if (!coords) return;
    const [address] = await Location.reverseGeocodeAsync(coords);
    setLocation(`${address.street || ""} ${address.name || ""}, ${address.city || ""}`.trim());
    setMapVisible(false);
    showSaved("تم تأكيد الموقع!");
  };

  const showSaved = (msg) => {
    setSavedMessage(msg);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    setTimeout(() => Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(), 2000);
  };

  const RadioOption = ({ label, value }) => (
    <TouchableOpacity style={styles.radioBtn} onPress={() => setPaymentMethod(value)}>
      <View style={styles.radioOuter}>{paymentMethod === value && <View style={styles.radioInner} />}</View>
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );

  const handleSelectMada = () => { setPaymentMethod("mada"); setCardNumber(""); setExpiry(""); setCvv(""); };

  const isPayEnabled = () => paymentMethod && (paymentMethod !== "mada" || (cardNumber && expiry && cvv));

  const handleCardNumberChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    setCardNumber(cleaned.match(/.{1,4}/g)?.join(" ") || "");
  };

  const handleExpiryChange = (text) => {
    let formatted = text.replace(/\D/g, "");
    if (formatted.length > 2) formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
    setExpiry(formatted);
  };

  const handlePayMada = async () => {
    setLoadingPay(true);
    if (!isPayEnabled()) { Alert.alert("معلومات غير كاملة"); setLoadingPay(false); return; }
    try { showSaved("تم الدفع بنجاح!"); } catch (e) { Alert.alert("خطأ في الدفع"); }
    setLoadingPay(false);
  };

  return (
    <KeyboardAvoidingView style={styles.background} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <Text style={styles.title}>الدفع</Text>
      <View style={styles.whiteContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Location */}
          <Text style={styles.label}>موقع التوصيل</Text>
          <View style={styles.locationCard}>
            {loadingLocation ? <ActivityIndicator size="small" color="#2f6b3c" style={{ marginRight: 10 }} /> : <Ionicons name="location-sharp" size={24} color="#2f6b3c" style={{ marginRight: 8 }} />}
            <TextInput style={styles.input} placeholder="الشارع، المبنى، المدينة" value={location} editable={false} />
            <TouchableOpacity onPress={() => setMapVisible(true)} style={{ marginLeft: 8 }}><Ionicons name="pencil" size={24} color="#2f6b3c" /></TouchableOpacity>
          </View>

          {mapVisible && (
            <View style={styles.mapBox}>
              <View style={styles.mapHeader}>
                <Text style={{ fontWeight: "700" }}>اختر الموقع</Text>
                <TouchableOpacity onPress={() => setMapVisible(false)}><Ionicons name="close" size={28} color="#2f6b3c" /></TouchableOpacity>
              </View>
              <MapView
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapStyle}
                initialRegion={{ latitude: coords?.latitude || 24.7136, longitude: coords?.longitude || 46.6753, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                onPress={(e) => setCoords(e.nativeEvent.coordinate)}
              >
                {coords && <Marker coordinate={coords} draggable onDragEnd={(e) => setCoords(e.nativeEvent.coordinate)} />}
              </MapView>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmLocation}><Text style={styles.payText}>تأكيد الموقع</Text></TouchableOpacity>
            </View>
          )}

          {/* Delivery Time */}
          <Text style={styles.label}>وقت التوصيل</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.optionBtn, schedule === "now" && styles.selectedOption]} onPress={() => setSchedule("now")}><Text style={styles.optionText}>اطلب الآن</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.optionBtn, schedule === "later" && styles.selectedOption]} onPress={() => setSchedule("later")}><Text style={styles.optionText}>تحديد موعد</Text></TouchableOpacity>
          </View>
          {schedule === "later" && Platform.OS === "android" && <TouchableOpacity style={styles.androidPickerBtn} onPress={() => setShowPicker(true)}><Text style={{ color: "#fff", fontWeight: "600" }}>اختر التاريخ والوقت</Text></TouchableOpacity>}
          {(showPicker || Platform.OS === "ios") && <DateTimePicker value={date} mode="datetime" display="default" onChange={(_, d) => { if (Platform.OS === "android") setShowPicker(false); if (d) setDate(d); }} minimumDate={new Date()} />}
          {schedule === "later" && <Text style={{ marginBottom: 16, fontWeight: "600" }}>المحدد: {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>}

          {/* Payment */}
          <Text style={styles.label}>طريقة الدفع</Text>
          <TouchableOpacity style={styles.radioBtn} onPress={handleSelectMada}><View style={styles.radioOuter}>{paymentMethod === "mada" && <View style={styles.radioInner} />}</View><Text style={styles.radioText}>مدى</Text></TouchableOpacity>
          <RadioOption label="الدفع عند الاستلام" value="cash" />

          {paymentMethod === "mada" && (
            <View style={styles.cardBox}>
              <Text style={styles.inputLabel}>رقم البطاقة</Text>
              <TextInput placeholder="1234 5678 9012 3456" style={styles.input} keyboardType="numeric" value={cardNumber} onChangeText={handleCardNumberChange} maxLength={19} />
              <Text style={styles.inputLabel}>تاريخ الانتهاء (MM/YY)</Text>
              <TextInput placeholder="MM/YY" style={styles.input} keyboardType="numeric" value={expiry} onChangeText={handleExpiryChange} maxLength={5} />
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput placeholder="123" style={styles.input} keyboardType="numeric" maxLength={3} value={cvv} onChangeText={setCvv} />
            </View>
          )}

          <TouchableOpacity style={[styles.payBtn, { opacity: isPayEnabled() && !loadingPay ? 1 : 0.5 }]} onPress={handlePayMada} disabled={!isPayEnabled() || loadingPay}>
            <Text style={styles.payText}>{loadingPay ? "جاري الدفع..." : "ادفع"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {savedMessage && <Animated.View style={[styles.savedMessage, { opacity: fadeAnim }]}><Text style={styles.savedText}>{savedMessage}</Text></Animated.View>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#63A874", paddingTop: Platform.OS === "ios" ? 80 : 50 },
  title: { color: "#fff", fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  whiteContainer: { flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 20 },
  label: { color: "#2f6b3c", fontWeight: "700", marginBottom: 6, textAlign: "right" },
  inputLabel: { color: "#2f6b3c", fontWeight: "600", marginBottom: 6, textAlign: "right" },
  input: { borderBottomWidth: 1, borderBottomColor: "#dcdcdc", paddingVertical: 10, textAlign: "right", flex: 1 },
  locationCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#f9fdf9", borderRadius: 20, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#e0eee0" },
  mapBox: { height: 300, borderRadius: 24, overflow: "hidden", marginBottom: 20, borderWidth: 1, borderColor: "#e0eee0" },
  mapHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, backgroundColor: "#f9fdf9" },
  confirmBtn: { backgroundColor: "#2E7D32", padding: 14, alignItems: "center", borderRadius: 25, marginTop: 10 },
  payText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  row: { flexDirection: "row", marginBottom: 18 },
  optionBtn: { flex: 1, padding: 14, borderRadius: 25, borderWidth: 1, borderColor: "#dceedd", alignItems: "center", backgroundColor: "#fff", marginRight: 8 },
  selectedOption: { backgroundColor: "#e6f4ea", borderColor: "#2E7D32" },
  optionText: { fontWeight: "700", color: "#2f6b3c" },
  androidPickerBtn: { backgroundColor: "#2E7D32", padding: 14, borderRadius: 25, alignItems: "center", marginBottom: 12 },
  radioBtn: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 20, borderWidth: 1, borderColor: "#e0eee0", marginBottom: 10, backgroundColor: "#f9fdf9" },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#2E7D32", alignItems: "center", justifyContent: "center", marginRight: 10 },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2E7D32" },
  radioText: { fontWeight: "700", color: "#2f6b3c" },
  cardBox: { backgroundColor: "#f9fdf9", padding: 14, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: "#e0eee0" },
  payBtn: { backgroundColor: "#2E7D32", padding: 18, borderRadius: 30, alignItems: "center", marginBottom: 20 },
  savedMessage: { position: "absolute", top: 20, alignSelf: "center", backgroundColor: "#A5D6A7", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  savedText: { color: "#2f6b3c", fontWeight: "700" },
});
