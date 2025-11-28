import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams, Link } from "react-router-dom";

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      createdAt
      author { name }
    }
  }
`;

function formatDateYMDHMS(input) {
  const d = new Date(input);
  if (isNaN(d.getTime())) return input;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function Post() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_POST, { variables: { id } });

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">Error loading post!</p>;

  const p = data?.post;
  if (!p) return <p className="error-text">Post not found</p>;

  return (
    <div className="post-fullscreen-container container">
      <div className="feed-header">
        <Link to="/" className="create-post-btn">
          ← Back to Feed
        </Link>
      </div>

      <div className="post-card-full">
        {p.title && <h1 className="post-title-full">{p.title}</h1>}
        <div className="post-meta">
          <span className="post-author">{p.author?.name}</span>
          <span className="post-date">{formatDateYMDHMS(p.createdAt)}</span>
        </div>
        <div className="post-content-full">{p.content}</div>
      </div>
    </div>
  );
}
