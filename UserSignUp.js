import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, InputField, styles } from './StylesColors';
import { auth, db } from './firebaseConfig';

const UserSignUp = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState('مستخدم');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    if (type === 'مزارع') navigation.navigate('FarmerSignUp');
    if (type === 'كابتن') navigation.navigate('DeliverySignUp');
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      Alert.alert("خطأ", "يرجى تعبئة الحقول الأساسية");
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
        fullName: fullName,
        phone: phone,
        email: email,
        userType: 'customer',
        createdAt: new Date(),
      });

      Alert.alert('نجاح', 'تم إنشاء الحساب بنجاح', [
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
            <Ionicons name="chevron-forward" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>سجل اشتراكك في حصاد</Text>
      </View>

      <View style={styles.formCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>هل أنت :</Text>
          <View style={styles.typeRow}>
            {['كابتن', 'مستخدم', 'مزارع'].map((type) => (
              <TouchableOpacity 
                key={type}
                style={[styles.typeBadge, selectedType === type && styles.activeBadge]}
                onPress={() => handleTypeSelection(type)}
              >
                <Text style={[styles.typeText, selectedType === type && styles.activeTypeText]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <InputField label="اسم المستخدم" placeholder="حصاد" value={fullName} onChangeText={setFullName} />
          <InputField label="رقم الجوال" placeholder="5xxxxxxxx" prefix="+966" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <InputField
            label="البريد الإلكتروني"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            showValidIcon
          />
          <InputField label="كلمة المرور" placeholder="........" isPassword value={password} onChangeText={setPassword} />
          <InputField label="تأكيد كلمة المرور" placeholder="........" isPassword value={confirmPassword} onChangeText={setConfirmPassword} />

          <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>اشترك</Text>}
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

export default UserSignUp;
