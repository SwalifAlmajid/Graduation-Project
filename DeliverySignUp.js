import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors, InputField, styles } from './StylesColors';
import { auth, db, storage } from './firebaseConfig';
import { resolveDeliveryAuthEmail, normalizeSaudiPhoneDigits } from './authHelpers';
import {
  SAUDI_BANKS,
  LICENSE_TYPES_SA,
  VEHICLE_TYPES,
  NATIONALITIES_AR,
  CAR_BRANDS,
  CAR_BRAND_MODELS,
} from './deliveryFormConstants';

const TERMS_BULLETS = [
  'أن يكون المندوب حسن السيرة والسلوك وغير محكوم عليه بالإدانة في جريمة مخلة بالشرف والأمانة ما لم يكن قد رد اعتباره إليه.',
  'رفع الصورة الشخصية (يجب أن تكون الصورة واضحة وأن تظهر كامل الوجه دون نظارات شمسية، كمامة أو فلتر).',
  'كتابة اسم المندوب كاملاً (الاسم الثلاثي) كما هو ظاهر في الهوية الوطنية / هوية مقيم.',
  'يتوجب على المندوب تشغيل الجوال المسجل في حصاد حال قبول الطلب.',
  'عدم التدخين في المركبة أثناء التوصيل لتجنب إفساد الطلب، وفي حال فساد الطلب بسبب خطأ من المندوب فلا يحق له المطالبة بأي تعويض.',
  'يمنع طلب العميل من خلال "واتساب" أو وسائل الاتصال الأخرى، والاكتفاء بتطبيق حصاد والذي من خلاله يمكنك طلب موقع العميل والتواصل معه بشكل سريع وآمن.',
  'يجب على المندوب التعريف بنفسه عند الاتصال ومراسلة العميل بالطريقة التالية: السلام عليكم، معك (فلان) مندوب تطبيق حصاد، ثم تزويده بتفاصيل الطلب.',
  'يجب المحافظة على سرية معلومات العملاء وعدم إفصاحها أو استخدامها لأي غرض شخصي.',
  'عدم توصيل طلبات الأطعمة والمشروبات إلا إذا كانت محكمة الإغلاق.',
];

const local = StyleSheet.create({
  selectTouchable: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
    minHeight: 44,
  },
  selectValue: { flex: 1, fontSize: 16, color: Colors.text, textAlign: 'right' },
  selectPlaceholder: { color: '#AAA' },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  modalCard: {
    maxHeight: '58%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingBottom: 16,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  modalItemText: { textAlign: 'right', fontSize: 16, color: Colors.text },
});

