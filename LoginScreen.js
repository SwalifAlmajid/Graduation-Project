import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>تسجيل الدخول</Text>
        <Text style={styles.subTitle}>مرحباً بك مجدداً في حصاد</Text>

        {/* حقل البريد الإلكتروني */}
        <TextInput
          style={styles.input}
          placeholder="البريد الإلكتروني"
          value={email}
          onChangeText={setEmail}
          textAlign="right"
          keyboardType="email-address"
        />

        {/* حقل كلمة المرور */}
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          textAlign="right"
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotPass}>
          <Text style={styles.forgotText}>نسيت كلمة المرور؟</Text>
        </TouchableOpacity>

        {}
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Home')} 
        >
          <Text style={styles.buttonText}>دخول</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}> سجل الآن</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>ليس لديك حساب؟</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 30, justifyContent: 'center', marginTop: 50 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#4A6741', textAlign: 'center' },
  subTitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 40, marginTop: 10 },
  input: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    fontSize: 16
  },
  forgotPass: { alignSelf: 'flex-start', marginBottom: 30 },
  forgotText: { color: '#4A6741', fontWeight: '600' },
  loginButton: {
    backgroundColor: '#4A6741',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 2
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#888' },
  registerLink: { color: '#4A6741', fontWeight: 'bold' }
});

export default LoginScreen;