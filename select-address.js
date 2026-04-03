// app/select-address.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

// بطاقة العنوان
const AddressItem = ({ item, onSelect, onDelete, onEdit }) => {
  const handleEditPress = () => {
    Alert.alert(
      "خيارات",
      `اختر ما تريد فعله مع "${item.name}"`,
      [
        { text: "إلغاء", style: "cancel" },
        { text: "حذف", style: "destructive", onPress: () => onDelete(item) },
        { text: "تعديل", onPress: () => onEdit(item) },
      ]
    );
  };

  return (
    <View style={styles.addressCard}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => onSelect(item.fullAddress || item.name)}
      >
        <Text style={styles.addressText}>{item.name}</Text>
        <Text style={{ color: "#555", fontSize: 12 }}>
          {item.fullAddress || ""}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={handleEditPress}>
          <Text style={{ color: "#63A874", fontWeight: "600", fontSize: 14 }}>
            تعديل
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function SelectAddress() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [customName, setCustomName] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    getCurrentLocation();
    loadSavedAddresses();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("يرجى السماح بالوصول الى الموقع");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    const addr = await Location.reverseGeocodeAsync(loc.coords);
    if (addr.length > 0) {
      const a = addr[0];
      setFullAddress(`${a.name || ""}، ${a.street || ""}، ${a.city || ""}`);
    }
  };

  const loadSavedAddresses = async () => {
    const saved = await AsyncStorage.getItem("addresses");
    if (saved) setAddresses(JSON.parse(saved));
  };

  const saveAddressesToStorage = async (newAddresses) => {
    setAddresses(newAddresses);
    await AsyncStorage.setItem("addresses", JSON.stringify(newAddresses));
  };

  const handleMapPress = async (e) => {
    setLocation(e.nativeEvent.coordinate);
    const addr = await Location.reverseGeocodeAsync(e.nativeEvent.coordinate);
    if (addr.length > 0) {
      const a = addr[0];
      setFullAddress(`${a.name || ""}، ${a.street || ""}، ${a.city || ""}`);
    }
  };

  const openModalForNaming = () => {
    if (!location) {
      Alert.alert("اختر موقعًا على الخريطة");
      return;
    }
    setEditingAddressId(null); 
    setCustomName("");
    setSelectedType("");
    setModalVisible(true);
  };

  const handleSelectAddress = (addr) => {
    router.push({
      pathname: "/edit-profile",
      params: { selectedAddress: addr },
    });
  };

  const handleDelete = async (item) => {
    Alert.alert(
      "تأكيد الحذف",
      `هل تريد حذف ${item.name}؟`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            const filtered = addresses.filter((a) => a.id !== item.id);
            await saveAddressesToStorage(filtered);
          },
        },
      ]
    );
  };

  const handleEditAddress = (item) => {
    setEditingAddressId(item.id); // نحدد عنوان للتعديل
    setLocation({ latitude: item.latitude, longitude: item.longitude });
    setFullAddress(item.fullAddress);
    setCustomName(item.name);
    setSelectedType(item.type);
    setModalVisible(true);
  };

  const handleSaveAddress = async () => {
    if (!selectedType && !customName.trim()) {
      Alert.alert("أدخل تفاصيل العنوان");
      return;
    }
    const nameToSave = customName.trim() || selectedType;
    const newAddress = {
      id: editingAddressId || Date.now().toString(),
      name: nameToSave,
      type: selectedType || "أخرى",
      fullAddress,
      latitude: location.latitude,
      longitude: location.longitude,
      default: addresses.length === 0,
    };

    let updatedAddresses;
    if (editingAddressId) {
      updatedAddresses = addresses.map((a) =>
        a.id === editingAddressId ? newAddress : a
      );
    } else {
      updatedAddresses = [...addresses, newAddress];
    }

    await saveAddressesToStorage(updatedAddresses);

    setCustomName("");
    setSelectedType("");
    setEditingAddressId(null);
    setModalVisible(false);

    router.push({
      pathname: "/edit-profile",
      params: { selectedAddress: fullAddress },
    });
  };

  return (
    <View style={styles.background}>
      <Text style={styles.title}>اختر عنوانك</Text>

      <View style={styles.whiteContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyleWhite}
          region={
            location && {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }
          }
          onPress={handleMapPress}
        >
          {location && (
            <Marker
              coordinate={location}
              title="موقعك"
              draggable
              onDragEnd={(e) => handleMapPress(e)}
            />
          )}
        </MapView>

        <TouchableOpacity
          style={styles.currentLocationBtn}
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveLocationBtn}
          onPress={openModalForNaming}
        >
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}
          >
            حفظ الموقع
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>عناوينك المحفوظة</Text>
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AddressItem
              item={item}
              onSelect={handleSelectAddress}
              onDelete={handleDelete}
              onEdit={handleEditAddress}
            />
          )}
          ListEmptyComponent={
            <Text style={{ color: "#999" }}>ليس لديك عناوين محفوظة</Text>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}
              >
                {fullAddress || "الموقع الحالي"}
              </Text>
              <Text style={{ fontSize: 14, color: "#555", marginBottom: 15 }}>
                تفاصيل العنوان
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  marginBottom: 10,
                }}
              >
                {["المنزل", "العمل", "الاستراحة", "أخرى"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    activeOpacity={0.7}
                    style={[
                      styles.addressTypeOvalBtn,
                      selectedType === type && {
                        borderColor: "#4a8e5a",
                        backgroundColor: "#e6f4ea",
                      },
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text style={styles.addressTypeBtnText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ marginBottom: 5, fontWeight: "600" }}>
                اسم العنوان
              </Text>
              <TextInput
                value={customName}
                onChangeText={setCustomName}
                style={styles.customNameInput}
              />

              <TouchableOpacity
                style={[
                  styles.addressTypeOvalBtn,
                  {
                    marginTop: 10,
                    width: "100%",
                    backgroundColor: "#63A874",
                    borderColor: "#63A874",
                  },
                ]}
                onPress={handleSaveAddress}
              >
                <Text
                  style={[styles.addressTypeBtnText, { color: "#fff" }]}
                >
                  حفظ العنوان
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addressTypeOvalBtn,
                  { backgroundColor: "#ddd", marginTop: 10, width: "100%" },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[styles.addressTypeBtnText, { color: "#333" }]}
                >
                  إلغاء
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const mapStyleWhite = [
  { elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
];

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#63A874", paddingTop: 120 },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
  },
  map: { width: "100%", height: 250, borderRadius: 20, marginBottom: 15 },
  currentLocationBtn: {
    position: "absolute",
    top: 210,
    right: 30,
    backgroundColor: "#63A874",
    padding: 12,
    borderRadius: 30,
    zIndex: 10,
  },
  saveLocationBtn: {
    backgroundColor: "#63A874",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#000" },
  addressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },
  addressText: { fontSize: 16, color: "#2f6b3c", fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 16 },
  addressTypeOvalBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#000", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, marginRight: 8, marginBottom: 5, minWidth: 60, alignItems: "center" },
  addressTypeBtnText: { color: "#000", fontWeight: "600", fontSize: 13 },
  customNameInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, fontSize: 14 },
});