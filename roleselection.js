import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from './StylesColors';

const roles = [
  {
    key: 'user',
    label: 'مستخدم',
    icon: 'person',
    iconFamily: 'Ionicons',
    screen: 'UserSignUp',
  },
  {
    key: 'farmer',
    label: 'مزارع',
    icon: 'carrot',
    iconFamily: 'MaterialCommunityIcons',
    screen: 'FarmerSignUp',
  },
  {
    key: 'delivery',
    label: 'كابتن',
    icon: 'truck-outline',
    iconFamily: 'MaterialCommunityIcons',
    screen: 'DeliverySignUp',
  },
];

const RoleIcon = ({ iconFamily, icon }) => {
  if (iconFamily === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={icon} size={46} color={Colors.primary} />;
  }

  return <Ionicons name={icon} size={46} color={Colors.primary} />;
};

export default function Selection({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="رجوع"
        >
          <Ionicons name="arrow-back" size={34} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>سجل اشتراكك في{'\n'}حصاد</Text>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.question}>هل أنت؟</Text>

        <View style={styles.grid}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.key}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate(role.screen)}
            >
              <RoleIcon iconFamily={role.iconFamily} icon={role.icon} />
              <Text style={styles.cardLabel}>{role.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerHint}>لديك حساب؟</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    minHeight: 220,
    paddingHorizontal: 24,
    paddingTop: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  backButton: {
    alignSelf: 'flex-start',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'right',
    lineHeight: 40,
    marginBottom: 12,
  },
  sheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    paddingHorizontal: 22,
    paddingTop: 28,
  },
  question: {
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    minHeight: 166,
    backgroundColor: '#E6EFE4',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  cardLabel: {
    color: Colors.primary,
    fontSize: 21,
    fontWeight: '700',
    marginTop: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 48,
  },
  footerHint: {
    color: '#9A9A9A',
    fontSize: 18,
    marginBottom: 8,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '800',
  },
});