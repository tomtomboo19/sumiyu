import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Star, Send, Loader2, MessageCircle, Trash2 } from "lucide-react";

function StarSelect({ value, onChange }) {
  var [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(function(s) {
        return (
          <button key={s} type="button"
            onMouseEnter={function() { setHover(s); }}
            onMouseLeave={function() { setHover(0); }}
            onClick={function() { onChange(s); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, transition: "transform 0.15s", transform: (hover === s) ? "scale(1.2)" : "scale(1)" }}>
            <Star size={24} fill={(hover || value) >= s ? "#C4A55A" : "none"} color={(hover || value) >= s ? "#C4A55A" : "#D4CFC4"} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}

function TimeAgo({ date }) {
  var now = new Date();
  var d = new Date(date);
  var diff = Math.floor((now - d) / 1000);
  var text = "";
  if (diff < 60) text = "たった今";
  else if (diff < 3600) text = Math.floor(diff / 60) + "分前";
  else if (diff < 86400) text = Math.floor(diff / 3600) + "時間前";
  else if (diff < 2592000) text = Math.floor(diff / 86400) + "日前";
  else if (diff < 31536000) text = Math.floor(diff / 2592000) + "ヶ月前";
  else text = Math.floor(diff / 31536000) + "年前";
  return <span style={{ fontSize: 10, color: "#9B917E" }}>{text}</span>;
}

export default function Reviews({ facilityId, user, onReviewChange }) {
  var [reviews, setReviews] = useState([]);
  var [loading, setLoading] = useState(true);
  var [rating, setRating] = useState(0);
  var [body, setBody] = useState("");
  var [posting, setPosting] = useState(false);
  var [err, setErr] = useState("");

  useEffect(function() {
    fetchReviews();
  }, [facilityId]);

  function fetchReviews() {
    setLoading(true);
    supabase.from("reviews")
      .select("*, profiles(display_name)")
      .eq("facility_id", facilityId)
      .order("created_at", { ascending: false })
      .then(function(res) {
        if (!res.error && res.data) setReviews(res.data);
        setLoading(false);
      });
  }

  function handlePost() {
    if (!rating) { setErr("星評価を選んでください"); return; }
    setPosting(true); setErr("");
    supabase.from("reviews").upsert({
      user_id: user.id,
      facility_id: facilityId,
      rating: rating,
      body: body || null,
    }, { onConflict: "user_id,facility_id" })
    .then(function(res) {
      setPosting(false);
      if (res.error) { setErr(res.error.message); }
      else {
        setRating(0); setBody("");
        fetchReviews();
        if (onReviewChange) onReviewChange();
      }
    });
  }

  function handleDelete(reviewId) {
    supabase.from("reviews").delete().eq("id", reviewId).then(function(res) {
      if (!res.error) {
        fetchReviews();
        if (onReviewChange) onReviewChange();
      }
    });
  }

  var existing = user ? reviews.find(function(r) { return r.user_id === user.id; }) : null;

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <MessageCircle size={16} color="#6B6152" strokeWidth={1.8} />
        <h4 style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 14, fontWeight: 700, color: "#2C2416", margin: 0 }}>口コミ</h4>
        <span style={{ fontSize: 12, color: "#9B917E" }}>({reviews.length}件)</span>
      </div>

      {/* Post form */}
      {user ? (
        <div style={{ background: "#F8F4ED", borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6B6152", marginBottom: 8 }}>
            {existing ? "あなたの口コミを更新" : "口コミを投稿"}
          </p>
          <StarSelect value={rating} onChange={setRating} />
          <textarea value={body} onChange={function(e) { setBody(e.target.value); }}
            placeholder="この施設の感想をお書きください（任意）" rows={3}
            style={{ width: "100%", border: "1px solid #EDE8DF", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#2C2416", outline: "none", background: "#FEFCF9", fontFamily: "'Noto Sans JP', sans-serif", resize: "vertical", marginTop: 10 }} />
          {err && <p style={{ fontSize: 11, color: "#E85D3A", margin: "6px 0 0" }}>{err}</p>}
          <button onClick={handlePost} disabled={posting}
            style={{ marginTop: 10, background: posting ? "#9B917E" : "linear-gradient(135deg, #2C5F4A, #3D7B62)", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 12, fontWeight: 700, cursor: posting ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {posting ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={13} />}
            {posting ? "送信中" : existing ? "更新する" : "投稿する"}
          </button>
        </div>
      ) : (
        <div style={{ background: "#F8F4ED", borderRadius: 10, padding: "14px 16px", marginBottom: 16, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#6B6152" }}>口コミを投稿するにはログインしてください</p>
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Loader2 size={20} color="#C4A55A" style={{ animation: "spin 1s linear infinite" }} />
        </div>
      ) : reviews.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.map(function(r) {
            var name = r.profiles ? r.profiles.display_name : "ゲスト";
            var isOwn = user && r.user_id === user.id;
            return (
              <div key={r.id} style={{ borderBottom: "1px solid #EDE8DF", paddingBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #C4A55A, #E8C96A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#2C2416" }}>
                      {name.charAt(0)}
                    </div>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#2C2416" }}>{name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {[1,2,3,4,5].map(function(s) {
                          return <Star key={s} size={10} fill={s <= r.rating ? "#C4A55A" : "none"} color={s <= r.rating ? "#C4A55A" : "#D4CFC4"} strokeWidth={1.5} />;
                        })}
                        <TimeAgo date={r.created_at} />
                      </div>
                    </div>
                  </div>
                  {isOwn && (
                    <button onClick={function() { handleDelete(r.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: 0.5 }}
                      title="削除">
                      <Trash2 size={14} color="#9B917E" />
                    </button>
                  )}
                </div>
                {r.body && <p style={{ fontSize: 13, color: "#4A4235", lineHeight: 1.7, margin: "6px 0 0 36px", fontFamily: "'Noto Sans JP', sans-serif" }}>{r.body}</p>}
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ fontSize: 12, color: "#9B917E", textAlign: "center", padding: "12px 0" }}>まだ口コミはありません。最初の口コミを投稿してみましょう。</p>
      )}
    </div>
  );
}
