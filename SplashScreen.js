import React, { useEffect } from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors } from './StylesColors';

const SplashScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const logoMax = Math.min(width * 0.72, 280);

  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1800);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.root}>
      <Image
        source={require('./logo.jpg')}
        style={{ width: logoMax, height: logoMax }}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="شعار حصاد"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.sageBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
});

export default SplashScreen;
