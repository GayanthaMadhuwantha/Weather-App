import React, { useState, useEffect, useCallback } from 'react';
import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, View, ActivityIndicator, StatusBar, ScrollView, FlatList, Alert, Platform, RefreshControl, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import moment from 'moment-timezone';

import SearchInput from '@/components/searchinput';
import CustomButton from '@/components/custombutton';
import Viewmore from '@/components/viewmore';
import { getImage, getIcon }from '@/scripts/getImageForWeather';
import { fetchLocationId, fetchWeather } from '@/scripts/api';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [timezone, setTimezone] = useState('');
  const [location, setLocation] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [weather, setWeather] = useState('');
  const [windSpeed, setWindSpeed] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [precipProb, setPrecipProb] = useState(0);
  const [feelslike, setFeelslike] = useState(0);
  const [winddir, setWinddir] = useState(0);
  const [sunset, setSunset] = useState(0);
  const [sunrise, setSunrise] = useState(0);
  const [solarradiation, setSolarradiation] = useState(0);
  const [uvindex, setUvindex] = useState(0);
  const [cloudcover, setCloudcover] = useState(0);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showMores, setShowMores] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFirstUse, setIsFirstUse] = useState(false);
  const [expandedDays, setExpandedDays] = useState({});


  useEffect(() => {
    checkFirstUse();
  }, []);

  useEffect(() => {
    let intervalId;
    if (timezone) {
      intervalId = setInterval(() => {
        updateTime(timezone);
      }, 1000);
    }
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, [timezone]);

  const checkFirstUse = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem('@home_location');
      if (!savedLocation) {
        setIsFirstUse(true);
      } else {
        handleSearch(savedLocation);
      }
    } catch (error) {
      console.log('Failed to check home location:', error);
    }
  };

  const saveHomeLocation = async (location) => {
    try {
      await AsyncStorage.setItem('@home_location', location);
    } catch (error) {
      console.log('Failed to save home location:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWeather().then(() => {
      setRefreshing(false);
    });
  }, []);

  const updateTime = (timezone) => {
    const localTime = moment().tz(timezone).format('hh:mm:ss A'); // 12-hour format with AM/PM
    setCurrentTime(localTime);
  };

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        handleSearch(`${address.city}`);
      } else {
        //setLocation(`${latitude}, ${longitude}`)? "Unknown Location" : "";
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const toggleShowMore = () => {
    setShowMore((prevState) => !prevState);
  };

  const toggleShowMores = (index: string | number) => {
    setExpandedDays(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };



  const windDirections = [
    'North', 'North-Northeast', 'Northeast', 'East-Northeast', 'East', 'East-Southeast', 'Southeast', 'South-Southeast',
    'South', 'South-Southwest', 'Southwest', 'West-Southwest', 'West', 'West-Northwest', 'Northwest', 'North-Northwest'
  ];
  
  const getWindDirection = (degree) => {
    const index = Math.round(degree / 22.5) % 16;
    return windDirections[index];
  };
  

  useEffect(() => {
    if (isFirstUse) {
      requestLocationPermission();
    }
  }, [isFirstUse]);

  const handleSearch = async (newLocation) => {
    if (!newLocation) return;
    setLoading(true);

    try {
      const locationId = await fetchLocationId(newLocation);
      const {
        location,
        resolvedAddress,
        timezone,
        weather,
        temperature,
        windSpeed,
        humidity,
        precipProb,
        feelslike,
        forecast,
        hourlyForecast,
        winddir,
        sunrise,
        sunset,
        uvindex,
        solarradiation,
        cloudcover,
      } = await fetchWeather(locationId);
      setLocation(location);
      const locationParts = resolvedAddress.split(' ').slice(1).join(' ').trim();
      setResolvedAddress(locationParts);
      setTimezone(timezone);
      setWeather(weather);
      setTemperature(temperature);
      setFeelslike(feelslike);
      setWindSpeed(windSpeed);
      setHumidity(humidity);
      setPrecipProb(precipProb);
      setForecast(forecast);
      setWinddir(winddir);
      setSunrise(sunrise);
      setSunset(sunset);
      setUvindex(uvindex);
      setSolarradiation(solarradiation);
      setCloudcover(cloudcover);
      setForecast(forecast);
      setHourlyForecast(hourlyForecast);
      setLoading(false);
      setError(false);
      if (isFirstUse) {
        saveHomeLocation(location);
        setIsFirstUse(false);
      }
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  const renderForecastItem = (item, index) => {
    const isExpanded = expandedDays[index];
    return (
      <TouchableOpacity
        key={index}
        style={[styles.forecastItem, isExpanded && styles.expandedItem]}
        onPress={() => toggleShowMores(index)}
      >
        <Text style={styles.forecastDate}>{item.date}</Text>
        <Text style={styles.forecastTemp}>{`${Math.round(item.temp)}°C`}</Text>
        <Image source={getIcon(item.conditions)} style={{width:35,height:35}}/>
        <Text style={styles.forecastConditions}>{item.conditions}</Text>
        <Text style={[styles.forecastDetails,styles.forecastwind]}>{"Wind Speed "+item.windSpeed} Km/h</Text>
        <Text style={styles.forecastDetails}>Humidity {item.humidity}%</Text>
        <Text style={styles.forecastDetails}>Precipitation {item.precipProb || 0}%</Text>
        {isExpanded && (
          <View>
            <Text style={styles.forecastDetails}>Cloud Cover  {item.cloudcover}%</Text>
            <Text style={styles.forecastDetails}>Solar Radiation {item.solarradiation} W/m²</Text>
            <Text style={styles.forecastDetails}>UV Index  {item.uvindex}</Text>
            <Text style={styles.forecastDetails}>
              Sunrise  {moment(item.sunrise, 'HH:mm').format('hh:mm A')}
            </Text>
            <Text style={styles.forecastDetails}>
              Sunset  {moment(item.sunset, 'HH:mm').format('hh:mm A')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };


  const renderHourlyItem = ({ item }) => {
    const formattedTime = moment(item.datetime, 'HH:mm:ss').format('hh:mm A');

    return (
      <View style={styles.hourlyItem}>
        <Text style={styles.hourlyTime}>{formattedTime}</Text>
        <Text style={styles.hourlyTemp}>{`${Math.round(item.temp)}°C`}</Text>
        <View style={styles.weatherContainer}>
        <Image source={getIcon(item.conditions)} style={{width:30,height:30}}/>
        </View>
        <Text style={styles.hourlyCondition}>{item.conditions}</Text>
        <Text style={styles.hourlyhumidity}>Humidity {item.humidity}</Text>
        <Text style={styles.hourlyPrecip}>Precipation {item.precipProb || 0}%</Text>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground
          source={getImage(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />
            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Could not load weather, please try a different city.
                  </Text>
                )}
                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
                    <Text style={[styles.mediumText, styles.textStyle]}>{resolvedAddress}</Text>
                    <Text style={[styles.smallmodText, styles.textStyle]}>{currentTime}</Text>
                    <View style={styles.weatherContainer}>
                    <Image source={getIcon(weather)} style={styles.mainweather}/>
                      <Text style={[styles.moderatetext, styles.textStyle]}>{" "+" "}{weather}</Text>
                    </View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {`${Math.round(temperature)}°C`}
                    </Text>
                    <Text style={[styles.mediumText, styles.textStyle]}>
                      Feels like {`${Math.round(feelslike)}°C`}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                      Wind Speed {windSpeed} Km/h
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>Humidity {humidity}%</Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                      Precipitation Probability {precipProb}%
                    </Text>
                    <Viewmore title={showMore ? 'View Less' : 'View More'} onPress={toggleShowMore} />
                    {showMore && (
                      <View style={styles.additionalDetails}>
                        <Text style={[styles.smallText, styles.textStyle]}>
                          Cloud Cover {cloudcover}%
                        </Text>
                        <Text style={[styles.smallText, styles.textStyle]}>
                          Solar Radiation {solarradiation} W/m²
                        </Text>
                        <Text style={[styles.smallText, styles.textStyle]}>UV Index {uvindex}</Text>
                        <Text style={[styles.smallText, styles.textStyle]}>
                        Wind Direction {getWindDirection(winddir)}
                        </Text>
                        <Text style={[styles.smallText, styles.textStyle]}>
                          Sunrise {moment(sunrise, 'HH:mm').format('hh:mm A')}
                        </Text>
                        <Text style={[styles.smallText, styles.textStyle]}>
                          Sunset {moment(sunset, 'HH:mm').format('hh:mm A')}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                <SearchInput placeholder="Search any city" onSubmit={handleSearch} />
                {!isFirstUse && (
                  <CustomButton title="Set as Home Location" onPress={() => saveHomeLocation(location)} />
                )}
              </View>
            )}
          </View>

          {!loading && !error && forecast.length > 0 && (
            <>
              <Text style={styles.mediumText}>Forecast for Next 5 Days</Text>
              <ScrollView
                horizontal
                style={styles.forecastContainer}
                showsHorizontalScrollIndicator={false}
              >
                {forecast.map((item, index) => (
                  <View key={index} style={styles.forecastItem}>
                    {renderForecastItem(item, index)}
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {!loading && !error && hourlyForecast.length > 0 && (
            <>
              <Text style={styles.mediumText}>Hourly Forecast</Text>
              <FlatList
                data={hourlyForecast}
                renderItem={renderHourlyItem}
                keyExtractor={(item) => item.datetime}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hourlyForecastContainer}
              />
            </>
          )}
        </ImageBackground>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    
  },
  weathericon:{
    width: 50,
    height: 50,
  },
  weatherContainer: {
    flexDirection: 'row', // Aligns items horizontally
    alignItems: 'center', // Centers items vertically
    justifyContent: 'center', // Centers items horizontally
  },
 
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'AvenirNext-Regular',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
marginTop:5,
    fontSize: 18,

  },
  mediumText:{
    marginTop:5,
    fontSize: 22,
    textAlign:"left",
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'AvenirNext-Regular',
    color: 'white',

  },
  moderatetext:{
    fontSize:25,
    marginTop:10,
  },
  smallmodText:{
    fontSize:20,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    opacity: 0.8,
  },
  detailsContainer: {
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:'10%',
  },
  forecastContainer: {
    paddingVertical: 20,
    color:'white',    
  },
  forecastwind:{
marginTop:5,
  },

  forecastItem: {
    marginHorizontal: 10,
    alignItems: 'center',
    borderRadius: 8,
    width:210,
    color:'white',
   // backgroundColor: 'rgba(0,0,0,0.1)',
    
  },
  mainweather:{
    width:40,
    height:40,

  },
  expandedItem: {
    backgroundColor: 'rgba(211, 211, 211, 0.2)', // Darker gray for expanded state
  },
  forecastDate: {
    marginTop:10,
    fontSize: 18,
    color:'white',
  },
  forecastTemp: {
    fontSize: 24,
    color: 'white',
  },
  forecastConditions: {
    fontSize: 18,
    color: 'white',
  },
  forecastDetails: {
    fontSize: 16,
    color: 'white',
    textAlign:'center',
    
  },
  hourlyForecastContainer: {
    paddingVertical: 20,
  },
  hourlyItem: {
    alignItems: 'center',
    marginHorizontal: 10,

  },
  hourlyTime: {
    fontSize: 16,
    color: '#fff',
  },
  hourlyTemp: {
    fontSize: 19,
    color: '#fff',
  },
  hourlyCondition: {
    fontSize: 17,
    color: '#fff',
  },
  hourlyPrecip: {
    fontSize: 14,
    color: '#fff',
  },
  hourlyhumidity: {
marginTop:5,
    fontSize: 14,
    color: '#fff',
  },
  additionalDetails: {
  
  },
  detailText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
});