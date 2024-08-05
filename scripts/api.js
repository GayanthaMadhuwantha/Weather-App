import axios from 'axios';

const API_KEY = 'Your API Key';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export const fetchLocationId = async (city) => {
  // In Visual Crossing, you can directly use the city name
  return city;
};

/*export const fetchWeather = async (location) => {
  const url = `${BASE_URL}/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`;
  const response = await axios.get(url);
  const data = response.data;

  // Extracting current weather conditions
  const currentConditions = data.currentConditions;

  // Extracting forecast data (e.g., next 3 days)
  const forecast = data.days.slice(1, 6).map(day => ({
    date: day.datetime,
    temp: day.temp,
    conditions: day.conditions,
    windSpeed: day.windspeed,
    humidity: day.humidity,
    precipprob:day.precipprob,
  }));

  return {
    location: data.address,
    resolvedAddress:data.resolvedAddress,
    timezone:data.timezone,
    datetime:data.datetime,
    weather: currentConditions.conditions,
    temperature: currentConditions.temp,
    windSpeed: currentConditions.windspeed,
    humidity: currentConditions.humidity,
    feelslike:currentConditions.feelslike,
    forecast,
  };
};*/
export const fetchWeather = async (location) => {
  try {
    const url = `${BASE_URL}/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`;
    const response = await axios.get(url);
    const data = response.data;

    // Extracting current weather conditions
    const currentConditions = data.currentConditions || data.days[0];
    const hourlyForecast = data.days[5].hours;

  /*  const processedHourlyForecast = hourlyForecast.map(item => ({
      datetime: item.datetime,
      datetimeEpoch: item.datetimeEpoch,
      temp: item.temp || 0, // Ensure temp is set
      feelslike: item.feelslike || 0, // Ensure feelslike is set
      humidity: item.humidity || 0, // Ensure humidity is set
      dew: item.dew || 0, // Ensure dew is set
      precip: item.precip || 0, // Ensure precip is set
      precipProb: item.precipProb || 0, // Ensure precipProb is set
      snow: item.snow || 0, // Ensure snow is set
      snowdepth: item.snowdepth || 0, // Ensure snowdepth is set
      preciptype: item.preciptype || [], // Ensure preciptype is set
      windgust: item.windgust || 0, // Ensure windgust is set
      windspeed: item.windspeed || 0, // Ensure windspeed is set
      winddir: item.winddir || 0, // Ensure winddir is set
      pressure: item.pressure || 0, // Ensure pressure is set
      visibility: item.visibility || 0, // Ensure visibility is set
      cloudcover: item.cloudcover || 0, // Ensure cloudcover is set
      solarradiation: item.solarradiation || 0, // Ensure solarradiation is set
      solarenergy: item.solarenergy || 0, // Ensure solarenergy is set
      uvindex: item.uvindex || 0, // Ensure uvindex is set
      severerisk: item.severerisk || 0, // Ensure severerisk is set
      conditions: item.conditions || 'Unknown', // Ensure conditions is set
      icon: item.icon || 'unknown', // Ensure icon is set
      stations: item.stations || null, // Ensure stations is set
      source: item.source || 'unknown' // Ensure source is set
    }));*/


    return {
      location: data.address,
      resolvedAddress: data.resolvedAddress,
      timezone: data.timezone,
      datetime: data.datetime,
      weather: currentConditions.conditions,
      temperature: currentConditions.temp,
      windSpeed: currentConditions.windspeed,
      humidity: currentConditions.humidity,
      feelslike: currentConditions.feelslike,
      precipProb: currentConditions.precipprob,
      cloudcover:currentConditions.cloudcover,
      solarradiation:currentConditions.solarradiation,
      uvindex:currentConditions.uvindex,
      sunrise:currentConditions.sunrise,
      sunset:currentConditions.sunset,
      winddir:currentConditions.winddir,
      forecast: data.days.slice(1, 6).map(day => ({
        date: day.datetime,
        temp: day.temp,
        conditions: day.conditions,
        windSpeed: day.windspeed,
        humidity: day.humidity,
        precipprob: day.precipprob,
        cloudcover:day.cloudcover,
        solarradiation:day.solarradiation,
        uvindex:day.uvindex,
        sunrise:day.sunrise,
        sunset:day.sunset,
        winddir:day.winddir,
        icon: day.icon
      })),
     // hourlyForecast: processedHourlyForecast
     
      hourlyForecast,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
