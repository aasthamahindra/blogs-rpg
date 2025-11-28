import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
      createdAt
      author {
        id
        name
        email
      }
    }
  }
`;

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    onCompleted: () => navigate("/"),
  });

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createPost({ variables: { title, content } });
  };

  return (
  <div className="form-card">
    <h2>Create a New Post</h2>
    <form onSubmit={submit} className="custom-form">
      <label>Title</label>
      <input
        type="text"
        placeholder="Enter a catchy title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Content</label>
      <textarea
        rows="6"
        placeholder="Write something meaningful..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button disabled={loading}>
        {loading ? "Publishing..." : "Publish"}
      </button>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error.message}</p>}
    </form>
  </div>
  );
}
