import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth } from './firebaseConfig';
import { Colors } from './StylesColors';
import { deliveryAuthEmailFromPhone } from './authHelpers';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidden, setHidden] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmed = email.trim();
    if (!trimmed || !password) {
      Alert.alert('تنبيه', 'يرجى إدخال البريد الإلكتروني أو رقم الجوال وكلمة المرور');
      return;
    }
    const loginEmail = trimmed.includes('@')
      ? trimmed.toLowerCase()
      : deliveryAuthEmailFromPhone(trimmed);
    if (!loginEmail || !loginEmail.includes('@')) {
      Alert.alert('تنبيه', 'يرجى إدخال بريد صحيح أو رقم جوال سعودي (مثال: 5xxxxxxxx).');
      return;
    }

    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(loginEmail, password);
      navigation.replace('Home');
    } catch (err) {
      console.log(err?.message);
      Alert.alert('فشل تسجيل الدخول', 'تحقق من البريد الإلكتروني وكلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
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
          <Text style={styles.welcome}>مرحباً بعودتك</Text>
          <Text style={styles.welcomeSub}>سجل دخولك!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>ادخل بريدك الإلكتروني او رقم الجوال</Text>
          <View style={styles.lineRow}>
            <TextInput
              style={styles.input}
              placeholder="حصاد"
              placeholderTextColor="#BBB"
              value={email}
              onChangeText={setEmail}
              textAlign="right"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.label, { marginTop: 22 }]}>كلمة المرور</Text>
          <View style={styles.lineRow}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              textAlign="right"
              secureTextEntry={hidden}
            />
            <TouchableOpacity onPress={() => setHidden((h) => !h)} hitSlop={12}>
              <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotWrap} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgot}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cta} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.ctaText}>تسجيل الدخول</Text>}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerMuted}>ليس لديك حساب؟</Text>
            <TouchableOpacity onPress={() => navigation.navigate('UserSignUp')}>
              <Text style={styles.footerLink}> اشترك</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 32,
    alignItems: 'flex-end',
  },
  headerTopRow: {
    direction: 'ltr',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 8,
  },
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: { color: Colors.white, fontSize: 26, fontWeight: 'bold' },
  welcomeSub: { color: Colors.white, fontSize: 22, fontWeight: '600', marginTop: 4 },
  card: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 36,
  },
  label: { textAlign: 'right', color: '#444', fontSize: 15, fontWeight: '600' },
  lineRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    marginTop: 8,
    paddingBottom: 6,
  },
  input: { flex: 1, fontSize: 17, color: '#222', paddingVertical: 6 },
  forgotWrap: { alignSelf: 'flex-end', marginTop: 14, marginBottom: 28 },
  forgot: { color: Colors.primary, fontSize: 15, textDecorationLine: 'underline', fontWeight: '600' },
  cta: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    paddingBottom: 24,
  },
  footerMuted: { color: '#888', fontSize: 15 },
  footerLink: { color: Colors.primary, fontWeight: 'bold', fontSize: 15 },
});

export default LoginScreen;
