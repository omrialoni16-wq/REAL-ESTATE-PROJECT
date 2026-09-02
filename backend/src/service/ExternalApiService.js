import axios from "axios";

const GEOCODE_URL = "https://nominatim.openstreetmap.org/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_CODES = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤️" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Fog", icon: "🌫️" },
  48: { description: "Depositing rime fog", icon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌦️" },
  53: { description: "Moderate drizzle", icon: "🌦️" },
  55: { description: "Dense drizzle", icon: "🌧️" },
  61: { description: "Slight rain", icon: "🌦️" },
  63: { description: "Moderate rain", icon: "🌧️" },
  65: { description: "Heavy rain", icon: "🌧️" },
  71: { description: "Slight snow", icon: "🌨️" },
  73: { description: "Moderate snow", icon: "🌨️" },
  75: { description: "Heavy snow", icon: "❄️" },
  80: { description: "Rain showers", icon: "🌦️" },
  81: { description: "Rain showers", icon: "🌧️" },
  82: { description: "Violent rain showers", icon: "⛈️" },
  95: { description: "Thunderstorm", icon: "⛈️" },
  96: { description: "Thunderstorm with hail", icon: "⛈️" },
  99: { description: "Thunderstorm with hail", icon: "⛈️" },
};

const describeCode = (code) =>
  WEATHER_CODES[code] || { description: "Unknown", icon: "🌡️" };

export const geocodeLocation = async (query) => {
  if (!query || typeof query !== "string") {
    throw new Error("A location query is required.");
  }

  const { data } = await axios.get(GEOCODE_URL, {
    params: { q: query.trim(), format: "json", limit: 1, addressdetails: 1 },
    headers: { "User-Agent": "real-estate-project/1.0 (course demo)" },
  });

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const place = data[0];
  return {
    latitude: Number(place.lat),
    longitude: Number(place.lon),
    name: place.name || query,
    country: place.address?.country || "",
  };
};

export const getWeatherByCity = async (city) => {
  if (!city || typeof city !== "string") {
    throw new Error("A 'city' query parameter is required.");
  }

  const place = await geocodeLocation(city.trim());
  if (!place) {
    const err = new Error(`City "${city}" could not be located.`);
    err.statusCode = 404;
    throw err;
  }

  const { data } = await axios.get(FORECAST_URL, {
    params: {
      latitude: place.latitude,
      longitude: place.longitude,
      current_weather: true,
    },
  });

  const current = data.current_weather;
  if (!current) {
    throw new Error("Weather provider returned no current conditions.");
  }

  const { description, icon } = describeCode(current.weathercode);

  return {
    city: place.name,
    country: place.country,
    temperature: current.temperature,
    windSpeed: current.windspeed,
    weatherCode: current.weathercode,
    description,
    icon,
    observedAt: current.time,
  };
};
