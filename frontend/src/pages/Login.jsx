import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from '@apollo/client/react';
import { useNavigate } from "react-router-dom";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.login.token);
      navigate("/");
    },
  });

  const submit = (e) => {
    e.preventDefault();
    login({ variables: form });
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Login</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        /><br/>

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        /><br/>

        <button disabled={loading}>Login</button>

        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </form>
    </div>
  );
}
