import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Montserrat_500Medium, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Tajawal_500Medium, Tajawal_700Bold, Tajawal_800ExtraBold } from '@expo-google-fonts/tajawal';

const { width: W, height: winH } = Dimensions.get('window');
/** ~24px screen edge padding */
const EDGE_PAD = 24;
const H_PAD = EDGE_PAD;
const H_PAD_SLIDE2 = EDGE_PAD;
const BTN_MIN_H = 56;
const CARD_RADIUS = 32;
const CARD2_RADIUS = 32;

const COLORS = {
  sageSlide1: '#E6F2E8',
  sageSlide2: '#E6F2E8',
  /** Primary — headings, hero card, primary buttons, inactive dot */
  primary: '#3A7545',
  forest: '#3A7545',
  forestDark: '#2E5C38',
  forestText: '#3A7545',
  white: '#FFFFFF',
  cardGreen: '#3A7545',
  shelfGreen: '#2E5C38',
  badgeGreen: '#2A5233',
  /** Pagination: non-current page */
  dotMutedPill: 'rgba(58, 117, 69, 0.32)',
  secondaryBorder: '#C5E0C9',
  secondaryText: '#6B826F',
};

function PageDot({ active }) {
  return <View style={active ? styles.dotPageActive : styles.dotPageInactive} />;
}

const SLIDE1 = {
  mint: '#E8F4E5',
  darkGreen: '#2F5A27',
  shieldBg: '#3F7E46',
  dollarBg: '#FFF7CC',
  icon: 28,
  topGap: 16,
  emojiGap: 12,
  emojiTop: 24,
  emojiSize: 28,
};

/** Center brand mark: home + shield + dollar, produce emoji row */
function Slide1FeatureCard() {
  return (
    <View
      style={styles.slide1BrandCard}
      accessibilityRole="image"
      accessibilityLabel="حصاد: منزل، أمان، دعم، ومحاصيل طازجة"
    >
      <View style={styles.slide1InnerColumn}>
        <View style={styles.slide1TopRow}>
          <Feather name="home" size={SLIDE1.icon} color={SLIDE1.darkGreen} />
          <View style={styles.slide1ShieldWrap}>
            <MaterialCommunityIcons name="shield-outline" size={SLIDE1.icon} color="#FFFFFF" />
          </View>
          <View style={styles.slide1DollarWrap}>
            <Feather name="dollar-sign" size={SLIDE1.icon} color={SLIDE1.darkGreen} />
          </View>
        </View>
        <View style={styles.slide1EmojiRow}>
          <Text style={styles.slide1Emoji} allowFontScaling={false}>
            🌿
          </Text>
          <Text style={styles.slide1Emoji} allowFontScaling={false}>
            🥦
          </Text>
          <Text style={styles.slide1Emoji} allowFontScaling={false}>
            🍅
          </Text>
          <Text style={styles.slide1Emoji} allowFontScaling={false}>
            🥕
          </Text>
        </View>
      </View>
    </View>
  );
}

