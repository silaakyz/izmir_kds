import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { District } from "@/lib/district";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

interface IzmirMapProps {
  districts: District[];
  onSelectDistrict: (district: District) => void;
}

const getColor = (score: number) => {
  if (score >= 8.5) return "#2e7d32";
  if (score >= 7) return "#fbc02d";
  return "#d32f2f";
};

// 🔒 İzmir sınırları
const IZMIR_BOUNDS: [[number, number], [number, number]] = [
  [37.9, 26.4], // Güney-Batı
  [39.3, 28.5], // Kuzey-Doğu
];

export default function IzmirMap({
  districts,
  onSelectDistrict,
}: IzmirMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    setTimeout(() => mapRef.current?.invalidateSize(), 200);
  }, []);

  return (
    <div className="glass-card p-4 h-[520px]">
      <MapContainer
        bounds={IZMIR_BOUNDS}
        maxBounds={IZMIR_BOUNDS}
        maxBoundsViscosity={1.0}
        zoom={10}
        minZoom={9}
        maxZoom={12}
        style={{ height: "100%", width: "100%" }}
        whenReady={(e) => (mapRef.current = e.target)}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {districts.map((d) => (
          <CircleMarker
            key={d.id}
            center={d.coordinates}
            radius={Math.max(8, d.radius / 120)}
            pathOptions={{
              color: getColor(d.scores.overall),
              fillColor: getColor(d.scores.overall),
              fillOpacity: 0.7,
            }}
            eventHandlers={{
              click: () => onSelectDistrict(d), // 🔥 EN KRİTİK SATIR
            }}
          >
            <Tooltip>
              <strong>{d.name}</strong>
              <br />
              Skor: {d.scores.overall.toFixed(1)}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
