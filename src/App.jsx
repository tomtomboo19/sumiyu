import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";
import {
  Search, SlidersHorizontal, Star, Clock, MapPin, JapaneseYen,
  X, Check, Flame, ThermometerSun, Bath, Sparkles,
  XCircle, Waves, Menu,
} from "lucide-react";

const REGIONS = [
  { id: "all", name: "全国" },
  { id: "hokkaido", name: "北海道" },
  { id: "tohoku", name: "東北" },
  { id: "kanto", name: "関東" },
  { id: "chubu", name: "中部" },
  { id: "kinki", name: "近畿" },
  { id: "chugoku", name: "中国" },
  { id: "shikoku", name: "四国" },
  { id: "kyushu", name: "九州・沖縄" },
];

const FACILITY_TYPES = [
  { id: "all", name: "すべて" },
  { id: "onsen", name: "温泉" },
  { id: "sauna", name: "サウナ" },
  { id: "sento", name: "銭湯" },
  { id: "spa", name: "スパ" },
];

const TAG_LIST = ["露天風呂","サウナ","水風呂","岩盤浴","貸切風呂","食事処","駐車場","駅近","深夜営業","宿泊可","ロウリュ","アウフグース","外気浴","Wi-Fi","タオル付き"];

const TYPE_CONFIG = {
  onsen: { label: "温泉", color: "#8B6914", bg: "#E8DDD3", icon: ThermometerSun, gradient: ["#D4A574","#B8845C"] },
  sauna: { label: "サウナ", color: "#1A5276", bg: "#D3E0E8", icon: Flame, gradient: ["#7AAFCF","#5A8FAF"] },
  sento: { label: "銭湯", color: "#2E6B14", bg: "#DDE8D3", icon: Bath, gradient: ["#8FC47A","#6FA45A"] },
  spa:   { label: "スパ", color: "#76145A", bg: "#E8D3E0", icon: Sparkles, gradient: ["#CF7AAF","#AF5A8F"] },
};

function FacilityImage({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.onsen;
  const Icon = cfg.icon;
  return (
    <div style={{ background: "linear-gradient(135deg, "+cfg.gradient[0]+", "+cfg.gradient[1]+")", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.06) 20px, rgba(255,255,255,0.06) 40px)" }} />
      <Icon size={48} color="rgba(255,255,255,0.85)" strokeWidth={1.2} style={{ position: "relative", zIndex: 1 }} />
    </div>
  );
}

function Stars({ rating, size }) {
  size = size || 13;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      {[1, 2, 3, 4, 5].map(function(s) {
        return <Star key={s} size={size} fill={s <= Math.round(rating) ? "#C4A55A" : "none"} color={s <= Math.round(rating) ? "#C4A55A" : "#D4CFC4"} strokeWidth={1.5} />;
      })}
      <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: size - 1, fontWeight: 700, color: "#C4A55A", marginLeft: 4 }}>{Number(rating).toFixed(1)}</span>
    </span>
  );
}

function TypeBadge({ type }) {
  var cfg = TYPE_CONFIG[type];
  if (!cfg) return null;
  var Icon = cfg.icon;
  return (
    <span style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: 1, display: "inline-flex", alignItems: "center", gap: 4 }}>
      <Icon size={12} color={cfg.color} strokeWidth={1.8} />
      {cfg.label}
    </span>
  );
}

