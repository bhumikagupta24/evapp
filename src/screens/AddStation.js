import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../context/ThemeContext';

export default function AddStationScreen({route, navigation}) {
  const isFromOnboarding = route?.params?.fromOnboarding;
  const editStationData = route?.params?.station;
  const isEditMode = !!editStationData;
  const {theme} = useTheme();
  const [name, setName] = useState(editStationData?.name || '');
  const [address, setAddress] = useState(editStationData?.address || '');
  const [price, setPrice] = useState(
    editStationData?.price ? editStationData.price.toString() : '',
  );
  const [chargerSpeed, setChargerSpeed] = useState(
    editStationData?.chargerSpeed
      ? editStationData.chargerSpeed.toString()
      : '50',
  );
  const [vehicleType, setVehicleType] = useState(
    editStationData?.vehicleType || '',
  );
  const [totalPoints, setTotalPoints] = useState(
    editStationData?.totalPoints ? editStationData.totalPoints.toString() : '1',
  );
  const [pinnedLocation, setPinnedLocation] = useState({
    latitude: editStationData?.latitude || 28.6139,
    longitude: editStationData?.longitude || 77.209,
  });
  const mapRef = useRef(null);
  const googlePlacesRef = useRef(null);

  const fetchCoordinatesFromAddressFallback = async textToSearch => {
    const query = textToSearch || address;
    if (!query || !query.trim()) {
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query,
        )}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'GreenStepsApp/1.0 (contact@greensteps.com)',
            Accept: 'application/json',
          },
        },
      );
      if (!response.ok) {
        throw new Error('Geocoding blocked or rate limited');
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPinnedLocation({
          latitude: lat,
          longitude: lon,
        });
        mapRef.current?.animateToRegion(
          {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          1000,
        );
      }
    } catch (error) {
      console.log('Geocoding error', error);
    }
  };

  const handleCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setPinnedLocation({latitude: lat, longitude: lon});
        mapRef.current?.animateToRegion(
          {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          1000,
        );

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            {
              headers: {
                'User-Agent': 'GreenStepsApp/1.0 (contact@greensteps.com)',
                Accept: 'application/json',
              },
            },
          );
          if (!response.ok) {
            throw new Error('Geocoding blocked or rate limited');
          }
          const data = await response.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
            googlePlacesRef.current?.setAddressText(data.display_name);
          }
        } catch (error) {
          console.log('Reverse geocoding error', error);
        }
      },
      error => {
        Alert.alert(
          'Location Error',
          'Unable to fetch current location. Please check your permissions.',
        );
        console.log('Location error', error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  React.useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setPinnedLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => console.log('Location error', error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  const handleAddStation = async () => {
    if (!name || !address || !price || !vehicleType) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    try {
      const user = auth().currentUser;

      if (isEditMode) {
        await firestore()
          .collection('stations')
          .doc(editStationData.id)
          .update({
            name,
            address,
            price: parseFloat(price),
            chargerSpeed: parseInt(chargerSpeed) || 50,
            vehicleType,
            available:
              editStationData?.available !== undefined
                ? editStationData.available
                : true,
            latitude: pinnedLocation.latitude,
            longitude: pinnedLocation.longitude,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
        Alert.alert('✅ Success', 'Station updated successfully', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        const stationData = {
          name,
          address,
          price: parseFloat(price),
          chargerSpeed: parseInt(chargerSpeed) || 50,
          vehicleType,
          totalPoints: parseInt(totalPoints) || 1,
          availablePoints: isEditMode
            ? editStationData.availablePoints
            : parseInt(totalPoints) || 1, // Preserve active bookings if editing
          available:
            (isEditMode
              ? editStationData.availablePoints
              : parseInt(totalPoints) || 1) > 0,
          latitude: pinnedLocation.latitude,
          longitude: pinnedLocation.longitude,
          createdAt: firestore.FieldValue.serverTimestamp(),
          addedBy: user?.uid || null,
          ownerId: user?.uid || null,
        };

        await firestore().collection('stations').add(stationData);

        Alert.alert('✅ Success', 'Station added successfully', [
          {
            text: 'OK',
            onPress: () =>
              isFromOnboarding
                ? navigation.replace('TabBar')
                : navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.warn('Firestore write warning:', error.message);
      Alert.alert(
        'Error',
        `Failed to ${isEditMode ? 'update' : 'add'} station`,
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          {!isFromOnboarding && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backBtn, {borderColor: theme.border}]}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
          )}
          <Text style={[styles.headerTitle, {color: theme.text}]}>
            {isEditMode ? 'Edit Station' : 'Add New Station'}
          </Text>
          <View style={{width: 44}} />
        </View>

        <View
          style={[
            styles.formContainer,
            {backgroundColor: theme.card, borderColor: theme.border},
          ]}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>
            {isEditMode ? 'Station Details' : 'Basic Information'}
          </Text>

          <Text style={[styles.label, {color: theme.subtext, marginTop: 10}]}>
            STATION NAME
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
            placeholder="e.g. Green Hub - Sector 62"
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.subtext}
          />

          <Text style={[styles.label, {color: theme.subtext}]}>
            FULL ADDRESS
          </Text>
          <GooglePlacesAutocomplete
            ref={googlePlacesRef}
            placeholder="Enter complete location details"
            fetchDetails={true}
            onPress={(data, details = null) => {
              setAddress(data.description);
              if (details?.geometry?.location) {
                const {lat, lng} = details.geometry.location;
                setPinnedLocation({latitude: lat, longitude: lng});
                mapRef.current?.animateToRegion(
                  {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  },
                  1000,
                );
              }
            }}
            query={{
              key: 'AIzaSyBHvb7pkgEmQ89VOxfmZrDZnEKHBwS5ooI',
              language: 'en',
            }}
            styles={{
              container: {flex: 0, marginBottom: 20},
              textInputContainer: {width: '100%'},
              textInput: {
                height: 56,
                color: theme.text,
                backgroundColor: theme.background,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 16,
                paddingHorizontal: 16,
                fontSize: 15,
                fontWeight: '600',
              },
              listView: {
                backgroundColor: theme.card,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 8,
                marginTop: 4,
              },
              row: {
                backgroundColor: theme.card,
                padding: 13,
                minHeight: 44,
                flexDirection: 'row',
              },
              description: {
                color: theme.text,
              },
            }}
            textInputProps={{
              placeholderTextColor: theme.subtext,
              onChangeText: text => setAddress(text),
              value: address,
              onSubmitEditing: e =>
                fetchCoordinatesFromAddressFallback(e.nativeEvent.text),
              onBlur: () => fetchCoordinatesFromAddressFallback(address),
              returnKeyType: 'search',
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: 10,
              marginBottom: 10,
            }}>
            <View style={{flex: 1, paddingRight: 10}}>
              <Text style={[styles.label, {color: theme.subtext}]}>
                PIN LOCATION ON MAP
              </Text>
              <Text style={{fontSize: 12, color: theme.subtext}}>
                Tap the map or drag the pin to set the exact coordinates.
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCurrentLocation}
              style={{
                backgroundColor: theme.primary,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Ionicons name="locate" size={16} color="#fff" />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: '700',
                  marginLeft: 6,
                }}>
                Locate Me
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: pinnedLocation.latitude,
                longitude: pinnedLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              onPress={e => {
                setPinnedLocation(e.nativeEvent.coordinate);
              }}>
              <Marker
                coordinate={pinnedLocation}
                draggable
                onDragEnd={e => setPinnedLocation(e.nativeEvent.coordinate)}>
                <View
                  style={[styles.markerBg, {backgroundColor: theme.primary}]}>
                  <Ionicons name="flash" size={16} color="#fff" />
                </View>
              </Marker>
            </MapView>
          </View>

          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 12}}>
              <Text style={[styles.label, {color: theme.subtext}]}>
                PRICE (₹/KWH)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="15"
                placeholderTextColor={theme.subtext}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={[styles.label, {color: theme.subtext}]}>
                SPEED (KW)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="50"
                placeholderTextColor={theme.subtext}
                value={chargerSpeed}
                onChangeText={setChargerSpeed}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.label, {color: theme.subtext}]}>
              VEHICLE TYPE
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. 4 Wheeler"
              value={vehicleType}
              onChangeText={setVehicleType}
              placeholderTextColor={theme.subtext}
            />
          </View>

          <View style={{marginTop: 16}}>
            <Text style={[styles.label, {color: theme.subtext}]}>
              TOTAL CHARGING POINTS
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. 4"
              value={totalPoints}
              onChangeText={setTotalPoints}
              keyboardType="numeric"
              placeholderTextColor={theme.subtext}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, {backgroundColor: theme.primary}]}
          onPress={handleAddStation}>
          <Text style={styles.submitBtnText}>
            {isEditMode ? 'Update Station' : 'Create Station'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {padding: 24, paddingBottom: 40},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnHidden: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 15,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  toggleSub: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  submitBtn: {
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
