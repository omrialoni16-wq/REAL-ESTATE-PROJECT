import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./PropertyMap.css";

// Leaflet's default marker icons break under bundlers (the image paths don't
// resolve), so we point them at the package's bundled PNGs explicitly.
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Reusable single-property map (OpenStreetMap via Leaflet — no API key needed).
// Pass EITHER explicit coordinates (`lat`/`lng`) OR an `address` string. When
// only an address is given, the backend geocoder resolves it to coordinates
// and a single marker is dropped on that exact location.
const PropertyMap = ({ lat, lng, address, label = "Property location" }) => {
  const hasCoords = typeof lat === "number" && typeof lng === "number";
  const [center, setCenter] = useState(hasCoords ? [lat, lng] : null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasCoords) {
      setCenter([lat, lng]);
      return;
    }
    if (!address) return;

    let cancelled = false;
    setCenter(null);
    setError("");

    const geocode = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/external/geocode", {
          params: { q: address },
        });
        if (!cancelled) setCenter([res.data.latitude, res.data.longitude]);
      } catch (err) {
        console.error("Failed to geocode address", err);
        if (!cancelled) setError(`Could not locate "${address}" on the map.`);
      }
    };
    geocode();

    return () => {
      cancelled = true;
    };
  }, [hasCoords, lat, lng, address]);

  if (error) {
    return <div className="map-fallback">{error}</div>;
  }

  if (!center) {
    return <div className="map-fallback">Locating address… ⏳</div>;
  }

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={false}
      className="property-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default PropertyMap;
