import { useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
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

function formatDateYMDHMS(input) {
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
}

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div style={{ maxWidth: 600, margin: "30px auto" }}>
      <h2>Feed</h2>
      <Link to="/create-post">+ Create New Post</Link>

      <div style={{ marginTop: 20 }}>
        {data.posts.map((p) => (
          <div key={p.id} style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 10
          }}>
            {p.title && <h4 style={{ margin: "0 0 6px" }}>{p.title}</h4>}
            <p>{p.content}</p>
            <small>
              by {p.author.name} — {formatDateYMDHMS(p.createdAt)}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
