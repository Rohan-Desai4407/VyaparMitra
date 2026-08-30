import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { renderToString } from 'react-dom/server';
import { Store, Droplet, Shirt, Wrench, Pill, Wheat, Home, ShoppingCart, Scissors, MapPin } from 'lucide-react';

// Fix leaflet.heat type
declare module 'leaflet' {
  function heatLayer(latlngs: [number, number, number][], options?: object): any;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface HeatPoint { lat: number; lng: number; intensity: number; }
interface Competitor { name: string; lat: number; lng: number; distance?: string; address?: string; rating?: number; reviews?: number; }

interface MapProps {
  village: string;
  district: string;
  state: string;
  radius: number;
  competitors?: Competitor[];
  category?: string;
  heatmapPoints?: HeatPoint[];
  centerCoords?: { lat: number; lng: number } | null;
}

// Leaflet Heat Layer as a React component
function HeatmapLayer({ points }: { points: HeatPoint[] }) {
  const map = useMap();
  const layerRef = useRef<any>(null);

  useEffect(() => {
    if (!points || points.length === 0) return;

    // Convert to [lat, lng, intensity] tuples
    const heatData: [number, number, number][] = points.map(p => [p.lat, p.lng, p.intensity]);

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    layerRef.current = L.heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 14,
      max: 1.0,
      gradient: {
        0.0: '#0000ff',   // blue – sparse
        0.3: '#00ff00',   // green – moderate
        0.6: '#ffff00',   // yellow – dense
        0.85: '#ff8800',  // orange – very dense
        1.0: '#ff0000',   // red – most dense (core)
      }
    }).addTo(map);

    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current);
    };
  }, [points, map]);

  return null;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('dairy')) return <Droplet className="text-white w-4 h-4" />;
  if (cat.includes('textile') || cat.includes('garment')) return <Shirt className="text-white w-4 h-4" />;
  if (cat.includes('repair') || cat.includes('hardware')) return <Wrench className="text-white w-4 h-4" />;
  if (cat.includes('medical') || cat.includes('pharmacy')) return <Pill className="text-white w-4 h-4" />;
  if (cat.includes('agro') || cat.includes('poultry') || cat.includes('livestock')) return <Wheat className="text-white w-4 h-4" />;
  if (cat.includes('furniture') || cat.includes('handicraft')) return <Home className="text-white w-4 h-4" />;
  if (cat.includes('retail') || cat.includes('bakery')) return <ShoppingCart className="text-white w-4 h-4" />;
  if (cat.includes('beauty')) return <Scissors className="text-white w-4 h-4" />;
  return <Store className="text-white w-4 h-4" />;
};

const createCustomIcon = (category: string) => {
  const iconHtml = renderToString(getCategoryIcon(category));
  return new L.DivIcon({
    html: `<div style="background-color:#ef4444;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${iconHtml}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const createCenterIcon = () => {
  const iconHtml = renderToString(<MapPin className="text-white w-5 h-5" />);
  return new L.DivIcon({
    html: `<div style="background-color:#3b82f6;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);">${iconHtml}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export default function MapVisualization({ village, district, state, radius, competitors = [], category = "store", heatmapPoints = [], centerCoords }: MapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (centerCoords) {
      setCoords([centerCoords.lat, centerCoords.lng]);
      setError(false);
    } else {
      // Fallback
      setCoords([22.8, 79.0]);
      setError(false);
    }
  }, [centerCoords]);

  if (error) return (
    <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700">
      <p className="text-gray-500">Map data temporarily unavailable for this location.</p>
    </div>
  );

  if (!coords) return (
    <div className="h-64 w-full bg-gray-50 dark:bg-gray-800 animate-pulse flex items-center justify-center rounded-xl">
      <p className="text-gray-400">Loading map...</p>
    </div>
  );

  const competitorIcon = createCustomIcon(category);
  const centerIcon = createCenterIcon();

  return (
    <div>
      {/* Legend */}
      <div className="mb-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 px-1">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'linear-gradient(to right, #0000ff, #00ff00, #ffff00, #ff8800, #ff0000)' }}></span>
          <span>Consumer Density Heatmap (Blue=Sparse → Red=Dense)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 rounded-full bg-red-500 border-2 border-white"></span>
          <span>Competitor Location</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></span>
          <span>Your Target Location</span>
        </div>
      </div>

      <div className="h-[480px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative z-0">
        <MapContainer center={coords} zoom={12} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={coords} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Real Leaflet Heatmap for Consumer Density */}
          {heatmapPoints.length > 0 && <HeatmapLayer points={heatmapPoints} />}

          {/* Center Target Location Marker */}
          <Marker position={coords} icon={centerIcon}>
            <Popup><b>{village}</b><br />Target Business Location</Popup>
          </Marker>

          {/* Competitor Markers */}
          {competitors && competitors.length > 0 && (
            <>
              {competitors.map((comp, idx) => (
                <Marker key={`comp-${idx}-${comp.name}`} position={[comp.lat, comp.lng]} icon={competitorIcon}>
                  <Popup className="competitor-popup">
                    <div className="font-semibold">{comp.name}</div>
                    <div className="text-xs text-gray-500 mb-1">{category} Business</div>
                    {comp.distance !== undefined && <div className="text-xs text-brand-600 font-medium mb-1">{comp.distance} km away</div>}
                    {comp.address && <div className="text-[10px] text-gray-400 leading-tight line-clamp-2 mb-1">{comp.address}</div>}
                    {comp.rating ? (
                      <div className="text-[10px] text-amber-500 font-medium mt-1">★ {comp.rating} <span className="text-gray-400 font-normal">({comp.reviews} reviews)</span></div>
                    ) : null}
                  </Popup>
                </Marker>
              ))}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
