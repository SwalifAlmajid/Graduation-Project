// app/review.js
import React, { useState, useRef } from 'react';
import { 
  View, TextInput, TouchableOpacity, ScrollView, StyleSheet, Text, Animated, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Review({ userId = 0, productId = 0, farrmsId = "" }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (stars === 0) {
    Alert.alert('تنبيه', 'يرجى تحديد تقييم قبل الإرسال');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      await addDoc(collection(db, 'Reviews'), {
        Comment: feedback.trim() || "",
        CreatedAt: serverTimestamp(),
        FarrmsID: farrmsId,
        ProductID: productId,
        Rating: stars,
        UserID: userId
      });

      setSaved(true);
      fadeIn();

      setStars(0);
      setFeedback('');

      setTimeout(() => {
        fadeOut();
        setSaved(false);
      }, 2500);

    } catch (error) {
      Alert.alert('خطأ', 'فشل إرسال التقييم');
      console.log(error);
    } finally {
      setLoading(false);
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

  const handleStarPress = (star) => {
    setStars(star);
    bounceAnim.setValue(0.8);
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true
    }).start();
  };

  return (
    <View style={styles.background}>
      <Text style={styles.header}>التقييم</Text>

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <Text style={styles.title}>قيّم تجربتك</Text>

          {/* Stars */}
          <Text style={styles.label}>التقييم</Text>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => handleStarPress(star)}
                activeOpacity={0.7}
              >
                <Animated.View style={{transform: [{scale: stars === star ? bounceAnim : 1}]}}>
                  <Ionicons 
                    name={star <= stars ? "star" : "star-outline"} 
                    size={42} 
                    color={star <= stars ? "#FFC107" : "#ccc"} 
                    style={styles.star}
                  />
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Optional Feedback */}
          <Text style={styles.label}>أي ملاحظات؟</Text>
          <TextInput
            value={feedback}
            onChangeText={setFeedback}
            style={styles.input}
            multiline
          />

          {/* Button */}
          <TouchableOpacity 
            style={[
              styles.button, 
              (stars === 0 || loading) && {opacity:0.5}
            ]}
            onPress={handleSave}
            disabled={stars === 0 || loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </Text>
          </TouchableOpacity>

          {/* Success Message */}
          {saved && (
            <Animated.View style={[styles.toast, {opacity: fadeAnim}]}>
              <Text style={styles.toastText}>شكرًا لك ✔ تم حفظ تقييمك</Text>
            </Animated.View>
          )}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex:1,
    backgroundColor:"#63A874",
    paddingTop:100
  },

  header: {
    color:"#fff",
    fontSize:24,
    textAlign:"center",
    fontWeight:"bold",
    marginBottom:15
  },

  container: {
    flex:1,
    backgroundColor:"#fff",
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
    padding:20,
    width:'100%',
  },

  scrollContent: {
    alignItems:'center',
    paddingBottom:40
  },

  title: {
    fontSize:20,
    fontWeight:"bold",
    marginBottom:15,
    textAlign:"center",
    color:"#2E7D32"
  },

  label: {
  marginTop:15,
  marginBottom:8,
  fontWeight:"600",
  color:"#444",
  alignSelf:'center', 
  textAlign:'center'   
},

  starsRow: {
    flexDirection:'row',
    justifyContent:"center",
    marginBottom:20
  },

  star: {
    marginHorizontal:5
  },

  input: {
    borderWidth:1,
    borderColor:"#ddd",
    borderRadius:15,
    padding:12,
    height:100,
    textAlignVertical:'top',
    fontSize:14,
    backgroundColor:"#fafafa",
    width:'100%'
  },

  button: {
    backgroundColor:"#2E7D32",
    padding:16,
    borderRadius:25,
    alignItems:"center",
    marginTop:20
  },

  buttonText: {
    color:"#fff",
    fontWeight:"bold",
    fontSize:15
  },

  toast: {
    position:"absolute",
    top:10,
    alignSelf:"center",
    backgroundColor:"#A5D6A7",
    paddingVertical:12,
    paddingHorizontal:20,
    borderRadius:25
  },

  toastText: {
    color:"#2f6b3c",
    fontWeight:"bold",
    fontSize:14
  }
});