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
    <div className="notif-wrapper">
      <button className="notif-bell" onClick={() => setOpen(v => !v)}>
        🔔 {unread > 0 ? `(${unread})` : ""}
      </button>
      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button className="notif-clear" onClick={() => setItems([])}>
                Clear
              </button>
            )}
          </div>

          <div className="notif-list">
            {items.length === 0 ? (
              <div className="notif-empty">No new posts</div>
            ) : (
              items.map(n => (
                <div key={n.id} className="notif-item">
                  <div className="notif-title">
                    {n.title || n.content?.slice(0, 40) || "New post"}
                  </div>
                  <div className="notif-meta">
                    by {n.author?.name || "Unknown"} — {formatDateYMDHMS(n.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
