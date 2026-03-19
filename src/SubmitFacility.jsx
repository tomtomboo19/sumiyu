import { useState } from "react";
import { supabase } from "./lib/supabase";
import {
  X, Send, CheckCircle, MapPin, Clock, Globe, FileText,
  ThermometerSun, Flame, Bath, Sparkles, Loader2, AlertCircle,
} from "lucide-react";

var PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県",
  "三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
  "鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県",
  "福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

var TYPES = [
  { id: "onsen", label: "温泉", icon: ThermometerSun, color: "#8B6914" },
  { id: "sauna", label: "サウナ", icon: Flame, color: "#1A5276" },
  { id: "sento", label: "銭湯", icon: Bath, color: "#2E6B14" },
  { id: "spa", label: "スパ", icon: Sparkles, color: "#76145A" },
];

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6152", marginBottom: 5, letterSpacing: 0.5 }}>
        {label} {required && <span style={{ color: "#E85D3A" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

var inputStyle = {
  width: "100%", border: "1px solid #EDE8DF", borderRadius: 8,
  padding: "10px 12px", fontSize: 14, color: "#2C2416",
  outline: "none", background: "#F8F4ED", fontFamily: "'Noto Sans JP', sans-serif",
};

export default function SubmitFacilityModal({ onClose, isMobile, userId }) {
  var [form, setForm] = useState({
    name: "", type: "onsen", prefecture: "", city: "",
    address: "", description: "", hours: "", price: "", website_url: "",
  });
  var [loading, setLoading] = useState(false);
  var [done, setDone] = useState(false);
  var [err, setErr] = useState("");

  function update(key, val) {
    setForm(function(prev) {
      var next = {}; for (var k in prev) next[k] = prev[k];
      next[key] = val; return next;
    });
  }

  function handleSubmit() {
    if (!form.name || !form.prefecture || !form.city || !form.address) {
      setErr("施設名・都道府県・市区町村・住所は必須です");
      return;
    }
    setLoading(true); setErr("");
    supabase.from("facility_submissions").insert({
      submitted_by: userId,
      name: form.name,
      type: form.type,
      prefecture: form.prefecture,
      city: form.city,
      address: form.address,
      description: form.description || null,
      hours: form.hours || null,
      price: form.price ? parseInt(form.price, 10) : null,
      website_url: form.website_url || null,
    }).then(function(res) {
      setLoading(false);
      if (res.error) { setErr(res.error.message); }
      else { setDone(true); }
    });
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,15,5,0.55)", backdropFilter: "blur(6px)", zIndex: 1100, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 20, animation: "fadeIn 0.25s" }}>
      <div onClick={function(e) { e.stopPropagation(); }} style={{ background: "#FEFCF9", maxWidth: 520, width: "100%", maxHeight: isMobile ? "92vh" : "85vh", overflow: "auto", borderRadius: isMobile ? "18px 18px 0 0" : 18, boxShadow: "0 24px 60px rgba(20,15,5,0.25)" }}>
        <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h3 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 20, fontWeight: 700, color: "#2C2416", margin: 0 }}>施設を登録申請</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} color="#9B917E" /></button>
        </div>
        <div style={{ padding: "0 24px 24px" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "40px 0 20px" }}>
              <CheckCircle size={48} color="#2C5F4A" strokeWidth={1.5} />
              <p style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, color: "#2C2416", marginTop: 16 }}>申請を受け付けました</p>
              <p style={{ fontSize: 13, color: "#6B6152", lineHeight: 1.7, marginTop: 8 }}>管理者が確認後、サイトに掲載されます。<br />ご協力ありがとうございます。</p>
              <button onClick={onClose} style={{ marginTop: 20, background: "linear-gradient(135deg, #2C5F4A, #3D7B62)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>閉じる</button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 12, color: "#9B917E", lineHeight: 1.7, marginBottom: 16 }}>タトゥーOKの温泉・サウナ・銭湯・スパの情報をお寄せください。管理者が確認後、サイトに掲載されます。</p>

              <Field label="施設名" required>
                <input type="text" value={form.name} onChange={function(e) { update("name", e.target.value); }} placeholder="例：天然温泉 満天の湯" style={inputStyle} />
              </Field>

              <Field label="施設タイプ" required>
                <div style={{ display: "flex", gap: 6 }}>
                  {TYPES.map(function(t) {
                    var Icon = t.icon;
                    var selected = form.type === t.id;
                    return (
                      <button key={t.id} onClick={function() { update("type", t.id); }}
                        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 8px", borderRadius: 8, border: selected ? "2px solid " + t.color : "1px solid #EDE8DF", background: selected ? t.color + "10" : "#F8F4ED", cursor: "pointer", transition: "all 0.2s" }}>
                        <Icon size={18} color={selected ? t.color : "#9B917E"} strokeWidth={1.5} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: selected ? t.color : "#9B917E" }}>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <Field label="都道府県" required>
                    <select value={form.prefecture} onChange={function(e) { update("prefecture", e.target.value); }}
                      style={Object.assign({}, inputStyle, { cursor: "pointer" })}>
                      <option value="">選択してください</option>
                      {PREFECTURES.map(function(p) { return <option key={p} value={p}>{p}</option>; })}
                    </select>
                  </Field>
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="市区町村" required>
                    <input type="text" value={form.city} onChange={function(e) { update("city", e.target.value); }} placeholder="例：横浜市" style={inputStyle} />
                  </Field>
                </div>
              </div>

              <Field label="住所" required>
                <input type="text" value={form.address} onChange={function(e) { update("address", e.target.value); }} placeholder="例：保土ケ谷区上星川3-1-1" style={inputStyle} />
              </Field>

              <Field label="説明">
                <textarea value={form.description} onChange={function(e) { update("description", e.target.value); }} placeholder="タトゥーOKであることや、施設の特徴をお書きください" rows={3}
                  style={Object.assign({}, inputStyle, { resize: "vertical", minHeight: 72 })} />
              </Field>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <Field label="営業時間">
                    <input type="text" value={form.hours} onChange={function(e) { update("hours", e.target.value); }} placeholder="例：9:00〜25:00" style={inputStyle} />
                  </Field>
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="料金（円）">
                    <input type="number" value={form.price} onChange={function(e) { update("price", e.target.value); }} placeholder="例：900" style={inputStyle} />
                  </Field>
                </div>
              </div>

              <Field label="公式サイトURL">
                <input type="url" value={form.website_url} onChange={function(e) { update("website_url", e.target.value); }} placeholder="https://..." style={inputStyle} />
              </Field>

              {err && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "rgba(232,93,58,0.08)", borderRadius: 8, marginBottom: 12 }}>
                  <AlertCircle size={14} color="#E85D3A" />
                  <span style={{ fontSize: 12, color: "#E85D3A" }}>{err}</span>
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading}
                style={{ width: "100%", padding: "12px 0", background: loading ? "#9B917E" : "linear-gradient(135deg, #2C5F4A, #3D7B62)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: 1 }}>
                {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
                {loading ? "送信中..." : "申請する"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
