import {
  getWeatherByCity,
  geocodeLocation,
} from "../service/ExternalApiService.js";

export const getGeocode = async (req, res) => {
  try {
    const { q } = req.query;
    const place = await geocodeLocation(q);
    if (!place) {
      return res.status(404).json({ message: `Could not locate "${q}".` });
    }
    return res.status(200).json(place);
  } catch (error) {
    console.error("Error geocoding location:", error);
    return res.status(502).json({
      message: "Failed to geocode location.",
      error: error.message,
    });
  }
};

export const getWeather = async (req, res) => {
  try {
    const { city } = req.query;
    const weather = await getWeatherByCity(city);
    return res.status(200).json(weather);
  } catch (error) {
    console.error("Error fetching weather:", error);
    const status = error.statusCode || 502;
    return res.status(status).json({
      message: "Failed to fetch weather data.",
      error: error.message,
    });
  }
};
