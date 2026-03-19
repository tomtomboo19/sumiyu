import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import {
  X, Check, XCircle, Trash2, Eye, EyeOff, ChevronLeft,
  FileText, MessageCircle, Building2, Star, Loader2, Bell,
} from "lucide-react";

var TABS = [
  { id: "submissions", label: "施設申請", icon: FileText },
  { id: "reviews", label: "口コミ管理", icon: MessageCircle },
  { id: "facilities", label: "施設管理", icon: Building2 },
];

function Badge({ color, children }) {
  var colors = {
    pending: { bg: "#FEF3C7", text: "#92400E" },
    approved: { bg: "#D1FAE5", text: "#065F46" },
    rejected: { bg: "#FEE2E2", text: "#991B1B" },
    green: { bg: "#D1FAE5", text: "#065F46" },
    gray: { bg: "#F3F4F6", text: "#374151" },
  };
  var c = colors[color] || colors.gray;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, letterSpacing: 0.5 }}>{children}</span>
  );
}

function SubmissionsTab() {
  var [items, setItems] = useState([]);
  var [loading, setLoading] = useState(true);

  useEffect(function() { fetch(); }, []);

  function fetch() {
    setLoading(true);
    supabase.from("facility_submissions").select("*, profiles(display_name)").order("created_at", { ascending: false })
      .then(function(res) { if (!res.error) setItems(res.data || []); setLoading(false); });
  }

  function updateStatus(id, status) {
    supabase.from("facility_submissions").update({ status: status, updated_at: new Date().toISOString() }).eq("id", id)
      .then(function(res) { if (!res.error) fetch(); });
  }

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}><Loader2 size={24} color="#C4A55A" style={{ animation: "spin 1s linear infinite" }} /></div>;

  return (
    <div>
      {items.length === 0 ? (
        <p style={{ textAlign: "center", color: "#9B917E", padding: 40, fontSize: 13 }}>申請はまだありません</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(function(item) {
            var submitter = item.profiles ? item.profiles.display_name : "不明";
            return (
              <div key={item.id} style={{ background: "#FEFCF9", borderRadius: 10, padding: 16, border: "1px solid #EDE8DF" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, color: "#2C2416" }}>{item.name}</span>
                    <Badge color={item.status}>{item.status}</Badge>
                  </div>
                  <span style={{ fontSize: 10, color: "#9B917E" }}>{new Date(item.created_at).toLocaleDateString("ja-JP")}</span>
                </div>
                <div style={{ fontSize: 12, color: "#6B6152", lineHeight: 1.7, marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>{item.type}</span> · {item.prefecture}{item.city} {item.address}
                  {item.description && <p style={{ margin: "4px 0 0", color: "#9B917E" }}>{item.description}</p>}
                  {item.hours && <span> · {item.hours}</span>}
                  {item.price && <span> · ¥{item.price}</span>}
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9B917E" }}>申請者: {submitter}</p>
                </div>
                {item.status === "pending" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={function() { updateStatus(item.id, "approved"); }}
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", background: "#2C5F4A", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      <Check size={13} /> 承認
                    </button>
                    <button onClick={function() { updateStatus(item.id, "rejected"); }}
                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", background: "#FEFCF9", color: "#991B1B", border: "1px solid #FEE2E2", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      <XCircle size={13} /> 却下
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReviewsTab() {
  var [items, setItems] = useState([]);
  var [loading, setLoading] = useState(true);

  useEffect(function() { fetch(); }, []);

  function fetch() {
    setLoading(true);
    supabase.from("reviews").select("*, profiles(display_name), facilities(name)").order("created_at", { ascending: false })
      .then(function(res) { if (!res.error) setItems(res.data || []); setLoading(false); });
  }

  function deleteReview(id) {
    if (!confirm("この口コミを削除しますか？")) return;
    supabase.from("reviews").delete().eq("id", id)
      .then(function(res) { if (!res.error) fetch(); });
  }

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}><Loader2 size={24} color="#C4A55A" style={{ animation: "spin 1s linear infinite" }} /></div>;

  return (
    <div>
      {items.length === 0 ? (
        <p style={{ textAlign: "center", color: "#9B917E", padding: 40, fontSize: 13 }}>口コミはまだありません</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(function(item) {
            var userName = item.profiles ? item.profiles.display_name : "不明";
            var facilityName = item.facilities ? item.facilities.name : "不明";
            return (
              <div key={item.id} style={{ background: "#FEFCF9", borderRadius: 10, padding: 14, border: "1px solid #EDE8DF", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#2C2416" }}>{userName}</span>
                    <span style={{ fontSize: 11, color: "#9B917E" }}>→</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#2C5F4A" }}>{facilityName}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 4 }}>
                    {[1,2,3,4,5].map(function(s) { return <Star key={s} size={11} fill={s <= item.rating ? "#C4A55A" : "none"} color={s <= item.rating ? "#C4A55A" : "#D4CFC4"} strokeWidth={1.5} />; })}
                    <span style={{ fontSize: 10, color: "#9B917E", marginLeft: 4 }}>{new Date(item.created_at).toLocaleDateString("ja-JP")}</span>
                  </div>
                  {item.body && <p style={{ fontSize: 12, color: "#4A4235", lineHeight: 1.6, margin: 0 }}>{item.body}</p>}
                </div>
                <button onClick={function() { deleteReview(item.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 6, opacity: 0.5 }} title="削除">
                  <Trash2 size={15} color="#991B1B" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FacilitiesTab() {
  var [items, setItems] = useState([]);
  var [loading, setLoading] = useState(true);

  useEffect(function() { fetch(); }, []);

  function fetch() {
    setLoading(true);
    supabase.from("facilities").select("*").order("created_at", { ascending: false })
      .then(function(res) { if (!res.error) setItems(res.data || []); setLoading(false); });
  }

  function togglePublish(id, current) {
    supabase.from("facilities").update({ is_published: !current }).eq("id", id)
      .then(function(res) { if (!res.error) fetch(); });
  }

  function deleteFacility(id) {
    if (!confirm("この施設を完全に削除しますか？")) return;
    supabase.from("facilities").delete().eq("id", id)
      .then(function(res) { if (!res.error) fetch(); });
  }

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}><Loader2 size={24} color="#C4A55A" style={{ animation: "spin 1s linear infinite" }} /></div>;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map(function(f) {
          return (
            <div key={f.id} style={{ background: "#FEFCF9", borderRadius: 10, padding: 14, border: "1px solid #EDE8DF", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: f.is_published ? 1 : 0.6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#2C2416" }}>{f.name}</span>
                  <Badge color={f.is_published ? "green" : "gray"}>{f.is_published ? "公開中" : "非公開"}</Badge>
                </div>
                <span style={{ fontSize: 11, color: "#9B917E" }}>{f.type} · {f.prefecture}{f.city} · ★{Number(f.rating_avg).toFixed(1)} ({f.review_count}件)</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={function() { togglePublish(f.id, f.is_published); }}
                  style={{ background: "none", border: "1px solid #EDE8DF", borderRadius: 6, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}
                  title={f.is_published ? "非公開にする" : "公開する"}>
                  {f.is_published ? <EyeOff size={14} color="#9B917E" /> : <Eye size={14} color="#2C5F4A" />}
                </button>
                <button onClick={function() { deleteFacility(f.id); }}
                  style={{ background: "none", border: "1px solid #FEE2E2", borderRadius: 6, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}
                  title="削除">
                  <Trash2 size={14} color="#991B1B" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminPanel({ onClose, isMobile }) {
  var [tab, setTab] = useState("submissions");

  return (
    <div style={{ position: "fixed", inset: 0, background: "#F5F0E6", zIndex: 1200, overflow: "auto" }}>
      <header style={{ background: "#2C2416", borderBottom: "2px solid #C4A55A", padding: "12px 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}>
              <ChevronLeft size={20} color="#C4B99A" />
            </button>
            <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700, color: "#F5EDD6", margin: 0, letterSpacing: 1 }}>管理画面</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={18} color="#C4B99A" />
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#FEFCF9", borderRadius: 10, padding: 4, border: "1px solid #EDE8DF" }}>
          {TABS.map(function(t) {
            var Icon = t.icon;
            var active = tab === t.id;
            return (
              <button key={t.id} onClick={function() { setTab(t.id); }}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 12px", borderRadius: 8, border: "none", background: active ? "#2C2416" : "transparent", color: active ? "#F5EDD6" : "#6B6152", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                <Icon size={14} strokeWidth={1.8} />
                {!isMobile && t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "submissions" && <SubmissionsTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "facilities" && <FacilitiesTab />}
      </div>
    </div>
  );
}
