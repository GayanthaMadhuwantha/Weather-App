/* eslint-disable global-require */

const images = {
  Clear: require('@/assets/images/clear.png'),
  Overcast: require('@/assets/images/overcast_new.png'),
  'Rain, Overcast': require('@/assets/images/rain_overcast.png'),
  'Heavy Cloud': require('@/assets/images/heavy_cloud.png'),
  'Rain, Partially cloudy': require('@/assets/images/rain_partially_cloudy.png'),
  'Partially cloudy': require('@/assets/images/parial_cloude.png'),
  'Heavy Rain': require('@/assets/images/heavy_rain.png'),
  'Light Rain': require('@/assets/images/light_rains.png'),
};

const icons = {
  'Partially cloudy': require('@/assets/images/partially_cloud.png'),
  'Rain, Partially cloudy': require('@/assets/images/rain_partial_cloudy.png'),
  Clear: require('@/assets/images/clear_icon.png'),
  Overcast: require('@/assets/images/oercast_icon.png'),
  'Rain, Overcast': require('@/assets/images/rain_overcase_icon.png'),
};

const getImage = (weather) => images[weather];
const getIcon = (weather) => icons[weather];

export { getImage, getIcon };

