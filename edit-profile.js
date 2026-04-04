import React, { useState, useRef } from 'react';
import { 
  View, TextInput, TouchableOpacity, ScrollView, StyleSheet, Text, Animated, ActivityIndicator, Alert
} from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfile() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+966');
  const [address, setAddress] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!name || !email || !phone || !address || phone === '+966') {
      Alert.alert('خطأ', 'يرجى تعبئة جميع الحقول');
      return;
    }

    try {
      setLoading(true);
      await setDoc(doc(db, 'Users', 'user1'), {
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
      setLoading(false);
      Alert.alert('خطأ', 'فشل الحفظ');
    }
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, { 
      toValue: 1, 
      duration: 300, 
      useNativeDriver: true 
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, { 
      toValue: 0, 
      duration: 300, 
      useNativeDriver: true 
    }).start();
  };

  return (
    <View style={styles.background}>
      <Text style={styles.title}>تعديل الملف الشخصي</Text>

      <View style={styles.whiteContainer}>
        <ScrollView>

          <Text style={styles.label}>الأسم</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
          />

          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
          />

          <Text style={styles.label}>رقم الهاتف</Text>
          <TextInput 
            style={styles.input} 
            value={phone} 
            onChangeText={setPhone} 
          />

          <Text style={styles.label}>العنوان</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="اكتب عنوانك هنا"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            {loading 
              ? <ActivityIndicator color="#fff"/> 
              : <Text style={styles.saveText}>حفظ</Text>
            }
          </TouchableOpacity>

          {saved && (
            <Animated.View style={[styles.savedMessage,{opacity:fadeAnim}]}>
              <Text style={styles.savedText}>تم الحفظ ✔</Text>
            </Animated.View>
          )}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background:{flex:1,backgroundColor:"#63A874",paddingTop:120},
  title:{color:"#fff",fontSize:26,textAlign:"center",fontWeight:"bold", marginBottom: 20},
  whiteContainer:{flex:1,backgroundColor:"#fff",borderTopLeftRadius:40,borderTopRightRadius:40,padding:20},

  label:{marginTop:15,marginBottom:5,fontWeight:"600"},
  input:{borderWidth:1,borderColor:"#ccc",borderRadius:12,padding:10},

  saveButton:{
    backgroundColor:"#2E7D32",
    padding:15,
    borderRadius:20,
    alignItems:"center",
    marginTop:20
  },

  saveText:{color:"#fff",fontWeight:"bold"},
  savedMessage:{
    position:"absolute",
    top:10,
    alignSelf:"center",
    backgroundColor:"#A5D6A7",
    padding:10,
    borderRadius:20
  },
  savedText:{color:"#2f6b3c",fontWeight:"bold"}
});
