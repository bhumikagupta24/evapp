import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Map = ({navigation}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const battery = 80;
  const range = battery * 3;

  const handleFilter = useCallback((value) => {
    setSelectedCategory(value);
    const messages = {
      all: 'Showing all charging stations',
      fast: 'Showing fast charging stations',
      available: 'Showing only available stations',
    };
    Alert.alert('Filter Applied', messages[value]);
  }, []);

  const showNearby = () => {
    navigation.navigate('Nearby');
  };

  const FilterButton = ({title, value}) => {
    const isActive = selectedCategory === value;
    return (
      <TouchableOpacity
        style={[styles.navButton, isActive && styles.activeButton]}
        onPress={() => handleFilter(value)}
      >
        <Text style={[styles.navText, isActive && styles.activeText]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/maps.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.65)']}
        style={styles.overlay}
      >
        {/* Filter Buttons */}
        <View style={styles.buttonContainer}>
          <FilterButton title="All" value="all" />
          <FilterButton title="⚡ Fast" value="fast" />
          <FilterButton title="✅ Available" value="available" />
        </View>

        {/* Bottom Info Card */}
        <View style={styles.infoCardWrapper}>
          <LinearGradient
            colors={['rgba(13,42,51,0.92)', 'rgba(28,90,106,0.92)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.infoCard}
          >
            <Text style={styles.greeting}>👋 Hi there!</Text>

            {/* Battery Row */}
            <View style={styles.batteryCard}>
              <Image
                source={require('../assets/power.png')}
                style={styles.batteryIcon}
              />
              <View style={styles.batteryInfo}>
                <Text style={styles.percentText}>{battery}% Charged</Text>
                <Text style={styles.rangeText}>Estimated Range: {range} km</Text>
                {/* Battery bar */}
                <View style={styles.batteryBarBg}>
                  <View style={[styles.batteryBarFill, {width: `${battery}%`}]} />
                </View>
              </View>
            </View>

            {/* Nearby Button */}
            <TouchableOpacity style={styles.nearbyButton} onPress={showNearby}>
              <LinearGradient
                colors={['#5ED66B', '#1C5A6A']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.nearbyGradient}
              >
                <Text style={styles.nearbyText}>📍 Find Nearby Stations</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default Map;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingTop: 55,
    paddingHorizontal: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  activeButton: {
    backgroundColor: '#1B4D3E',
    borderColor: '#5ED66B',
  },
  navText: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    fontSize: 13,
  },
  activeText: {
    color: '#5ED66B',
    fontWeight: '700',
  },
  infoCardWrapper: {
    marginTop: 'auto',
    marginBottom: 15,
  },
  infoCard: {
    borderRadius: 24,
    padding: 22,
    elevation: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 18,
  },
  batteryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    borderRadius: 18,
    marginBottom: 18,
  },
  batteryIcon: {
    width: 50,
    height: 50,
    marginRight: 14,
    tintColor: '#5ED66B',
  },
  batteryInfo: {
    flex: 1,
  },
  percentText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  rangeText: {
    color: '#A8D8DC',
    fontSize: 13,
    marginTop: 2,
  },
  batteryBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  batteryBarFill: {
    height: 6,
    backgroundColor: '#5ED66B',
    borderRadius: 3,
  },
  nearbyButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  nearbyGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 30,
  },
  nearbyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
