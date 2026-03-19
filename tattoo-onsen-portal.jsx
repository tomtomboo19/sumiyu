import { useState, useEffect, useRef } from "react";

const REGIONS = [
  { id: "all", name: "全国", icon: "🗾" },
  { id: "hokkaido", name: "北海道", icon: "❄️" },
  { id: "tohoku", name: "東北", icon: "🌸" },
  { id: "kanto", name: "関東", icon: "🏙️" },
  { id: "chubu", name: "中部", icon: "🏔️" },
  { id: "kinki", name: "近畿", icon: "⛩️" },
  { id: "chugoku", name: "中国", icon: "🌊" },
  { id: "shikoku", name: "四国", icon: "🍊" },
  { id: "kyushu", name: "九州・沖縄", icon: "🌺" },
];

const FACILITY_TYPES = [
  { id: "all", name: "すべて" },
  { id: "onsen", name: "温泉" },
  { id: "sauna", name: "サウナ" },
  { id: "sento", name: "銭湯" },
  { id: "spa", name: "スパ" },
];

const TAGS = ["露天風呂", "サウナ", "水風呂", "岩盤浴", "貸切風呂", "食事処", "駐車場", "駅近", "深夜営業", "宿泊可"];

const FACILITIES = [
  { id: 1, name: "天然温泉 満天の湯", type: "onsen", region: "kanto", prefecture: "神奈川県", city: "横浜市", address: "横浜市保土ケ谷区上星川3-1-1", rating: 4.5, reviews: 328, price: 900, tags: ["露天風呂", "サウナ", "水風呂", "食事処", "駐車場"], hours: "9:00〜25:00", description: "開放感あふれる露天風呂と本格サウナが自慢。タトゥーの方も安心してご利用いただけます。", hot: true, image_hue: 15 },
  { id: 2, name: "スパ ラクーア", type: "spa", region: "kanto", prefecture: "東京都", city: "文京区", address: "文京区春日1-1-1", rating: 4.3, reviews: 1205, price: 3230, tags: ["露天風呂", "サウナ", "岩盤浴", "食事処", "深夜営業"], hours: "11:00〜翌9:00", description: "東京ドームシティ内の都市型スパ。多彩なサウナと天然温泉でリフレッシュ。", hot: true, image_hue: 200 },
  { id: 3, name: "ニコーリフレ", type: "sauna", region: "hokkaido", prefecture: "北海道", city: "札幌市", address: "札幌市中央区南3条西2", rating: 4.7, reviews: 892, price: 1400, tags: ["サウナ", "水風呂", "食事処", "深夜営業", "宿泊可"], hours: "24時間営業", description: "札幌を代表するサウナ施設。名物のロウリュは必見。タトゥーフレンドリー。", hot: true, image_hue: 180 },
  { id: 4, name: "大磯プリンスホテル THERMAL SPA S.WAVE", type: "spa", region: "kanto", prefecture: "神奈川県", city: "大磯町", address: "中郡大磯町国府本郷546", rating: 4.4, reviews: 456, price: 4500, tags: ["露天風呂", "サウナ", "水風呂", "食事処", "駐車場"], hours: "10:00〜21:00", description: "相模湾を一望できるインフィニティプール＆サウナ施設。", hot: false, image_hue: 210 },
  { id: 5, name: "サウナの梅湯", type: "sento", region: "kinki", prefecture: "京都府", city: "京都市", address: "京都市下京区岩滝町175", rating: 4.6, reviews: 675, price: 490, tags: ["サウナ", "水風呂", "駅近"], hours: "14:00〜26:00", description: "京都の老舗銭湯。レトロな雰囲気と良質なサウナが人気。タトゥーOK。", hot: true, image_hue: 340 },
  { id: 6, name: "天山湯治郷", type: "onsen", region: "kanto", prefecture: "神奈川県", city: "箱根町", address: "足柄下郡箱根町湯本茶屋208", rating: 4.8, reviews: 1023, price: 1300, tags: ["露天風呂", "食事処", "駐車場", "貸切風呂"], hours: "9:00〜22:00", description: "箱根の自然に囲まれた本格湯治場。源泉かけ流しの湯を堪能できます。", hot: false, image_hue: 120 },
  { id: 7, name: "ウェルビー栄", type: "sauna", region: "chubu", prefecture: "愛知県", city: "名古屋市", address: "名古屋市中区栄3-13-12", rating: 4.5, reviews: 743, price: 1600, tags: ["サウナ", "水風呂", "食事処", "深夜営業", "宿泊可", "駅近"], hours: "24時間営業", description: "名古屋のサウナーの聖地。からふろが名物の本格派サウナ施設。", hot: true, image_hue: 30 },
  { id: 8, name: "万葉の湯 博多", type: "onsen", region: "kyushu", prefecture: "福岡県", city: "福岡市", address: "福岡市博多区豊2-3-66", rating: 4.2, reviews: 534, price: 1800, tags: ["露天風呂", "サウナ", "岩盤浴", "食事処", "深夜営業", "宿泊可", "駐車場"], hours: "24時間営業", description: "博多駅から無料送迎バスあり。箱根・湯河原の名湯を博多で楽しめます。", hot: false, image_hue: 50 },
  { id: 9, name: "渋谷SAUNAS", type: "sauna", region: "kanto", prefecture: "東京都", city: "渋谷区", address: "渋谷区桜丘町18-9", rating: 4.4, reviews: 387, price: 1980, tags: ["サウナ", "水風呂", "駅近", "食事処"], hours: "8:00〜24:00", description: "渋谷駅徒歩5分の都市型サウナ。男女共用エリアもあり。タトゥーフレンドリー。", hot: true, image_hue: 260 },
  { id: 10, name: "道後温泉別館 飛鳥乃湯泉", type: "onsen", region: "shikoku", prefecture: "愛媛県", city: "松山市", address: "松山市道後湯之町19-22", rating: 4.6, reviews: 912, price: 610, tags: ["露天風呂", "駅近"], hours: "7:00〜22:00", description: "道後温泉の新しいシンボル。飛鳥時代の建築様式を再現した美しい外観。", hot: false, image_hue: 280 },
  { id: 11, name: "おふろcafé utatane", type: "spa", region: "kanto", prefecture: "埼玉県", city: "さいたま市", address: "さいたま市北区大成町4-179-3", rating: 4.3, reviews: 621, price: 1500, tags: ["露天風呂", "サウナ", "食事処", "宿泊可", "駐車場"], hours: "10:00〜翌9:00", description: "おしゃれなカフェ空間と温泉が融合。コワーキングスペースも完備。", hot: true, image_hue: 160 },
  { id: 12, name: "スカイスパYOKOHAMA", type: "sauna", region: "kanto", prefecture: "神奈川県", city: "横浜市", address: "横浜市西区高島2-19-12", rating: 4.5, reviews: 489, price: 1550, tags: ["サウナ", "水風呂", "食事処", "深夜営業", "駅近"], hours: "10:30〜翌8:30", description: "横浜駅直結の都市型サウナ。コワーキングもでき、ビジネスマンに人気。", hot: false, image_hue: 220 },
  { id: 13, name: "神戸サウナ＆スパ", type: "sauna", region: "kinki", prefecture: "兵庫県", city: "神戸市", address: "神戸市中央区下山手通2-2-10", rating: 4.6, reviews: 567, price: 1900, tags: ["サウナ", "水風呂", "食事処", "深夜営業", "宿泊可", "駅近"], hours: "24時間営業", description: "神戸三宮の老舗サウナ。フィンランド式サウナとアウフグースが人気。", hot: true, image_hue: 5 },
  { id: 14, name: "湯らっくす", type: "onsen", region: "kyushu", prefecture: "熊本県", city: "熊本市", address: "熊本市中央区本荘町722", rating: 4.8, reviews: 1456, price: 700, tags: ["露天風呂", "サウナ", "水風呂", "食事処", "深夜営業", "宿泊可", "駐車場"], hours: "24時間営業", description: "日本一深い水風呂（171cm）が名物。サウナーの聖地として全国的に有名。", hot: true, image_hue: 190 },
  { id: 15, name: "竜泉寺の湯 草加谷塚店", type: "onsen", region: "kanto", prefecture: "埼玉県", city: "草加市", address: "草加市谷塚上町476", rating: 4.1, reviews: 298, price: 750, tags: ["露天風呂", "サウナ", "水風呂", "岩盤浴", "食事処", "駐車場"], hours: "5:00〜翌2:00", description: "炭酸泉が自慢のスーパー銭湯。リーズナブルにタトゥーOKで入浴可能。", hot: false, image_hue: 90 },
  { id: 16, name: "御船山楽園ホテル らかんの湯", type: "sauna", region: "kyushu", prefecture: "佐賀県", city: "武雄市", address: "武雄市武雄町武雄4100", rating: 4.9, reviews: 823, price: 4900, tags: ["サウナ", "水風呂", "露天風呂", "食事処", "駐車場", "宿泊可"], hours: "宿泊者専用（日帰りは要確認）", description: "チームラボとコラボした幻想的なサウナ施設。自然との一体感が圧巻。", hot: true, image_hue: 130 },
  { id: 17, name: "松本湯", type: "sento", region: "kanto", prefecture: "東京都", city: "中野区", address: "中野区東中野5-29-12", rating: 4.4, reviews: 312, price: 520, tags: ["サウナ", "水風呂", "駅近"], hours: "15:30〜25:00", description: "リニューアルで生まれ変わった東中野の銭湯。良質なサウナが人気。", hot: false, image_hue: 45 },
  { id: 18, name: "やまの湯", type: "onsen", region: "tohoku", prefecture: "青森県", city: "青森市", address: "青森市大字浅虫字蛍谷31", rating: 4.3, reviews: 187, price: 600, tags: ["露天風呂", "駐車場"], hours: "7:00〜21:00", description: "浅虫温泉の隠れた名湯。陸奥湾を望む露天風呂は絶景。", hot: false, image_hue: 170 },
  { id: 19, name: "改良湯", type: "sento", region: "kanto", prefecture: "東京都", city: "渋谷区", address: "渋谷区東2-19-9", rating: 4.5, reviews: 445, price: 520, tags: ["サウナ", "水風呂", "駅近"], hours: "13:00〜24:00", description: "恵比寿のデザイナーズ銭湯。スタイリッシュな空間で本格サウナを堪能。", hot: true, image_hue: 300 },
  { id: 20, name: "ザ・ベッド＆スパ所沢", type: "spa", region: "kanto", prefecture: "埼玉県", city: "所沢市", address: "所沢市くすのき台1-14-8", rating: 4.2, reviews: 234, price: 1200, tags: ["サウナ", "水風呂", "食事処", "深夜営業", "宿泊可", "駅近"], hours: "24時間営業", description: "所沢駅前のカプセルホテル＆スパ。出張にも便利なサウナ付き宿泊施設。", hot: false, image_hue: 240 },
];

