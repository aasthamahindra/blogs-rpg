import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from '@apollo/client/react';
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    createPost({
      variables: {
        title,
        content,
      },
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Create a New Post</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            fontSize: 16,
          }}
        />

        <textarea
          rows="6"
          placeholder="Write your content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", padding: 10, fontSize: 16 }}
        />

        <button
          disabled={loading}
          style={{ marginTop: 15, padding: "10px 16px", fontSize: 16 }}
        >
          Publish
        </button>

        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </form>
    </div>
  );
}