const Slide2GreenCard = () => (
  <View style={styles.slide2Card} accessibilityRole="image" accessibilityLabel="حصاد، فواكه طازجة">
    <View style={styles.slide2CardInner}>
      <View style={styles.slide2Badge}>
        <Text style={styles.slide2BadgeText}>Hassad حصاد</Text>
      </View>
      <View style={styles.slide2HeroSpacer} />
      <View style={styles.slide2Shelf}>
        <View style={styles.slide2FruitRow}>
          <Text style={styles.fruitEmojiShelf} allowFontScaling={false}>
            🍎
          </Text>
          <Text style={styles.fruitEmojiShelf} allowFontScaling={false}>
            🍇
          </Text>
          <Text style={styles.fruitEmojiShelf} allowFontScaling={false}>
            🥑
          </Text>
          <Text style={styles.fruitEmojiShelf} allowFontScaling={false}>
            🍊
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const OnboardingScreen = ({ navigation }) => {
  const scrollRef = useRef(null);
  const [page, setPage] = useState(0);
  const [pagerHeight, setPagerHeight] = useState(winH * 0.65);
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_700Bold,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Tajawal_800ExtraBold,
  });

  const onScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    setPage(Math.round(x / W));
  };

  const goNext = () => {
    if (page < 1) {
      scrollRef.current?.scrollTo({ x: W, animated: true });
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.rootLoading, styles.centered, { backgroundColor: COLORS.sageSlide1 }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeRootTransparent} edges={['top', 'bottom']}>
      <View
        style={[
          styles.rtlLayer,
          { backgroundColor: page === 0 ? COLORS.sageSlide1 : COLORS.sageSlide2 },
        ]}
        accessibilityLanguage="ar"
      >
        <View style={styles.topBarSkip}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="تخطي"
          >
            <Text style={styles.skipText}>تخطي</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pagerMeasured} onLayout={(e) => setPagerHeight(e.nativeEvent.layout.height)}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
            scrollEventThrottle={16}
            style={styles.pagerLtr}
            contentContainerStyle={styles.pagerContent}
            directionalLockEnabled
          >
            <View style={[styles.pageSlide1Wrap, { width: W, height: pagerHeight }]}>
              <View style={[styles.page, styles.pageSlide1Inner, { paddingHorizontal: H_PAD }]}>
                <Text style={styles.brandAr}>حصاد</Text>
                <Text style={styles.brandEn}>Hassad</Text>

                <View style={styles.cardWrap}>
                  <Slide1FeatureCard />
                </View>

                <Text style={styles.tagline}>من المزرعة إلى باب بيتك</Text>
                <Text style={styles.taglineSecond}>اختيارك الطازج يبدأ من هنا</Text>

                <View style={styles.pageFooter}>
                  <TouchableOpacity style={styles.primaryBtn} onPress={goNext} activeOpacity={0.9}>
                    <Text style={styles.primaryBtnText}>التالي</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[styles.pageSlide2Wrap, { width: W, height: pagerHeight }]}>
              <View style={[styles.page, styles.pageSlide2Inner, { paddingHorizontal: H_PAD_SLIDE2 }]}>
                <View style={styles.slide2TopSpacer} />

                <View style={styles.slide2CardOuter}>
                  <Slide2GreenCard />
                </View>

                <View style={styles.slide2AfterCard} />

                <Text style={styles.headlineSlide2}>ادعم المزارع المحلي</Text>
                <Text style={styles.subSlide2Line1}>تجربة شراء سهلة وادفع</Text>
                <Text style={styles.subSlide2Line2}>بالطريقة التي تناسبك</Text>

                <View style={styles.slide2SpacerFlex} />

                <View style={styles.pageFooterSlide2}>
                  <TouchableOpacity
                    style={[styles.primaryBtn, styles.primaryBtnSlide2, styles.primaryBtnShadow]}
                    onPress={() => navigation.navigate('UserSignUp')}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.primaryBtnText}>إبدأ الآن</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.88}
                    style={styles.secondaryBtnOutline}
                  >
                    <Text style={styles.secondaryBtnTextSlide2}>تسجيل الدخول</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <View
          style={[
            styles.dots,
            {
              paddingBottom: Math.max(insets.bottom, 8),
              backgroundColor: page === 0 ? COLORS.sageSlide1 : COLORS.sageSlide2,
            },
          ]}
        >
          <View style={styles.dotsLtr}>
            <PageDot active={page === 0} />
            <PageDot active={page === 1} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeRootTransparent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  rootLoading: {
    flex: 1,
  },
  rtlLayer: {
    flex: 1,
    direction: 'rtl',
  },
  pagerMeasured: {
    flex: 1,
    minHeight: 0,
  },
  pagerLtr: {
    flex: 1,
    direction: 'ltr',
    backgroundColor: 'transparent',
  },
  pagerContent: {
    alignItems: 'stretch',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarSkip: {
    direction: 'ltr',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    paddingTop: 8,
    paddingBottom: 6,
    zIndex: 4,
  },
  skipText: {
    fontFamily: 'Tajawal_700Bold',
    color: COLORS.primary,
    fontSize: 16,
  },
  pageSlide1Wrap: {
    backgroundColor: COLORS.sageSlide1,
    flexDirection: 'column',
  },
  pageSlide2Wrap: {
    backgroundColor: COLORS.sageSlide2,
    flexDirection: 'column',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Math.max(44, Math.round(winH * 0.055)),
  },
  pageSlide1Inner: {
    backgroundColor: COLORS.sageSlide1,
    paddingTop: 16,
  },
  pageSlide2Inner: {
    backgroundColor: COLORS.sageSlide2,
    paddingTop: 8,
    justifyContent: 'flex-start',
  },
  slide2TopSpacer: {
    height: Math.round(winH * 0.012),
  },
  brandAr: {
    fontFamily: 'Tajawal_800ExtraBold',
    fontSize: Math.min(56, Math.round(W * 0.128)),
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  brandEn: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: Math.min(22, Math.round(W * 0.056)),
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: Math.round(winH * 0.036),
  },
  cardWrap: {
    width: '100%',
    maxWidth: Math.min(W - H_PAD * 2, 340),
    marginBottom: Math.round(winH * 0.04),
  },
  slide1BrandCard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: SLIDE1.mint,
    borderRadius: 40,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide1InnerColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide1TopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SLIDE1.topGap,
  },
  slide1ShieldWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: SLIDE1.shieldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide1DollarWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: SLIDE1.dollarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide1EmojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SLIDE1.emojiGap,
    marginTop: SLIDE1.emojiTop,
  },
  slide1Emoji: {
    fontSize: SLIDE1.emojiSize,
    lineHeight: Math.round(SLIDE1.emojiSize * 1.15),
  },
  tagline: {
    fontFamily: 'Tajawal_800ExtraBold',
    fontSize: 20,
    color: COLORS.primary,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 30,
    marginBottom: 10,
  },
  taglineSecond: {
    fontFamily: 'Tajawal_500Medium',
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  slide2CardOuter: {
    width: '100%',
    maxWidth: Math.min(W - H_PAD_SLIDE2 * 2, 340),
    marginBottom: Math.round(winH * 0.02),
  },
  slide2Card: {
    backgroundColor: COLORS.cardGreen,
    borderRadius: CARD2_RADIUS,
    overflow: 'hidden',
    aspectRatio: 1,
    width: '100%',
    shadowColor: '#1a3d24',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  slide2CardInner: {
    flex: 1,
    paddingTop: 18,
  },
  slide2HeroSpacer: {
    flex: 1,
    minHeight: 8,
  },
  slide2Badge: {
    alignSelf: 'center',
    backgroundColor: COLORS.badgeGreen,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  slide2BadgeText: {
    fontFamily: 'Tajawal_700Bold',
    fontSize: 12,
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  slide2FruitRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  slide2Shelf: {
    backgroundColor: COLORS.shelfGreen,
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderBottomLeftRadius: CARD2_RADIUS,
    borderBottomRightRadius: CARD2_RADIUS,
  },
  fruitEmojiShelf: {
    fontSize: 36,
    lineHeight: 42,
  },
  slide2AfterCard: {
    height: Math.round(winH * 0.02),
  },
  slide2SpacerFlex: {
    flexGrow: 1,
    minHeight: 16,
  },
  pageFooterSlide2: {
    width: '100%',
    paddingBottom: 4,
  },
  pageFooter: {
    width: '100%',
    maxWidth: Math.min(W - H_PAD * 2, 340),
    marginTop: 'auto',
    paddingTop: 20,
    paddingBottom: 4,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BTN_MIN_H / 2,
    minHeight: BTN_MIN_H,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  primaryBtnSlide2: {
    marginBottom: 16,
  },
  primaryBtnShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnText: {
    fontFamily: 'Tajawal_700Bold',
    color: COLORS.white,
    fontSize: 17,
  },
  headlineSlide2: {
    fontFamily: 'Tajawal_800ExtraBold',
    fontSize: 24,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
    lineHeight: 32,
  },
  subSlide2Line1: {
    fontFamily: 'Tajawal_500Medium',
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  subSlide2Line2: {
    fontFamily: 'Tajawal_500Medium',
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  secondaryBtnOutline: {
    width: '100%',
    minHeight: BTN_MIN_H,
    paddingVertical: 14,
    borderRadius: BTN_MIN_H / 2,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.secondaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  secondaryBtnTextSlide2: {
    fontFamily: 'Tajawal_700Bold',
    color: COLORS.primary,
    fontSize: 17,
  },
  dots: {
    alignItems: 'center',
    paddingTop: 2,
  },
  dotsLtr: {
    direction: 'ltr',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  /** Current onboarding page */
  dotPageActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  /** Other page */
  dotPageInactive: {
    width: 28,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.dotMutedPill,
  },
});

export default OnboardingScreen;