function SelectField({ label, value, options, onChange, optional, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label}
        {optional ? <Text style={styles.optionalMark}> (اختياري)</Text> : null}
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[local.selectTouchable, disabled && { opacity: 0.45 }]}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
      >
        <Text
          style={[local.selectValue, !value && local.selectPlaceholder]}
          numberOfLines={1}
        >
          {value || placeholder || 'اضغط للاختيار'}
        </Text>
        <Ionicons name="chevron-down" size={22} color={Colors.primary} />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={local.modalRoot}>
          <Pressable style={local.modalBackdrop} onPress={() => setOpen(false)} />
          <View style={local.modalCard}>
            <FlatList
              data={options}
              keyExtractor={(item, i) => `${item}-${i}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={local.modalItem}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text style={local.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

async function pickFromLibrary() {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('تنبيه', 'يرجى السماح بالوصول إلى معرض الصور لإكمال الرفع.');
    return null;
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.85,
    allowsEditing: false,
  });
  if (res.canceled || !res.assets?.[0]) return null;
  return res.assets[0].uri;
}

async function pickProfilePhoto() {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('تنبيه', 'يرجى السماح بالوصول إلى معرض الصور لإكمال الرفع.');
    return null;
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.9,
    allowsEditing: true,
    aspect: [1, 1],
  });
  if (res.canceled || !res.assets?.[0]) return null;
  return res.assets[0].uri;
}

async function uploadToStorage(path, uri) {
  const ref = storage.ref(path);
  const response = await fetch(uri);
  const blob = await response.blob();
  await ref.put(blob);
  return ref.getDownloadURL();
}

const DeliverySignUp = ({ navigation }) => {
  const [profileUri, setProfileUri] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [nationality, setNationality] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [plateLetters, setPlateLetters] = useState('');
  const [plateNumbers, setPlateNumbers] = useState('');
  const [chassisSerial, setChassisSerial] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [manufactureYear, setManufactureYear] = useState('');
  const [idDocUri, setIdDocUri] = useState(null);
  const [carFrontUri, setCarFrontUri] = useState(null);
  const [carBackUri, setCarBackUri] = useState(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const modelOptions = useMemo(() => {
    if (!carBrand) return [];
    return CAR_BRAND_MODELS[carBrand] || [];
  }, [carBrand]);

  const onPickProfile = async () => {
    const uri = await pickProfilePhoto();
    if (uri) setProfileUri(uri);
  };

  const validate = () => {
    if (!termsAccepted) {
      Alert.alert('تنبيه', 'يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية للمتابعة.');
      return false;
    }
    if (!fullName.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم الكابتن.');
      return false;
    }
    const phoneDigits = normalizeSaudiPhoneDigits(phone);
    if (phoneDigits.length < 12) {
      Alert.alert('تنبيه', 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 5xxxxxxxx).');
      return false;
    }
    if (!password || password.length < 6) {
      Alert.alert('تنبيه', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      return false;
    }
    const authEmail = resolveDeliveryAuthEmail(email, phone);
    if (!authEmail || !authEmail.includes('@')) {
      Alert.alert('تنبيه', 'تعذر إنشاء الحساب. أدخل البريد الإلكتروني أو تأكد من رقم الجوال.');
      return false;
    }
    const emailTrim = email.trim();
    if (emailTrim && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      Alert.alert('تنبيه', 'صيغة البريد الإلكتروني غير صحيحة.');
      return false;
    }
    if (!profileUri) {
      Alert.alert('تنبيه', 'يرجى إضافة الصورة الشخصية.');
      return false;
    }
    if (!nationality) {
      Alert.alert('تنبيه', 'يرجى اختيار الجنسية.');
      return false;
    }
    const id = idNumber.replace(/\D/g, '');
    if (id.length !== 10) {
      Alert.alert('تنبيه', 'رقم الهوية / الإقامة يجب أن يكون 10 أرقام.');
      return false;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      Alert.alert('تنبيه', 'تاريخ الميلاد بصيغة YYYY-MM-DD (مثال: 1995-06-15).');
      return false;
    }
    if (!licenseType || !vehicleType) {
      Alert.alert('تنبيه', 'يرجى اختيار نوع الرخصة ونوع السيارة.');
      return false;
    }
    if (!plateLetters.trim() || !plateNumbers.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال أحرف وأرقام لوحة السيارة.');
      return false;
    }
    const serial = chassisSerial.replace(/\D/g, '');
    if (serial.length < 6) {
      Alert.alert('تنبيه', 'الرقم التسلسلي للسيارة يجب أن يكون أرقاماً فقط وبطول مناسب.');
      return false;
    }
    if (!carBrand || !carModel) {
      Alert.alert('تنبيه', 'يرجى اختيار صنع السيارة والموديل.');
      return false;
    }
    const y = manufactureYear.replace(/\D/g, '');
    const yi = parseInt(y, 10);
    if (y.length !== 4 || yi < 1990 || yi > new Date().getFullYear() + 1) {
      Alert.alert('تنبيه', 'يرجى إدخال سنة تصنيع صحيحة (أربعة أرقام).');
      return false;
    }
    if (!idDocUri || !carFrontUri || !carBackUri) {
      Alert.alert('تنبيه', 'يرجى رفع صور الهوية والمركبة (الثلاث مطلوبة).');
      return false;
    }
    return true;
  };

  const handleDeliverySignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    const authEmail = resolveDeliveryAuthEmail(email, phone).toLowerCase();
    const phoneDigits = normalizeSaudiPhoneDigits(phone);
    const idDigits = idNumber.replace(/\D/g, '');
    const chassisDigits = chassisSerial.replace(/\D/g, '');
    const yearDigits = manufactureYear.replace(/\D/g, '');

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(authEmail, password);
      const { user } = userCredential;
      const base = `deliveryCaptains/${user.uid}`;

      let profileUrl = null;
      let idDocUrl = null;
      let carFrontUrl = null;
      let carBackUrl = null;
      try {
        [profileUrl, idDocUrl, carFrontUrl, carBackUrl] = await Promise.all([
          uploadToStorage(`${base}/profile.jpg`, profileUri),
          uploadToStorage(`${base}/id_document.jpg`, idDocUri),
          uploadToStorage(`${base}/vehicle_front.jpg`, carFrontUri),
          uploadToStorage(`${base}/vehicle_back.jpg`, carBackUri),
        ]);
      } catch (upErr) {
        console.warn('Storage upload failed', upErr);
        Alert.alert(
          'تنبيه',
          'تم إنشاء الحساب لكن تعذر رفع بعض الملفات. يمكنك إعادة المحاولة من الدعم لاحقاً.',
        );
      }

      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        userType: 'delivery',
        fullName: fullName.trim(),
        email: email.trim() || null,
        authLoginEmail: authEmail,
        phone: phoneDigits,
        bankName: bankName || null,
        bankAccount: bankAccount.replace(/\D/g, '') || null,
        nationality,
        idNumber: idDigits,
        birthDate,
        licenseType,
        vehicleType,
        plateLetters: plateLetters.trim(),
        plateNumbers: plateNumbers.replace(/\D/g, ''),
        chassisSerial: chassisDigits,
        carBrand,
        carModel,
        manufactureYear: yearDigits,
        profilePhotoUrl: profileUrl,
        idDocumentUrl: idDocUrl,
        vehicleFrontUrl: carFrontUrl,
        vehicleBackUrl: carBackUrl,
        termsAcceptedAt: new Date(),
        createdAt: new Date(),
      });

      Alert.alert('نجاح', 'تم تسجيلك ككابتن في حصاد', [
        { text: 'حسناً', onPress: () => navigation.replace('Home') },
      ]);
    } catch (error) {
      const code = error?.code;
      if (code === 'auth/email-already-in-use') {
        Alert.alert('خطأ', 'البريد أو رقم الجوال مسجل مسبقاً. جرّب تسجيل الدخول.');
      } else {
        Alert.alert('خطأ', error?.message || 'تعذر إنشاء الحساب');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
        <Text style={styles.headerTitle}>سجل اشتراكك ككابتن</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.formCard}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 36 }}
          >
            <View style={styles.avatarSection}>
              <TouchableOpacity style={styles.avatarCircle} onPress={onPickProfile} activeOpacity={0.85}>
                {profileUri ? (
                  <Image source={{ uri: profileUri }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Ionicons name="camera" size={40} color={Colors.primaryMuted} />
                )}
              </TouchableOpacity>
              <Text style={styles.avatarHint}>اضغط لإضافة صورة شخصية (دائرة)</Text>
            </View>

            <InputField label="اسم الكابتن" placeholder="الاسم الثلاثي كما في الهوية" value={fullName} onChangeText={setFullName} />
            <InputField
              label="الإيميل"
              optional
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <SelectField
              label="اسم البنك"
              optional
              value={bankName}
              options={SAUDI_BANKS}
              onChange={setBankName}
              placeholder="اختر البنك"
            />
            <InputField
              label="رقم الحساب البنكي"
              optional
              placeholder="أرقام الحساب فقط"
              value={bankAccount}
              onChangeText={(t) => setBankAccount(t.replace(/[^\d]/g, ''))}
              keyboardType="number-pad"
            />

            <SelectField
              label="الجنسية"
              value={nationality}
              options={NATIONALITIES_AR}
              onChange={setNationality}
              placeholder="اختر الجنسية"
            />
            <InputField
              label="رقم الهوية / الإقامة"
              placeholder="10 أرقام"
              value={idNumber}
              onChangeText={(t) => setIdNumber(t.replace(/\D/g, '').slice(0, 10))}
              keyboardType="number-pad"
            />
            <InputField
              label="تاريخ الميلاد"
              placeholder="YYYY-MM-DD"
              value={birthDate}
              onChangeText={setBirthDate}
            />

            <SelectField
              label="نوع الرخصة"
              value={licenseType}
              options={LICENSE_TYPES_SA}
              onChange={setLicenseType}
              placeholder="اختر نوع الرخصة"
            />
            <SelectField
              label="نوع السيارة"
              value={vehicleType}
              options={VEHICLE_TYPES}
              onChange={setVehicleType}
              placeholder="اختر نوع المركبة"
            />

            <Text style={styles.inputLabel}>لوحات السيارة (حروف وأرقام)</Text>
            <View style={styles.plateRow}>
              <View style={styles.plateFlex}>
                <InputField label="الحروف" placeholder="مثال: أ ب د" value={plateLetters} onChangeText={setPlateLetters} />
              </View>
              <View style={styles.plateFlex}>
                <InputField
                  label="الأرقام"
                  placeholder="1234"
                  value={plateNumbers}
                  onChangeText={(t) => setPlateNumbers(t.replace(/\D/g, '').slice(0, 4))}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <InputField
              label="الرقم التسلسلي للسيارة"
              placeholder="أرقام فقط"
              value={chassisSerial}
              onChangeText={(t) => setChassisSerial(t.replace(/\D/g, '').slice(0, 17))}
              keyboardType="number-pad"
            />

            <SelectField
              label="صنع السيارة"
              value={carBrand}
              options={CAR_BRANDS}
              onChange={(b) => {
                setCarBrand(b);
                setCarModel('');
              }}
              placeholder="اختر الماركة"
            />
            <SelectField
              label="موديل السيارة"
              value={carModel}
              options={modelOptions}
              onChange={setCarModel}
              disabled={!carBrand}
              placeholder={carBrand ? 'اختر الموديل' : 'اختر صنع السيارة أولاً'}
            />
            <InputField
              label="سنة التصنيع"
              placeholder="مثال: 2022"
              value={manufactureYear}
              onChangeText={(t) => setManufactureYear(t.replace(/\D/g, '').slice(0, 4))}
              keyboardType="number-pad"
            />

            <Text style={[styles.inputLabel, { marginBottom: 8 }]}>مستندات وصور المركبة</Text>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={async () => {
                const u = await pickFromLibrary();
                if (u) setIdDocUri(u);
              }}
            >
              <Text style={styles.uploadBtnText}>تحميل صورة واضحة من بطاقة الهوية / الإقامة</Text>
              <Ionicons name="cloud-upload-outline" size={26} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={async () => {
                const u = await pickFromLibrary();
                if (u) setCarFrontUri(u);
              }}
            >
              <Text style={styles.uploadBtnText}>تحميل المنظر الأمامي للمركبة بلوحات واضحة</Text>
              <Ionicons name="cloud-upload-outline" size={26} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={async () => {
                const u = await pickFromLibrary();
                if (u) setCarBackUri(u);
              }}
            >
              <Text style={styles.uploadBtnText}>تحميل المنظر الخلفي للمركبة بلوحات واضحة</Text>
              <Ionicons name="cloud-upload-outline" size={26} color={Colors.primary} />
            </TouchableOpacity>

            <InputField label="رقم الجوال" placeholder="5xxxxxxxx" prefix="+966" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <InputField label="كلمة المرور" placeholder="........" isPassword value={password} onChangeText={setPassword} />

            <Text style={styles.termsTitle}>الأحكام والشروط</Text>
            <ScrollView style={styles.termsBox} nestedScrollEnabled showsVerticalScrollIndicator>
              {TERMS_BULLETS.map((line, idx) => (
                <Text key={idx} style={styles.termsParagraph}>
                  {'\u2022'} {line}
                </Text>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setTermsAccepted((v) => !v)}
              activeOpacity={0.8}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: termsAccepted }}
            >
              <Ionicons
                name={termsAccepted ? 'checkbox' : 'square-outline'}
                size={26}
                color={termsAccepted ? Colors.primary : Colors.muted}
              />
              <Text style={styles.checkboxLabel}>أوافق على الشروط والأحكام وسياسة الخصوصية</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={handleDeliverySignUp} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>اشترك الآن</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DeliverySignUp;
