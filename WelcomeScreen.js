import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from './constants/Colors';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>مرحباً بك في حصاد</Text>
      <Text style={styles.subtitle}>من المزرعة إلى مائدتك مباشرة</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>ابدأ الآن</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 200, height: 200, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, color: Colors.text, marginBottom: 40 },
  button: { backgroundColor: Colors.primary, paddingVertical: 15, paddingHorizontal: 60, borderRadius: 25 },
  buttonText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' }
});

export default WelcomeScreen;