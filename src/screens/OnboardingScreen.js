import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  StatusBar,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';

const {width, height} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../assets/car.png'),
    title: 'Welcome to \nEVService',
    description:
      'The best place to maintain and service your electric vehicle with ease.',
  },
  {
    id: '2',
    image: require('../assets/car1.png'),
    title: 'Reliable & \nFast Service',
    description:
      'Get quick and reliable services with just a few taps on your screen.',
  },
  {
    id: '3',
    image: require('../assets/car2.png'),
    title: 'Charge Your EV\nOn The Go!',
    description:
      'Experience the convenience of charging your electric vehicle anywhere, anytime with our user-friendly app.',
  },
];

const OnboardingScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      if (currentIndex > 0) {
        slideRef.current.scrollToIndex({index: currentIndex - 1});
        setCurrentIndex(currentIndex - 1);
        return true;
      }
      if (!navigation.canGoBack()) {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [currentIndex, navigation]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      slideRef.current.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  if (!theme) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />

      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.6}>
        <Text style={[styles.skipText, {color: theme.subtext}]}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              <View style={[styles.circleBg, {backgroundColor: theme.card}]}>
                <Image source={item.image} style={styles.image} />
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.title, {color: theme.text}]}>
                {item.title}
              </Text>
              <Text style={[styles.description, {color: theme.subtext}]}>
                {item.description}
              </Text>
            </View>
          </View>
        )}
        onScroll={e => {
          const contentOffsetX = e.nativeEvent.contentOffset.x;
          const newIndex = Math.round(contentOffsetX / width);
          setCurrentIndex(newIndex);
        }}
        ref={slideRef}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {backgroundColor: theme.border},
                currentIndex === index && [
                  styles.activeDot,
                  {backgroundColor: theme.primary},
                ],
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.button, {backgroundColor: theme.primary}]}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '700',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  imageContainer: {
    width: width * 0.9,
    height: height * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  circleBg: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  description: {
    fontSize: 17,
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 26,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 32,
  },
  button: {
    height: 62,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;
