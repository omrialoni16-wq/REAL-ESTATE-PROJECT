import { useEffect, useState } from "react";
import axios from "axios";
import "./WeatherWidget.css";
import { API_URL } from "../config";

const WeatherWidget = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!city) return;
    let cancelled = false;

    const fetchWeather = async () => {
      setStatus("loading");
      try {
        const res = await axios.get(
          `${API_URL}/api/external/weather`,
          { params: { city } },
        );
        if (!cancelled) {
          setWeather(res.data);
          setStatus("done");
        }
      } catch (error) {
        console.error("Failed to fetch weather", error);
        if (!cancelled) setStatus("error");
      }
    };

    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [city]);

  if (status === "loading") {
    return <div className="weather-widget weather-muted">Loading weather… ⏳</div>;
  }

  if (status === "error" || !weather) {
    return (
      <div className="weather-widget weather-muted">
        Weather unavailable for {city}.
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <span className="weather-icon">{weather.icon}</span>
      <div className="weather-details">
        <strong>{Math.round(weather.temperature)}°C</strong>
        <span className="weather-desc">{weather.description}</span>
        <span className="weather-meta">
          Wind {Math.round(weather.windSpeed)} km/h · {weather.city}
        </span>
      </div>
    </div>
  );
};

export default WeatherWidget;
