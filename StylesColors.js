import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const Colors = {
  primary: '#2D5A37',
  primaryMuted: '#4A6741',
  sageBg: '#A5C0A8',
  sageLight: '#C5D9C8',
  cardBg: '#F2F4F0',
  white: '#FFFFFF',
  text: '#333333',
  muted: '#666666',
  border: '#DDDDDD',
};

export const InputField = ({
  label,
  placeholder,
  prefix,
  isPassword,
  showValidIcon,
  value,
  ...props
}) => {
  const [hidden, setHidden] = useState(!!isPassword);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        {prefix ? <Text style={styles.prefixText}>{prefix}</Text> : null}
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          secureTextEntry={isPassword ? hidden : false}
          textAlign="right"
          value={value}
          placeholderTextColor="#AAA"
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={22} color={Colors.primary} />
          </TouchableOpacity>
        ) : null}
        {showValidIcon && value && String(value).includes('@') ? (
          <Ionicons name="checkmark-circle" size={22} color={Colors.primary} style={{ marginLeft: 4 }} />
        ) : null}
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: {
    minHeight: 160,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  /** LTR so the control stays on the physical right under Android app RTL */
  headerRow: {
    direction: 'ltr',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
    width: '100%',
  },
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'right',
    lineHeight: 30,
  },
  formCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  sectionLabel: {
    textAlign: 'right',
    marginBottom: 14,
    color: Colors.muted,
    fontWeight: 'bold',
    fontSize: 15,
  },
  typeRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 22, gap: 8 },
  typeBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: Colors.sageLight,
    flex: 1,
    alignItems: 'center',
  },
  activeBadge: { backgroundColor: Colors.primary },
  typeText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
  activeTypeText: { color: Colors.white },
  inputContainer: { marginBottom: 18 },
  inputLabel: {
    textAlign: 'right',
    color: Colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
    paddingBottom: 6,
    minHeight: 40,
  },
  input: { flex: 1, fontSize: 16, color: Colors.text, paddingVertical: 4 },
  prefixText: { color: '#333', marginLeft: 10, fontSize: 15, fontWeight: '600' },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    paddingBottom: 28,
    flexWrap: 'wrap',
  },
  footerText: { color: '#888', fontSize: 15 },
  linkText: { color: Colors.primary, fontWeight: 'bold', fontSize: 15 },
});
