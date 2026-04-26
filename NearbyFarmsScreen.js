import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  FlatList, SafeAreaView, Dimensions 
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';

const INITIAL_FARMS = [
  { id: '1', name: 'مزرعة دار الخير', lat: 37.78825, lng: -122.4324, distance: 1.2 },
  { id: '2', name: 'مزرعة البساتين', lat: 37.75825, lng: -122.4624, distance: 2.2 },
  { id: '3', name: 'مزرعة الريف', lat: 37.72825, lng: -122.4024, distance: 3.9 },
];

export default function FarmLocatorScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [farms, setFarms] = useState(INITIAL_FARMS);
  const [userLocation, setUserLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  useEffect(() => {
    const filtered = INITIAL_FARMS.filter(farm => 
      farm.name.includes(searchQuery)
    ).sort((a, b) => a.distance - b.distance);
    setFarms(filtered);
  }, [searchQuery]);

  const renderFarmItem = ({ item, index }) => (
    <TouchableOpacity 
      style={[
        styles.farmCard, 
        index === 1 ? styles.activeCard : styles.inactiveCard
      ]}
      onPress={() => {
        // navigation.navigate('FarmDetails', { farmId: item.id });
      }}
    >
      <Text style={[styles.distanceText, index === 1 && {color: '#FFF'}]}>
        {item.distance} كلم
      </Text>
      <Text style={[styles.farmName, index === 1 && {color: '#FFF'}]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>اكتشف المزارع القريبة منك</Text>
        <TextInput 
          style={styles.searchInput}
          placeholder="ابحث عن اسم المزرعة..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
        />
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            ...userLocation,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Circle
            center={userLocation}
            radius={1000}
            fillColor="rgba(158, 158, 255, 0.3)"
            strokeColor="rgba(0, 0, 255, 0.1)"
          />
          <Marker coordinate={userLocation} title="موقعك الحالي" />

          {farms.map(farm => (
            <Marker
              key={farm.id}
              coordinate={{ latitude: farm.lat, longitude: farm.lng }}
              title={farm.name}
              pinColor="#2E7D32"
            />
          ))}
        </MapView>
      </View>

      <FlatList
        data={farms}
        renderItem={renderFarmItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>الذهاب إلى المزرعة</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  searchInput: {
    width: '90%',
    height: 45,
    backgroundColor: '#F9F9F9',
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  mapWrapper: {
    height: Dimensions.get('window').height * 0.35,
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  map: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  farmCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  activeCard: {
    backgroundColor: '#3E7B44',
  },
  inactiveCard: {
    backgroundColor: '#E8F5E9',
  },
  farmName: {
    fontSize: 16,
    fontWeight: '700',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
  },
  mainButton: {
    backgroundColor: '#4C8C53',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});