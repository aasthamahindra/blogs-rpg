import { useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react"
import { Link } from "react-router-dom";

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
      createdAt
      author {
        name
      }
    }
  }
`;

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

function formatDateYMDHMS(input) {
  const d = new Date(input);
  if (isNaN(d.getTime())) return input;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function Feed() {
  const { data, loading, error, subscribeToMore } = useQuery(GET_POSTS);

  useEffect(() => {
    const unsub = subscribeToMore({
      document: POST_CREATED_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        const newPost = subscriptionData.data?.postCreated;
        if (!newPost) return prev;
        if (prev.posts.some((p) => p.id === newPost.id)) return prev;
        return { posts: [newPost, ...prev.posts] };
      },
    });
    return () => unsub();
  }, [subscribeToMore]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">Error loading feed!</p>;

  return (
    <div className="feed-container container">
      <div className="feed-header">
        <Link to="/create-post" className="create-post-btn">
          + Create New Post
        </Link>
      </div>

      <div className="posts-list">
        {data.posts && data.posts.length > 0 ? (
          data.posts.map((p) => (
            <div key={p.id} className="post-card">
              {p.title && <h3 className="post-title">{p.title}</h3>}
              <p className="post-content">{p.content}</p>
              <div className="post-meta">
                <span className="post-author">{p.author.name}</span>
                <span className="post-date">{formatDateYMDHMS(p.createdAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <h1 className="no-posts-text">No Posts Available</h1>
        )}
      </div>
    </div>
  );
}