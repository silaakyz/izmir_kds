import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { districtData } from "../../data/districtData";

const getColorFromOverall = (overall: number) => {
  // `overall` from data is on ~0-10 scale — convert thresholds accordingly
  if (overall >= 8.5) return "#2e7d32"; // yeşil
  if (overall >= 7.0) return "#fbc02d"; // sarı
  return "#d32f2f"; // kırmızı
};

export default function IzmirMap() {
  // center İzmir roughly; zoom lower to show tüm ilçeler
  return (
    <MapContainer
      {...({
        center: [38.4192, 27.1287],
        zoom: 10,
        minZoom: 9,
        maxZoom: 14,
        style: { height: "500px", width: "100%" },
        maxBounds: [[38.0, 26.0], [39.0, 28.0]],
      } as any)}
    >
      <TileLayer {...({ attribution: "© OpenStreetMap", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" } as any)} />

      {districtData.map((d) => {
        const color = getColorFromOverall(d.scores.overall);
        const radius = Math.max(8, Math.round(d.radius / 100));
        return (
          <CircleMarker
            key={d.id}
            {...({ center: d.coordinates, radius, pathOptions: { color, fillColor: color, fillOpacity: 0.6 } } as any)}
          >
            <Tooltip {...({ direction: "top", offset: [0, -10], opacity: 1 } as any)}>
              <div>
                <strong>{d.name}</strong>
                <br />
                Genel Skor: {d.scores.overall.toFixed(1)} / 10
              </div>
            </Tooltip>
            <Popup>
              <div style={{ maxWidth: 300 }}>
                <h3 style={{ margin: 0 }}>{d.name}</h3>
                <p style={{ margin: "6px 0" }}>
                  <strong>Kriter Analizi</strong>
                </p>
                <ul style={{ paddingLeft: 16, marginTop: 0 }}>
                  <li>Altyapı: {d.scores.infrastructure}</li>
                  <li>Çevre: {d.scores.environment}</li>
                  <li>Sosyal: {d.scores.social}</li>
                  <li>Ulaşım: {d.scores.transportation}</li>
                  <li>Güvenlik: {d.scores.security}</li>
                  <li>Eğitim: {d.scores.education}</li>
                  <li>Sağlık: {d.scores.health}</li>
                </ul>

                <p style={{ margin: "6px 0" }}>
                  <strong>Önerilen Aksiyonlar</strong>
                </p>
                <ol style={{ paddingLeft: 16, marginTop: 0 }}>
                  {d.recommendedActions.slice(0, 3).map((a, i) => (
                    <li key={i}>
                      {a.action} — Potansiyel +{a.potentialScore} puan ({a.priority})
                    </li>
                  ))}
                </ol>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
