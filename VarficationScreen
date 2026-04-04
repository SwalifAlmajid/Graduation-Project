import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';

const Colors = {
  primary: '#6CAF75',
  white: '#F6F6F6',
  accent: '#DDEADD',
  button: '#4D8E58',
  text: '#4F8A57',
};

export default function App({ navigation, route }) {
  const OTP_LENGTH = 6;
  const RESEND_SECONDS = 60;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [confirmation, setConfirmation] = useState(route?.params?.confirmation);

  const phoneNumber =
    route?.params?.phoneNumber || route?.params?.phone || '';

  const refs = useMemo(
    () => Array.from({ length: OTP_LENGTH }, () => React.createRef()),
    []
  );

  const autoSubmittedRef = useRef(false);

  const focusInput = index => {
    if (index >= 0 && index < OTP_LENGTH) {
      refs[index]?.current?.focus?.();
    }
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const resetOtpBoxes = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    autoSubmittedRef.current = false;
    setTimeout(() => focusInput(0), 100);
  };

  const submitCode = async code => {
    if (loading) return;

    if (code.length !== OTP_LENGTH) {
      Alert.alert('تنبيه', 'يرجى إدخال رمز التحقق كاملًا');
      return;
    }

    if (!confirmation) {
      Alert.alert('خطأ', 'لم يتم العثور على جلسة التحقق');
      return;
    }

    setLoading(true);
    try {
      await confirmation.confirm(code);

      Alert.alert('تم', 'تم التحقق بنجاح');

      navigation.navigate('ResetPasswordScreen', {
        phoneNumber,
      });
    } catch (error) {
      console.log('OTP error:', error);
      Alert.alert('خطأ', 'رمز التحقق غير صحيح أو منتهي الصلاحية');
      autoSubmittedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const code = otp.join('');
    if (
      code.length === OTP_LENGTH &&
      !otp.includes('') &&
      !autoSubmittedRef.current &&
      !loading
    ) {
      autoSubmittedRef.current = true;
      submitCode(code);
    }
  }, [otp, loading]);

  const handleChange = (value, index) => {
    const cleanValue = value.replace(/\D/g, '');

    if (!cleanValue) {
      const updatedOtp = [...otp];
      updatedOtp[index] = '';
      setOtp(updatedOtp);
      autoSubmittedRef.current = false;
      return;
    }

    if (cleanValue.length > 1) {
      const pasted = cleanValue.slice(0, OTP_LENGTH).split('');
      const updatedOtp = Array(OTP_LENGTH).fill('');

      for (let i = 0; i < pasted.length; i++) {
        updatedOtp[i] = pasted[i];
      }

      setOtp(updatedOtp);
      autoSubmittedRef.current = false;

      const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      focusInput(nextIndex);
      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = cleanValue;
    setOtp(updatedOtp);
    autoSubmittedRef.current = false;

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index]) {
        const updatedOtp = [...otp];
        updatedOtp[index] = '';
        setOtp(updatedOtp);
        autoSubmittedRef.current = false;
      } else if (index > 0) {
        const updatedOtp = [...otp];
        updatedOtp[index - 1] = '';
        setOtp(updatedOtp);
        autoSubmittedRef.current = false;
        focusInput(index - 1);
      }
    }
  };

  const handleConfirm = async () => {
    const code = otp.join('');
    await submitCode(code);
  };

  const handleResendCode = async () => {
    if (!phoneNumber) {
      Alert.alert('خطأ', 'رقم الجوال غير موجود');
      return;
    }

    if (secondsLeft > 0 || resending) {
      return;
    }

    setResending(true);
    try {
      const newConfirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(newConfirmation);
      resetOtpBoxes();
      setSecondsLeft(RESEND_SECONDS);
      Alert.alert('تم', 'تمت إعادة إرسال رمز التحقق');
    } catch (error) {
      console.log('Resend OTP error:', error);
      Alert.alert('خطأ', 'تعذر إعادة إرسال الرمز');
    } finally {
      setResending(false);
    }
  };

  const formatTime = totalSeconds => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />

      <SafeAreaView style={styles.topSafe}>
        <View style={styles.topSection}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={18} color="#111" />
          </TouchableOpacity>

          <Text style={styles.title}>رمز التحقق</Text>
        </View>
      </SafeAreaView>

      <View style={styles.whiteContainer}>
        <Text style={styles.message}>
          لقد أرسلنا رمز التحقق إلى{'\n'}رقم الجوال
        </Text>

        <View style={styles.row}>
          {otp.map((v, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              value={v}
              maxLength={i === 0 ? OTP_LENGTH : 1}
              keyboardType="number-pad"
              onChangeText={t => handleChange(t, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              style={styles.box}
              textAlign="center"
              editable={!loading && !resending}
            />
          ))}
        </View>

        <View style={styles.timerWrap}>
          <Text style={styles.timerText}>
            {secondsLeft > 0
              ? `إعادة الإرسال خلال ${formatTime(secondsLeft)}`
              : 'يمكنك إعادة إرسال الرمز الآن'}
          </Text>

          <TouchableOpacity
            onPress={handleResendCode}
            disabled={secondsLeft > 0 || resending || loading}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.resendText,
                (secondsLeft > 0 || resending || loading) &&
                  styles.resendTextDisabled,
              ]}
            >
              {resending ? 'جارٍ إعادة الإرسال...' : 'إعادة إرسال الرمز'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleConfirm}
          disabled={loading || resending}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>تأكيد</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  topSafe: {
    backgroundColor: Colors.primary,
  },

  topSection: {
    height: 230,
    paddingHorizontal: 18,
    justifyContent: 'flex-end',
  },

  back: {
    position: 'absolute',
    top: 10,
    left: 10,
  },

  title: {
    alignSelf: 'flex-end',
    marginRight: 28,
    marginBottom: 90,
    fontSize: 34,
    color: '#fff',
    fontWeight: 'bold',
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 77,
    borderTopRightRadius: 77,
    marginTop: -40,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  message: {
    alignSelf: 'right',
    textAlign: 'right',
    fontSize: 24,
    lineHeight: 42,
    color: Colors.text,
    fontWeight: '800',
    marginRight: 18,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
  },

  box: {
    width: 80,
    height: 70,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    fontSize: 28,
    fontWeight: 'bold',
  },

  timerWrap: {
    marginTop: 26,
    alignItems: 'center',
  },

  timerText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },

  resendText: {
    fontSize: 16,
    color: Colors.button,
    fontWeight: '700',
    textAlign: 'center',
  },

  resendTextDisabled: {
    opacity: 0.5,
  },

  button: {
    marginTop: 100,
    width: '95%',
    alignSelf: 'center',
    height: 70,
    backgroundColor: Colors.button,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
