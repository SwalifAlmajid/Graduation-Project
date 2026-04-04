import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, InputField, styles } from './StylesColors';
import { auth, db } from './firebaseConfig';

const DeliverySignUp = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [carType, setCarType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeliverySignUp = async () => {
    if (!email?.trim() || !password) {
      Alert.alert('تنبيه', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        fullName,
        phone,
        idNumber,
        carType,
        plateNumber,
        email,
        userType: 'delivery',
        createdAt: new Date(),
      });

      Alert.alert('نجاح', 'تم تسجيلك ككابتن في حصاد', [
        { text: 'حسناً', onPress: () => navigation.replace('Home') },
      ]);
    } catch (error) {
      Alert.alert("خطأ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="رجوع"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-forward" size={30} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>سجل اشتراكك ككابتن</Text>
      </View>
      <View style={styles.formCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <InputField label="اسم الكابتن" placeholder="الاسم الكامل" value={fullName} onChangeText={setFullName} />
          <InputField label="البريد الإلكتروني" placeholder="example@gmail.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <InputField label="رقم الجوال" placeholder="5xxxxxxxx" prefix="+966" value={phone} onChangeText={setPhone} />
          <InputField label="رقم الهوية / الإقامة" placeholder="10xxxxxxxx" value={idNumber} onChangeText={setIdNumber} />
          <InputField label="نوع المركبة" placeholder="مثلاً: تويوتا كامري" value={carType} onChangeText={setCarType} />
          <InputField label="رقم لوحة المركبة" placeholder="أ ب ج 1 2 3" value={plateNumber} onChangeText={setPlateNumber} />
          <InputField label="كلمة المرور" placeholder="........" isPassword value={password} onChangeText={setPassword} />
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleDeliverySignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>اشترك الآن</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DeliverySignUp;