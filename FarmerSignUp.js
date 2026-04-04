import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, InputField, styles } from './StylesColors'; 
import { auth, db } from './firebaseConfig';

const FarmerSignUp = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFarmerSignUp = async () => {
    if (!email || !password || !idNumber) {
      Alert.alert("خطأ", "يرجى تعبئة جميع الحقول");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("خطأ", "كلمة المرور غير متطابقة");
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
        email,
        userType: 'farmer',
        createdAt: new Date(),
      });

      Alert.alert('نجاح', 'تم تسجيلك كمزارع بنجاح', [
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
        <Text style={styles.headerTitle}>سجل اشتراكك كمزارع</Text>
      </View>

      <View style={styles.formCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* تأكدي من تمرير الـ value و onChangeText لكل حقل */}
          <InputField label="اسم المزارع" placeholder="الاسم الكامل" value={fullName} onChangeText={setFullName} />
          <InputField label="رقم الجوال" placeholder="5xxxxxxxx" prefix="+966" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <InputField label="البريد الإلكتروني" placeholder="example@gmail.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <InputField label="رقم الهوية/الإقامة" placeholder="10xxxxxxxx" value={idNumber} onChangeText={setIdNumber} keyboardType="numeric" />
          <InputField label="كلمة المرور" placeholder="........" isPassword value={password} onChangeText={setPassword} />
          <InputField label="تأكيد كلمة المرور" placeholder="........" isPassword value={confirmPassword} onChangeText={setConfirmPassword} />

          <TouchableOpacity style={styles.primaryButton} onPress={handleFarmerSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>أكمل بيانات المزرعة</Text>}
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
               <Text style={styles.linkText}>تسجيل الدخول</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>لديك حساب؟ </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};


export default FarmerSignUp;