import { useState } from "react";
import { gql } from "@apollo/client";
import { useSubscription } from "@apollo/client/react";

const POST_CREATED_SUB = gql`
  subscription {
    postCreated {
      id
      title
      content
      createdAt
      author { name }
    }
  }
`;

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useSubscription(POST_CREATED_SUB, {
    onData: ({ data }) => {
      const p = data.data?.postCreated;
      if (p) setItems((prev) => [{ ...p }, ...prev].slice(0, 20));
    },
  });

  const unread = items.length;

  const formatDateYMDHMS = (input) => {
    const d = new Date(input);
    if (isNaN(d.getTime())) return input;
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const HH = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yyyy}-${MM}-${dd} ${HH}-${mm}-${ss}`;
  };

  return (
    <div style={{ display: "inline-block", position: "relative", marginRight: 12 }}>
      <button onClick={() => setOpen((v) => !v)}>
        🔔 {unread > 0 ? `(${unread})` : ""}
      </button>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "120%",
          background: "white", border: "1px solid #ddd", width: 280, zIndex: 10
        }}>
          <div style={{ padding: 8, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
            <strong>Notifications</strong>
            {unread > 0 && (
              <button onClick={() => setItems([])} style={{ fontSize: 12 }}>Clear</button>
            )}
          </div>
          <div style={{ maxHeight: 300, overflow: "auto" }}>
            {items.length === 0 ? (
              <div style={{ padding: 8 }}>No new posts</div>
            ) : items.map((n) => (
              <div key={n.id} style={{ padding: 8, borderBottom: "1px solid #f2f2f2" }}>
                <div style={{ fontWeight: 500 }}>{n.title || n.content?.slice(0, 40) || "New post"}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  by {n.author?.name || "Unknown"} — {formatDateYMDHMS(n.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
