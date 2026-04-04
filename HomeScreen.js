import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from './firebaseConfig';
import { Colors } from './StylesColors';

const HomeScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const logout = async () => {
    try {
      await auth.signOut();
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    } catch (e) {
      Alert.alert('خطأ', e?.message || 'تعذر تسجيل الخروج');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.inner}>
        <Text style={styles.title}>مرحباً في حصاد</Text>
        <Text style={styles.sub}>
          {user?.email ? user.email : 'تم تسجيل الدخول بنجاح'}
        </Text>
        <Text style={styles.hint}>
          هذه شاشة مبدئية بعد الدخول. لاحقاً يمكن ربطها بالمتجر، السلة، والطلبات.
        </Text>
        <TouchableOpacity style={styles.out} onPress={logout}>
          <Text style={styles.outText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.sageBg },
  inner: { flex: 1, padding: 28, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.primary, textAlign: 'center' },
  sub: { fontSize: 16, color: '#444', textAlign: 'center', marginTop: 12 },
  hint: { fontSize: 14, color: Colors.muted, textAlign: 'center', marginTop: 24, lineHeight: 22 },
  out: {
    marginTop: 40,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  outText: { color: Colors.white, fontWeight: 'bold', fontSize: 16 },
});

export default HomeScreen;
