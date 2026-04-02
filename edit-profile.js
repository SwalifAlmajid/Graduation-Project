import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  Text, 
  Animated,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+966');
  const [address, setAddress] = useState('اختر عنوانك');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  const handleSave = async () => {
    if (!name || !email || !phone || !address || phone === '+966') {
      Alert.alert('خطأ', 'يرجى تعبئة جميع الحقول');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('خطأ', 'البريد الإلكتروني غير صالح');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!/^966\d{9}$/.test(phoneDigits)) {
      Alert.alert('خطأ', 'رقم الهاتف يجب أن يبدأ بـ +966 ويكون 12 رقم');
      return;
    }

    try {
      setLoading(true);

      await setDoc(doc(db, 'users', 'user1'), {
        name,
        email,
        phone,
        address,
        updatedAt: new Date(),
      });

      setLoading(false);
      setSaved(true);
      fadeIn();

      setTimeout(() => {
        fadeOut();
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert('خطأ', 'حدث خطأ أثناء الحفظ، حاول مرة أخرى');
    }
  };

  const handleSelectAddress = () => {
    router.push('/select-address');
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.background}>
      <Text style={styles.title}>تعديل الملف الشخصي</Text>

      <View style={styles.whiteContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

          <Text style={styles.label}>الأسم</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="ادخل اسمك"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="ادخل بريدك الإلكتروني"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>رقم الهاتف</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={(text) => {
              let digits = text.replace(/\D/g, '');
              if (!digits.startsWith('966')) digits = '966' + digits.slice(0, 9);
              if (digits.length > 12) digits = digits.slice(0, 12);
              setPhone('+' + digits);
            }}
            keyboardType="numeric"
            placeholder="+966xxxxxxxxx"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>العنوان</Text>
          <TouchableOpacity style={styles.addressButton} onPress={handleSelectAddress}>
            <Text style={{color: '#2f6b3c'}}>{address}</Text>
            <Ionicons name="location-outline" size={20} color="#2f6b3c" style={{marginLeft: 6}} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>حفظ التغييرات</Text>}
          </TouchableOpacity>

          {saved && (
            <Animated.View style={[styles.savedMessage, { opacity: fadeAnim }]}>
              <Text style={styles.savedText}>تم الحفظ ✔</Text>
            </Animated.View>
          )}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#63A874",
    paddingTop: 120,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
  },
  label: {
    marginBottom: 8,
    color: "#777",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },
  addressButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#2E7D32",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  savedMessage: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: '#A5D6A7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  savedText: {
    color: '#2f6b3c',
    fontWeight: '700',
  },
});