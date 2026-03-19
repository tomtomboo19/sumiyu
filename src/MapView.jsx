import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Star, Clock, MapPin } from "lucide-react";

var TYPE_COLORS = {
  onsen: "#B8845C",
  sauna: "#5A8FAF",
  sento: "#6FA45A",
  spa: "#AF5A8F",
};

var TYPE_LABELS = {
  onsen: "温泉",
  sauna: "サウナ",
  sento: "銭湯",
  spa: "スパ",
};

function createIcon(type) {
  var color = TYPE_COLORS[type] || "#8B6914";
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">'
    + '<path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 26 16 26s16-14 16-26C32 7.16 24.84 0 16 0z" fill="' + color + '" stroke="#fff" stroke-width="2"/>'
    + '<circle cx="16" cy="15" r="7" fill="#fff" opacity="0.9"/>'
    + '<text x="16" y="19" text-anchor="middle" font-size="11" font-weight="700" fill="' + color + '">'
    + (TYPE_LABELS[type] ? TYPE_LABELS[type].charAt(0) : "湯")
    + '</text></svg>';
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -36],
  });
}

function FitBounds({ facilities }) {
  var map = useMap();
  useEffect(function() {
    if (facilities.length === 0) return;
    var bounds = facilities
      .filter(function(f) { return f.latitude && f.longitude; })
      .map(function(f) { return [f.latitude, f.longitude]; });
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [facilities, map]);
  return null;
}

export default function MapView({ facilities, onSelect, isMobile }) {
  var validFacilities = facilities.filter(function(f) { return f.latitude && f.longitude; });

  return (
    <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(180,160,120,0.15)", boxShadow: "0 1px 8px rgba(60,40,10,0.06)" }}>
      <MapContainer
        center={[36.5, 137.5]}
        zoom={5}
        style={{ height: isMobile ? "60vh" : "70vh", width: "100%", background: "#F5F0E6" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds facilities={validFacilities} />
        {validFacilities.map(function(f) {
          var tags = (f.facility_tags || []).map(function(ft) { return ft.tags ? ft.tags.name : null; }).filter(Boolean);
          return (
            <Marker key={f.id} position={[f.latitude, f.longitude]} icon={createIcon(f.type)}>
              <Popup maxWidth={280} minWidth={220}>
                <div style={{ fontFamily: "'Noto Sans JP', sans-serif", padding: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{
                      background: TYPE_COLORS[f.type] || "#8B6914",
                      color: "#fff", fontSize: 10, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 3, letterSpacing: 0.5,
                    }}>{TYPE_LABELS[f.type] || "施設"}</span>
                    <span style={{ fontSize: 10, color: "#9B917E" }}>{f.prefecture} {f.city}</span>
                  </div>
                  <h3 style={{
                    fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700,
                    color: "#2C2416", margin: "0 0 4px", lineHeight: 1.3, letterSpacing: 0.3,
                  }}>{f.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 6 }}>
                    {[1,2,3,4,5].map(function(s) {
                      return (
                        <svg key={s} width="12" height="12" viewBox="0 0 20 20">
                          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26 5.06 16.7 6 11.21l-4-3.9 5.53-.8z"
                            fill={s <= Math.round(f.rating_avg) ? "#C4A55A" : "#D4CFC4"}
                            stroke={s <= Math.round(f.rating_avg) ? "#C4A55A" : "#D4CFC4"}
                            strokeWidth="0.5" />
                        </svg>
                      );
                    })}
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#C4A55A", marginLeft: 2 }}>{Number(f.rating_avg).toFixed(1)}</span>
                    <span style={{ fontSize: 10, color: "#9B917E", marginLeft: 2 }}>({f.review_count}件)</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#6B6152", margin: "0 0 8px", lineHeight: 1.6 }}>{f.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 8 }}>
                    {tags.slice(0, 4).map(function(tag) {
                      return <span key={tag} style={{ background: "#F5F0E8", color: "#7A7062", fontSize: 9, padding: "1px 6px", borderRadius: 3 }}>{tag}</span>;
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #EDE8DF", paddingTop: 8 }}>
                    <span style={{ fontSize: 11, color: "#9B917E" }}>{f.hours}</span>
                    <span style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, color: "#2C2416" }}>¥{Number(f.price).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={function() { onSelect(f); }}
                    style={{
                      width: "100%", marginTop: 8, padding: "8px 0",
                      background: "linear-gradient(135deg, #2C5F4A, #3D7B62)",
                      color: "#fff", border: "none", borderRadius: 6,
                      fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1,
                    }}
                  >詳細を見る</button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