function FacilityImage({ hue, type, name }) {
  const patterns = {
    onsen: { emoji: "♨️", bg: `linear-gradient(135deg, hsl(${hue}, 40%, 85%) 0%, hsl(${hue + 30}, 50%, 75%) 100%)` },
    sauna: { emoji: "🧖", bg: `linear-gradient(135deg, hsl(${hue}, 45%, 80%) 0%, hsl(${hue + 20}, 55%, 70%) 100%)` },
    sento: { emoji: "🛁", bg: `linear-gradient(135deg, hsl(${hue}, 35%, 88%) 0%, hsl(${hue + 25}, 45%, 78%) 100%)` },
    spa: { emoji: "💆", bg: `linear-gradient(135deg, hsl(${hue}, 50%, 82%) 0%, hsl(${hue + 35}, 60%, 72%) 100%)` },
  };
  const p = patterns[type] || patterns.onsen;
  return (
    <div style={{ background: p.bg, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px)` }} />
      <span style={{ fontSize: 48, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))", position: "relative", zIndex: 1 }}>{p.emoji}</span>
    </div>
  );
}

function Stars({ rating }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 20 20" fill={s <= Math.round(rating) ? "#E8913A" : "#D4CFC4"}>
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26 5.06 16.7 6 11.21l-4-3.9 5.53-.8z" />
        </svg>
      ))}
      <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 13, fontWeight: 700, color: "#E8913A", marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function TypeBadge({ type }) {
  const colors = {
    onsen: { bg: "#E8DDD3", text: "#8B6914", label: "温泉" },
    sauna: { bg: "#D3E0E8", text: "#1A5276", label: "サウナ" },
    sento: { bg: "#DDE8D3", text: "#2E6B14", label: "銭湯" },
    spa: { bg: "#E8D3E0", text: "#76145A", label: "スパ" },
  };
  const c = colors[type] || colors.onsen;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: 1 }}>
      {c.label}
    </span>
  );
}

function FacilityCard({ facility, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(facility)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FEFCF9",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 40px rgba(60,40,10,0.12), 0 4px 12px rgba(60,40,10,0.08)" : "0 2px 12px rgba(60,40,10,0.06)",
        border: "1px solid rgba(180,160,120,0.15)",
        position: "relative",
      }}
    >
      {facility.hot && (
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, background: "linear-gradient(135deg, #E85D3A, #E8913A)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 20, fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: 1, boxShadow: "0 2px 8px rgba(232,93,58,0.35)" }}>
          🔥 人気
        </div>
      )}
      <div style={{ height: 180, overflow: "hidden" }}>
        <FacilityImage hue={facility.image_hue} type={facility.type} name={facility.name} />
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <TypeBadge type={facility.type} />
          <span style={{ fontSize: 11, color: "#9B917E", fontFamily: "'Noto Sans JP', sans-serif" }}>
            {facility.prefecture} {facility.city}
          </span>
        </div>
        <h3 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700, color: "#2C2416", margin: "0 0 8px", lineHeight: 1.4, letterSpacing: 0.5 }}>
          {facility.name}
        </h3>
        <Stars rating={facility.rating} />
        <span style={{ fontSize: 11, color: "#9B917E", marginLeft: 6, fontFamily: "'Noto Sans JP', sans-serif" }}>({facility.reviews}件)</span>
        <p style={{ fontSize: 13, color: "#6B6152", margin: "10px 0", lineHeight: 1.7, fontFamily: "'Noto Sans JP', sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {facility.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          {facility.tags.slice(0, 4).map((tag) => (
            <span key={tag} style={{ background: "#F5F0E8", color: "#7A7062", fontSize: 10, padding: "3px 8px", borderRadius: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>
              {tag}
            </span>
          ))}
          {facility.tags.length > 4 && (
            <span style={{ color: "#9B917E", fontSize: 10, padding: "3px 4px", fontFamily: "'Noto Sans JP', sans-serif" }}>+{facility.tags.length - 4}</span>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #EDE8DF", paddingTop: 12 }}>
          <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "#9B917E" }}>
            🕐 {facility.hours}
          </span>
          <span style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, color: "#2C2416" }}>
            ¥{facility.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function Modal({ facility, onClose }) {
  if (!facility) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,15,5,0.6)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.3s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#FEFCF9", borderRadius: 20, maxWidth: 580, width: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: "0 30px 80px rgba(20,15,5,0.3)" }}>
        <div style={{ height: 220, position: "relative" }}>
          <FacilityImage hue={facility.image_hue} type={facility.type} name={facility.name} />
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
            ✕
          </button>
          <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", gap: 8 }}>
            <TypeBadge type={facility.type} />
            {facility.hot && (
              <span style={{ background: "linear-gradient(135deg, #E85D3A, #E8913A)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>🔥 人気施設</span>
            )}
          </div>
        </div>
        <div style={{ padding: "24px 28px 28px" }}>
          <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 24, fontWeight: 700, color: "#2C2416", margin: "0 0 8px", letterSpacing: 1 }}>
            {facility.name}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Stars rating={facility.rating} />
            <span style={{ fontSize: 13, color: "#9B917E", fontFamily: "'Noto Sans JP', sans-serif" }}>({facility.reviews}件の口コミ)</span>
          </div>
          <p style={{ fontSize: 14, color: "#6B6152", lineHeight: 1.8, fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 20 }}>{facility.description}</p>
          <div style={{ background: "#F8F4ED", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px 16px", fontSize: 14, fontFamily: "'Noto Sans JP', sans-serif" }}>
              <span style={{ color: "#9B917E", fontWeight: 600 }}>📍 住所</span>
              <span style={{ color: "#4A4235" }}>{facility.prefecture}{facility.city} {facility.address}</span>
              <span style={{ color: "#9B917E", fontWeight: 600 }}>🕐 営業時間</span>
              <span style={{ color: "#4A4235" }}>{facility.hours}</span>
              <span style={{ color: "#9B917E", fontWeight: 600 }}>💰 料金</span>
              <span style={{ color: "#4A4235", fontWeight: 700 }}>¥{facility.price.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 13, color: "#9B917E", fontWeight: 600, marginBottom: 10 }}>設備・サービス</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {facility.tags.map((tag) => (
                <span key={tag} style={{ background: "#F0EBE2", color: "#5A5344", fontSize: 12, padding: "5px 12px", borderRadius: 6, fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", background: "linear-gradient(135deg, #2C6B4F, #3D8B6A)", borderRadius: 12, padding: "14px 20px", gap: 12 }}>
            <span style={{ fontSize: 28 }}>✅</span>
            <div>
              <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>タトゥー・刺青 OK</p>
              <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.8)", margin: "2px 0 0" }}>タトゥーのある方もご入場いただけます</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [facilityType, setFacilityType] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [modal, setModal] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const filtered = FACILITIES.filter((f) => {
    if (region !== "all" && f.region !== region) return false;
    if (facilityType !== "all" && f.type !== facilityType) return false;
    if (search && !f.name.includes(search) && !f.prefecture.includes(search) && !f.city.includes(search) && !f.description.includes(search) && !f.address.includes(search)) return false;
    if (selectedTags.length > 0 && !selectedTags.every((t) => f.tags.includes(t))) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    return 0;
  });

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E6", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        *::-webkit-scrollbar { width: 6px; }
        *::-webkit-scrollbar-thumb { background: #C4B99A; border-radius: 3px; }
        *::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* Header */}
      <header style={{
        background: "linear-gradient(180deg, #2C2416 0%, #3D3222 100%)",
        borderBottom: "3px solid #C4A55A",
        padding: "14px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 4px 20px rgba(20,15,5,0.3)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #C4A55A, #E8C96A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: "0 2px 8px rgba(196,165,90,0.4)",
            }}>
              ♨️
            </div>
            <div>
              <h1 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 20, fontWeight: 800, color: "#F5EDD6", letterSpacing: 2, lineHeight: 1.2 }}>
                墨湯 <span style={{ fontSize: 11, fontWeight: 400, color: "#C4A55A", letterSpacing: 3 }}>SUMIYU</span>
              </h1>
              <p style={{ fontSize: 9, color: "#9B8E72", letterSpacing: 3, fontWeight: 500 }}>タトゥーOK温泉・サウナ検索</p>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 20, alignItems: "center" }}>
            {["施設を探す", "エリアから探す", "新着施設"].map((item) => (
              <a key={item} href="#" style={{ color: "#C4B99A", fontSize: 12, textDecoration: "none", fontWeight: 500, letterSpacing: 1, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.target.style.color = "#F5EDD6")}
                onMouseLeave={(e) => (e.target.style.color = "#C4B99A")}>
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(170deg, #2C2416 0%, #4A3C28 40%, #5C4A32 70%, #3D3222 100%)",
        padding: "70px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, background: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(196,165,90,0.3) 40px, rgba(196,165,90,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(196,165,90,0.3) 40px, rgba(196,165,90,0.3) 41px)" }} />
        <div style={{ position: "absolute", top: 30, right: "10%", fontSize: 120, opacity: 0.06, animation: "float 6s ease-in-out infinite" }}>♨️</div>
        <div style={{ position: "absolute", bottom: 20, left: "8%", fontSize: 80, opacity: 0.04, animation: "float 8s ease-in-out infinite 2s" }}>🧖</div>
        <div style={{
          maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1,
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(.4,0,.2,1)",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(196,165,90,0.15)", border: "1px solid rgba(196,165,90,0.3)", borderRadius: 30, padding: "6px 18px", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6BCB77", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: "#C4A55A", fontWeight: 600, letterSpacing: 2 }}>全 {FACILITIES.length} 施設掲載中</span>
          </div>
          <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 42, fontWeight: 800, color: "#F5EDD6", marginBottom: 16, lineHeight: 1.3, letterSpacing: 3 }}>
            タトゥーがあっても、<br />
            <span style={{ background: "linear-gradient(90deg, #C4A55A, #E8C96A, #C4A55A)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
              心ゆくまで、湯に浸かる
            </span>
          </h2>
          <p style={{ fontSize: 15, color: "#9B8E72", lineHeight: 1.8, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
            全国のタトゥーOKな温泉・サウナ・銭湯・スパを<br />かんたんに検索。あなたの「ととのい」を見つけよう。
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: 600, margin: "0 auto",
            background: "rgba(255,252,245,0.95)",
            borderRadius: 16,
            padding: 6,
            boxShadow: "0 8px 40px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(196,165,90,0.3)",
            display: "flex",
            alignItems: "center",
          }}>
            <div style={{ padding: "0 16px", fontSize: 20, color: "#9B917E" }}>🔍</div>
            <input
              type="text"
              placeholder="施設名・エリア・キーワードで検索"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, border: "none", background: "none", padding: "16px 8px", fontSize: 15,
                fontFamily: "'Noto Sans JP', sans-serif", color: "#2C2416", outline: "none",
              }}
            />
            <button
              onClick={scrollToResults}
              style={{
                background: "linear-gradient(135deg, #2C6B4F, #3D8B6A)",
                color: "#fff", border: "none", borderRadius: 12, padding: "14px 28px",
                fontFamily: "'Noto Sans JP', sans-serif", fontSize: 14, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1, transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(44,107,79,0.3)",
              }}
              onMouseEnter={(e) => { e.target.style.transform = "scale(1.03)"; e.target.style.boxShadow = "0 6px 20px rgba(44,107,79,0.4)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 4px 12px rgba(44,107,79,0.3)"; }}
            >
              検索する
            </button>
          </div>
        </div>
      </section>

      {/* Region Quick Select */}
      <section style={{ background: "#FEFCF9", borderBottom: "1px solid #EDE8DF", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto", padding: "4px 0" }}>
          {REGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setRegion(r.id)}
              style={{
                background: region === r.id ? "linear-gradient(180deg, #2C6B4F, #3D8B6A)" : "transparent",
                color: region === r.id ? "#fff" : "#6B6152",
                border: "none",
                padding: "14px 18px",
                fontSize: 13,
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: region === r.id ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                borderRadius: 0,
                transition: "all 0.2s",
                borderBottom: region === r.id ? "none" : "2px solid transparent",
                position: "relative",
              }}
              onMouseEnter={(e) => { if (region !== r.id) e.target.style.color = "#2C2416"; }}
              onMouseLeave={(e) => { if (region !== r.id) e.target.style.color = "#6B6152"; }}
            >
              <span style={{ marginRight: 4 }}>{r.icon}</span> {r.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main ref={resultsRef} style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 60px" }}>
        {/* Filters Bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28,
          opacity: loaded ? 1 : 0, transition: "opacity 0.6s 0.3s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {/* Facility Type Toggles */}
            <div style={{ display: "flex", gap: 4, background: "#FEFCF9", borderRadius: 10, padding: 4, border: "1px solid #EDE8DF" }}>
              {FACILITY_TYPES.map((ft) => (
                <button
                  key={ft.id}
                  onClick={() => setFacilityType(ft.id)}
                  style={{
                    background: facilityType === ft.id ? "#2C2416" : "transparent",
                    color: facilityType === ft.id ? "#F5EDD6" : "#6B6152",
                    border: "none", borderRadius: 8, padding: "8px 16px",
                    fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s", letterSpacing: 0.5,
                  }}
                >
                  {ft.name}
                </button>
              ))}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: showFilters ? "#2C2416" : "#FEFCF9",
                color: showFilters ? "#F5EDD6" : "#6B6152",
                border: "1px solid #EDE8DF", borderRadius: 10, padding: "8px 16px",
                fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 14 }}>⚙️</span> 絞り込み
              {selectedTags.length > 0 && (
                <span style={{ background: "#E85D3A", color: "#fff", fontSize: 10, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                  {selectedTags.length}
                </span>
              )}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#9B917E" }}>
              <strong style={{ color: "#2C2416" }}>{filtered.length}</strong> 件の施設
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "#FEFCF9", border: "1px solid #EDE8DF", borderRadius: 10,
                padding: "8px 12px", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif",
                color: "#4A4235", cursor: "pointer", outline: "none",
              }}
            >
              <option value="rating">評価順</option>
              <option value="reviews">口コミ数順</option>
              <option value="price_low">料金が安い順</option>
              <option value="price_high">料金が高い順</option>
            </select>
          </div>
        </div>

        {/* Tag Filters (collapsible) */}
        {showFilters && (
          <div style={{
            background: "#FEFCF9", borderRadius: 14, padding: "18px 22px", marginBottom: 24,
            border: "1px solid #EDE8DF", animation: "slideUp 0.3s ease",
          }}>
            <p style={{ fontSize: 12, color: "#9B917E", fontWeight: 600, marginBottom: 12, letterSpacing: 1 }}>設備・サービスで絞り込み</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    background: selectedTags.includes(tag) ? "linear-gradient(135deg, #2C6B4F, #3D8B6A)" : "#F5F0E8",
                    color: selectedTags.includes(tag) ? "#fff" : "#5A5344",
                    border: "none", borderRadius: 8, padding: "8px 14px",
                    fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                style={{ background: "none", border: "none", color: "#E85D3A", fontSize: 12, cursor: "pointer", marginTop: 12, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 600 }}
              >
                ✕ フィルターをクリア
              </button>
            )}
          </div>
        )}

        {/* Results Grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {filtered.map((f, i) => (
              <div key={f.id} style={{ animation: `slideUp 0.5s ease ${i * 0.06}s both` }}>
                <FacilityCard facility={f} onClick={setModal} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.4 }}>🔍</div>
            <p style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 20, color: "#6B6152", marginBottom: 8 }}>条件に一致する施設が見つかりませんでした</p>
            <p style={{ fontSize: 13, color: "#9B917E" }}>検索条件を変更してお試しください</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: "linear-gradient(180deg, #2C2416, #1A1610)",
        padding: "48px 24px 32px",
        borderTop: "3px solid #C4A55A",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>♨️</span>
                <span style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 22, fontWeight: 800, color: "#F5EDD6", letterSpacing: 2 }}>
                  墨湯 <span style={{ fontSize: 11, fontWeight: 400, color: "#C4A55A" }}>SUMIYU</span>
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#6B5E48", lineHeight: 1.8, maxWidth: 300 }}>
                タトゥーがあっても楽しめる温泉・サウナ・銭湯の情報を全国からお届け。すべての人に開かれた入浴文化を目指して。
              </p>
            </div>
            <div style={{ display: "flex", gap: 40 }}>
              {[
                { title: "サービス", items: ["施設を探す", "エリアから探す", "新着施設", "人気ランキング"] },
                { title: "サポート", items: ["施設の掲載申請", "お問い合わせ", "利用規約", "プライバシーポリシー"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 style={{ fontSize: 12, color: "#C4A55A", fontWeight: 700, marginBottom: 14, letterSpacing: 2 }}>{col.title}</h4>
                  {col.items.map((item) => (
                    <a key={item} href="#" style={{ display: "block", fontSize: 12, color: "#6B5E48", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "#F5EDD6")} onMouseLeave={(e) => (e.target.style.color = "#6B5E48")}>
                      {item}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(196,165,90,0.2)", paddingTop: 20, textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "#4A3E2E", letterSpacing: 1 }}>© 2026 墨湯 SUMIYU — All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Modal facility={modal} onClose={() => setModal(null)} />
    </div>
  );
}
