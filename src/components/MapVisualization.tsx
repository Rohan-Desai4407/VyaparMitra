import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon issue in react
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface MapProps {
  village: string;
  district: string;
  state: string;
  radius: number;
}

export default function MapVisualization({ village, district, state, radius }: MapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Geocode via Nominatim (Free, no API key)
    const geocode = async () => {
      try {
        const query = encodeURIComponent(`${village}, ${district}, ${state}, India`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setError(false);
        } else {
          // fallback to district
          const dQuery = encodeURIComponent(`${district}, ${state}, India`);
          const dRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${dQuery}&limit=1`);
          const dData = await dRes.json();
          if (dData && dData.length > 0) {
            setCoords([parseFloat(dData[0].lat), parseFloat(dData[0].lon)]);
            setError(false);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Geocoding failed", err);
        setError(true);
      }
    };
    
    geocode();
  }, [village, district, state]);

  if (error) {
    return (
      <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500">Map data temporarily unavailable for this location.</p>
      </div>
    );
  }

  if (!coords) {
    return (
      <div className="h-64 w-full bg-gray-50 dark:bg-gray-800 animate-pulse flex items-center justify-center rounded-xl">
        <p className="text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative z-0">
      <MapContainer center={coords} zoom={11} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={coords} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={coords} radius={radius * 1000} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} />
        <Marker position={coords}>
          <Popup>
            <b>{village}</b><br/>{district}, {state}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
