import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth } from './firebaseConfig';
import { Colors } from './StylesColors';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      Alert.alert('تنبيه', 'أدخل بريداً إلكترونياً صالحاً');
      return;
    }
    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(trimmed);
      Alert.alert('تم الإرسال', 'تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور', [
        { text: 'حسناً', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('خطأ', e?.message || 'تعذر إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="رجوع"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-forward" size={28} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>استعادة كلمة المرور</Text>
        <Text style={styles.sub}>أدخل بريدك المسجّل وسنرسل لك رابطاً لإعادة التعيين</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>البريد الإلكتروني</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="example@gmail.com"
          placeholderTextColor="#AAA"
          keyboardType="email-address"
          autoCapitalize="none"
          textAlign="right"
        />
        <TouchableOpacity style={styles.cta} onPress={submit} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.ctaText}>إرسال الرابط</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  header: { paddingHorizontal: 24, paddingBottom: 24 },
  back: { alignSelf: 'flex-end', padding: 8, marginBottom: 8 },
  title: { color: Colors.white, fontSize: 24, fontWeight: 'bold', textAlign: 'right' },
  sub: { color: 'rgba(255,255,255,0.9)', fontSize: 15, textAlign: 'right', marginTop: 10, lineHeight: 22 },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 28,
  },
  label: { textAlign: 'right', fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  cta: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  ctaText: { color: Colors.white, fontSize: 17, fontWeight: 'bold' },
});

export default ForgotPasswordScreen;