function FacilityCard({ facility, onClick, isMobile }) {
  var [hovered, setHovered] = useState(false);
  var tags = (facility.facility_tags || []).map(function(ft) { return ft.tags ? ft.tags.name : null; }).filter(Boolean);
  return (
    <div
      onClick={function() { onClick(facility); }}
      onMouseEnter={function() { setHovered(true); }}
      onMouseLeave={function() { setHovered(false); }}
      style={{
        background: "#FEFCF9", borderRadius: 14, overflow: "hidden", cursor: "pointer",
        transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
        transform: hovered && !isMobile ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered && !isMobile ? "0 16px 36px rgba(60,40,10,0.10)" : "0 1px 8px rgba(60,40,10,0.06)",
        border: "1px solid rgba(180,160,120,0.12)", position: "relative",
      }}
    >
      {facility.rating_avg >= 4.7 && (
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2, background: "linear-gradient(135deg, #8B4513, #C4A55A)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: 1, display: "flex", alignItems: "center", gap: 3 }}>
          <Flame size={10} /> 人気
        </div>
      )}
      <div style={{ height: isMobile ? 140 : 170, overflow: "hidden" }}>
        <FacilityImage type={facility.type} />
      </div>
      <div style={{ padding: isMobile ? "12px 14px 14px" : "14px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <TypeBadge type={facility.type} />
          <span style={{ fontSize: 10, color: "#9B917E", fontFamily: "'Noto Sans JP', sans-serif" }}>{facility.prefecture} {facility.city}</span>
        </div>
        <h3 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: isMobile ? 15 : 16, fontWeight: 700, color: "#2C2416", margin: "0 0 6px", lineHeight: 1.4, letterSpacing: 0.3 }}>
          {facility.name}
        </h3>
        <div style={{ marginBottom: 6 }}>
          <Stars rating={facility.rating_avg} />
          <span style={{ fontSize: 10, color: "#9B917E", marginLeft: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>({facility.review_count}件)</span>
        </div>
        <p style={{ fontSize: 12, color: "#6B6152", margin: "0 0 10px", lineHeight: 1.7, fontFamily: "'Noto Sans JP', sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {facility.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {tags.slice(0, isMobile ? 3 : 4).map(function(tag) {
            return <span key={tag} style={{ background: "#F5F0E8", color: "#7A7062", fontSize: 10, padding: "2px 7px", borderRadius: 3, fontFamily: "'Noto Sans JP', sans-serif" }}>{tag}</span>;
          })}
          {tags.length > (isMobile ? 3 : 4) && (
            <span style={{ color: "#9B917E", fontSize: 10, padding: "2px 3px", fontFamily: "'Noto Sans JP', sans-serif" }}>+{tags.length - (isMobile ? 3 : 4)}</span>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #EDE8DF", paddingTop: 10 }}>
          <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 11, color: "#9B917E", display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={12} color="#9B917E" strokeWidth={1.5} /> {facility.hours}
          </span>
          <span style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700, color: "#2C2416" }}>
            ¥{Number(facility.price).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function Modal({ facility, onClose, isMobile }) {
  if (!facility) return null;
  var tags = (facility.facility_tags || []).map(function(ft) { return ft.tags ? ft.tags.name : null; }).filter(Boolean);
  var infoRows = [
    { icon: MapPin, label: "住所", value: facility.prefecture + facility.city + " " + facility.address },
    { icon: Clock, label: "営業時間", value: facility.hours },
    { icon: JapaneseYen, label: "料金", value: "¥" + Number(facility.price).toLocaleString(), bold: true },
  ];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,15,5,0.55)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 20, animation: "fadeIn 0.25s ease" }}>
      <div onClick={function(e) { e.stopPropagation(); }} style={{
        background: "#FEFCF9", maxWidth: 560, width: "100%", maxHeight: isMobile ? "92vh" : "85vh", overflow: "auto",
        borderRadius: isMobile ? "18px 18px 0 0" : 18, boxShadow: "0 24px 60px rgba(20,15,5,0.25)",
      }}>
        <div style={{ height: isMobile ? 180 : 200, position: "relative" }}>
          <FacilityImage type={facility.type} />
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
            <X size={16} color="#2C2416" />
          </button>
          <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 6 }}>
            <TypeBadge type={facility.type} />
          </div>
        </div>
        <div style={{ padding: isMobile ? "20px 20px 28px" : "22px 26px 26px" }}>
          <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: isMobile ? 20 : 22, fontWeight: 700, color: "#2C2416", margin: "0 0 8px", letterSpacing: 0.5 }}>{facility.name}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <Stars rating={facility.rating_avg} />
            <span style={{ fontSize: 12, color: "#9B917E", fontFamily: "'Noto Sans JP', sans-serif" }}>({facility.review_count}件の口コミ)</span>
          </div>
          <p style={{ fontSize: 13, color: "#6B6152", lineHeight: 1.8, fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 18 }}>{facility.description}</p>
          <div style={{ background: "#F8F4ED", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            {infoRows.map(function(row) {
              var Icon = row.icon;
              return (
                <div key={row.label} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(180,160,120,0.1)", fontFamily: "'Noto Sans JP', sans-serif", fontSize: 13 }}>
                  <span style={{ color: "#9B917E", display: "flex", alignItems: "center", gap: 6, minWidth: 90, fontWeight: 600 }}>
                    <Icon size={14} strokeWidth={1.5} /> {row.label}
                  </span>
                  <span style={{ color: "#4A4235", fontWeight: row.bold ? 700 : 400 }}>{row.value}</span>
                </div>
              );
            })}
          </div>
          {tags.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "#9B917E", fontWeight: 600, marginBottom: 8, letterSpacing: 0.5 }}>設備・サービス</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {tags.map(function(tag) { return <span key={tag} style={{ background: "#F0EBE2", color: "#5A5344", fontSize: 11, padding: "4px 10px", borderRadius: 5, fontFamily: "'Noto Sans JP', sans-serif" }}>{tag}</span>; })}
              </div>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", background: "linear-gradient(135deg, #2C5F4A, #3D7B62)", borderRadius: 10, padding: "12px 16px", gap: 10 }}>
            <Check size={22} color="#fff" strokeWidth={2.5} />
            <div>
              <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>タトゥー・刺青 OK</p>
              <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.75)", margin: "2px 0 0" }}>タトゥーのある方もご入場いただけます</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  var [facilities, setFacilities] = useState([]);
  var [loading, setLoading] = useState(true);
  var [search, setSearch] = useState("");
  var [region, setRegion] = useState("all");
  var [facilityType, setFacilityType] = useState("all");
  var [selectedTags, setSelectedTags] = useState([]);
  var [sortBy, setSortBy] = useState("rating");
  var [modal, setModal] = useState(null);
  var [showFilters, setShowFilters] = useState(false);
  var [mobileMenu, setMobileMenu] = useState(false);
  var [isMobile, setIsMobile] = useState(false);
  var resultsRef = useRef(null);

  useEffect(function() {
    var check = function() { setIsMobile(window.innerWidth < 768); };
    check();
    window.addEventListener("resize", check);
    return function() { window.removeEventListener("resize", check); };
  }, []);

  useEffect(function() { fetchFacilities(); }, []);

  function fetchFacilities() {
    setLoading(true);
    supabase.from("facilities").select("*, facility_tags(tags(name))").eq("is_published", true)
      .then(function(res) {
        if (!res.error && res.data) setFacilities(res.data);
        setLoading(false);
      });
  }

  function toggleTag(tag) {
    setSelectedTags(function(prev) {
      return prev.includes(tag) ? prev.filter(function(t) { return t !== tag; }) : prev.concat([tag]);
    });
  }

  var filtered = facilities.filter(function(f) {
    if (region !== "all" && f.region !== region) return false;
    if (facilityType !== "all" && f.type !== facilityType) return false;
    if (search) {
      var s = search.toLowerCase();
      var match = [f.name, f.prefecture, f.city, f.description, f.address].some(function(v) { return v && v.toLowerCase().indexOf(s) !== -1; });
      if (!match) return false;
    }
    if (selectedTags.length > 0) {
      var fTags = (f.facility_tags || []).map(function(ft) { return ft.tags ? ft.tags.name : null; }).filter(Boolean);
      var allMatch = selectedTags.every(function(t) { return fTags.indexOf(t) !== -1; });
      if (!allMatch) return false;
    }
    return true;
  }).sort(function(a, b) {
    if (sortBy === "rating") return b.rating_avg - a.rating_avg;
    if (sortBy === "reviews") return b.review_count - a.review_count;
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    return 0;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E6", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <style>{"\
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;600;700;800&display=swap');\
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }\
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }\
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }\
        @keyframes pulse { 0%,100% { opacity:.4 } 50% { opacity:.8 } }\
        * { box-sizing: border-box; }\
        body { margin: 0; padding: 0; }\
        ::-webkit-scrollbar { width: 5px; }\
        ::-webkit-scrollbar-thumb { background: #C4B99A; border-radius: 3px; }\
        input, select, button { font-family: inherit; }\
      "}</style>

      <header style={{ background: "#2C2416", borderBottom: "2px solid #C4A55A", padding: isMobile ? "10px 16px" : "12px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #C4A55A, #E8C96A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Waves size={20} color="#2C2416" strokeWidth={2} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: isMobile ? 17 : 19, fontWeight: 800, color: "#F5EDD6", letterSpacing: 2, lineHeight: 1.1, margin: 0 }}>
                墨湯 <span style={{ fontSize: 10, fontWeight: 400, color: "#C4A55A", letterSpacing: 3 }}>SUMIYU</span>
              </h1>
              {!isMobile && <p style={{ fontSize: 9, color: "#9B8E72", letterSpacing: 3, fontWeight: 500, margin: 0 }}>タトゥーOK温泉・サウナ検索</p>}
            </div>
          </div>
          {!isMobile ? (
            <nav style={{ display: "flex", gap: 20 }}>
              {["施設を探す", "エリアから探す", "新着施設"].map(function(item) {
                return <a key={item} href="#" style={{ color: "#C4B99A", fontSize: 12, textDecoration: "none", fontWeight: 500, letterSpacing: 1 }}>{item}</a>;
              })}
            </nav>
          ) : (
            <button onClick={function() { setMobileMenu(!mobileMenu); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              {mobileMenu ? <X size={22} color="#F5EDD6" /> : <Menu size={22} color="#F5EDD6" />}
            </button>
          )}
        </div>
        {isMobile && mobileMenu && (
          <nav style={{ padding: "12px 0 4px", display: "flex", flexDirection: "column", gap: 10, animation: "fadeIn 0.2s" }}>
            {["施設を探す", "エリアから探す", "新着施設"].map(function(item) {
              return <a key={item} href="#" onClick={function() { setMobileMenu(false); }} style={{ color: "#C4B99A", fontSize: 13, textDecoration: "none", fontWeight: 500, letterSpacing: 1, padding: "6px 0", borderBottom: "1px solid rgba(196,165,90,0.15)" }}>{item}</a>;
            })}
          </nav>
        )}
      </header>

      <section style={{ background: "linear-gradient(170deg, #2C2416 0%, #4A3C28 45%, #3D3222 100%)", padding: isMobile ? "48px 16px 56px" : "60px 24px 70px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, background: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(196,165,90,0.3) 40px, rgba(196,165,90,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(196,165,90,0.3) 40px, rgba(196,165,90,0.3) 41px)" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(196,165,90,0.12)", border: "1px solid rgba(196,165,90,0.25)", borderRadius: 24, padding: "5px 14px", marginBottom: 20 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6BCB77", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, color: "#C4A55A", fontWeight: 600, letterSpacing: 2 }}>{"全 " + facilities.length + " 施設掲載中"}</span>
          </div>
          <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: isMobile ? 28 : 38, fontWeight: 800, color: "#F5EDD6", marginBottom: 12, lineHeight: 1.35, letterSpacing: 2 }}>
            タトゥーがあっても、<br />
            <span style={{ background: "linear-gradient(90deg, #C4A55A, #E8C96A, #C4A55A)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
              心ゆくまで、湯に浸かる
            </span>
          </h2>
          <p style={{ fontSize: isMobile ? 13 : 14, color: "#9B8E72", lineHeight: 1.8, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
            全国のタトゥーOKな温泉・サウナ・銭湯・スパをかんたんに検索。あなたの「ととのい」を見つけよう。
          </p>
          <div style={{ maxWidth: 540, margin: "0 auto", background: "rgba(255,252,245,0.95)", borderRadius: 14, padding: 5, boxShadow: "0 6px 30px rgba(0,0,0,0.18)", display: "flex", alignItems: "center" }}>
            <div style={{ padding: "0 12px", display: "flex", alignItems: "center" }}>
              <Search size={18} color="#9B917E" strokeWidth={1.8} />
            </div>
            <input type="text" placeholder="施設名・エリア・キーワードで検索" value={search} onChange={function(e) { setSearch(e.target.value); }}
              style={{ flex: 1, border: "none", background: "none", padding: isMobile ? "12px 6px" : "14px 6px", fontSize: 14, color: "#2C2416", outline: "none" }}
            />
            <button onClick={function() { resultsRef.current && resultsRef.current.scrollIntoView({ behavior: "smooth" }); }}
              style={{ background: "linear-gradient(135deg, #2C5F4A, #3D7B62)", color: "#fff", border: "none", borderRadius: 10, padding: isMobile ? "12px 18px" : "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: 1, whiteSpace: "nowrap" }}
            >検索</button>
          </div>
        </div>
      </section>

      <section style={{ background: "#FEFCF9", borderBottom: "1px solid #EDE8DF", padding: "0 8px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0, minWidth: "max-content" }}>
          {REGIONS.map(function(r) {
            return (
              <button key={r.id} onClick={function() { setRegion(r.id); }}
                style={{ background: region === r.id ? "#2C2416" : "transparent", color: region === r.id ? "#F5EDD6" : "#6B6152", border: "none", padding: isMobile ? "10px 12px" : "12px 16px", fontSize: isMobile ? 12 : 13, fontWeight: region === r.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", borderRadius: region === r.id ? 6 : 0, margin: "6px 2px", transition: "all 0.2s" }}
              >{r.name}</button>
            );
          })}
        </div>
      </section>

      <main ref={resultsRef} style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "20px 12px 48px" : "28px 24px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 3, background: "#FEFCF9", borderRadius: 8, padding: 3, border: "1px solid #EDE8DF" }}>
              {FACILITY_TYPES.map(function(ft) {
                return (
                  <button key={ft.id} onClick={function() { setFacilityType(ft.id); }}
                    style={{ background: facilityType === ft.id ? "#2C2416" : "transparent", color: facilityType === ft.id ? "#F5EDD6" : "#6B6152", border: "none", borderRadius: 6, padding: isMobile ? "6px 10px" : "7px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                  >{ft.name}</button>
                );
              })}
            </div>
            <button onClick={function() { setShowFilters(!showFilters); }}
              style={{ background: showFilters ? "#2C2416" : "#FEFCF9", color: showFilters ? "#F5EDD6" : "#6B6152", border: "1px solid #EDE8DF", borderRadius: 8, padding: "7px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
            >
              <SlidersHorizontal size={13} strokeWidth={1.8} /> 絞り込み
              {selectedTags.length > 0 && (
                <span style={{ background: "#C4A55A", color: "#fff", fontSize: 9, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{selectedTags.length}</span>
              )}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#9B917E" }}><strong style={{ color: "#2C2416" }}>{filtered.length}</strong> 件</span>
            <select value={sortBy} onChange={function(e) { setSortBy(e.target.value); }}
              style={{ background: "#FEFCF9", border: "1px solid #EDE8DF", borderRadius: 8, padding: "7px 10px", fontSize: 11, color: "#4A4235", cursor: "pointer", outline: "none" }}
            >
              <option value="rating">評価順</option>
              <option value="reviews">口コミ数順</option>
              <option value="price_low">料金が安い順</option>
              <option value="price_high">料金が高い順</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div style={{ background: "#FEFCF9", borderRadius: 12, padding: isMobile ? "14px 14px" : "16px 18px", marginBottom: 20, border: "1px solid #EDE8DF", animation: "slideUp 0.25s ease" }}>
            <p style={{ fontSize: 11, color: "#9B917E", fontWeight: 600, marginBottom: 10, letterSpacing: 1 }}>設備・サービスで絞り込み</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TAG_LIST.map(function(tag) {
                return (
                  <button key={tag} onClick={function() { toggleTag(tag); }}
                    style={{ background: selectedTags.indexOf(tag) !== -1 ? "#2C5F4A" : "#F5F0E8", color: selectedTags.indexOf(tag) !== -1 ? "#fff" : "#5A5344", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                  >{tag}</button>
                );
              })}
            </div>
            {selectedTags.length > 0 && (
              <button onClick={function() { setSelectedTags([]); }}
                style={{ background: "none", border: "none", color: "#B85C3A", fontSize: 11, cursor: "pointer", marginTop: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}
              ><XCircle size={13} /> フィルターをクリア</button>
            )}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Waves size={36} color="#C4A55A" strokeWidth={1.2} style={{ animation: "pulse 1.5s infinite" }} />
            <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 13, color: "#9B917E", marginTop: 12 }}>施設を読み込み中...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(260px, 1fr))" : "repeat(auto-fill, minmax(300px, 1fr))", gap: isMobile ? 14 : 20 }}>
            {filtered.map(function(f, i) {
              return (
                <div key={f.id} style={{ animation: "slideUp 0.4s ease " + (i * 0.04) + "s both" }}>
                  <FacilityCard facility={f} onClick={setModal} isMobile={isMobile} />
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Search size={40} color="#C4B99A" strokeWidth={1} />
            <p style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, color: "#6B6152", marginTop: 12, marginBottom: 6 }}>条件に一致する施設が見つかりませんでした</p>
            <p style={{ fontSize: 12, color: "#9B917E" }}>検索条件を変更してお試しください</p>
          </div>
        )}
      </main>

      <footer style={{ background: "#2C2416", padding: isMobile ? "36px 16px 24px" : "40px 24px 28px", borderTop: "2px solid #C4A55A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexDirection: isMobile ? "column" : "row", gap: 28, marginBottom: 28 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Waves size={22} color="#C4A55A" strokeWidth={1.8} />
                <span style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 800, color: "#F5EDD6", letterSpacing: 2 }}>墨湯 <span style={{ fontSize: 10, fontWeight: 400, color: "#C4A55A" }}>SUMIYU</span></span>
              </div>
              <p style={{ fontSize: 11, color: "#6B5E48", lineHeight: 1.8, maxWidth: 280 }}>タトゥーがあっても楽しめる温泉・サウナ・銭湯の情報を全国からお届け。すべての人に開かれた入浴文化を目指して。</p>
            </div>
            {!isMobile && (
              <div style={{ display: "flex", gap: 36 }}>
                <div>
                  <h4 style={{ fontSize: 11, color: "#C4A55A", fontWeight: 700, marginBottom: 12, letterSpacing: 2 }}>サービス</h4>
                  {["施設を探す", "エリアから探す", "新着施設", "人気ランキング"].map(function(item) { return <a key={item} href="#" style={{ display: "block", fontSize: 11, color: "#6B5E48", textDecoration: "none", marginBottom: 8 }}>{item}</a>; })}
                </div>
                <div>
                  <h4 style={{ fontSize: 11, color: "#C4A55A", fontWeight: 700, marginBottom: 12, letterSpacing: 2 }}>サポート</h4>
                  {["施設の掲載申請", "お問い合わせ", "利用規約", "プライバシーポリシー"].map(function(item) { return <a key={item} href="#" style={{ display: "block", fontSize: 11, color: "#6B5E48", textDecoration: "none", marginBottom: 8 }}>{item}</a>; })}
                </div>
              </div>
            )}
          </div>
          <div style={{ borderTop: "1px solid rgba(196,165,90,0.15)", paddingTop: 16, textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#4A3E2E", letterSpacing: 1 }}>© 2026 墨湯 SUMIYU — All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Modal facility={modal} onClose={function() { setModal(null); }} isMobile={isMobile} />
    </div>
  );
}
