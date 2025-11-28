import { useState, useEffect, useContext } from "react";
import { gql } from "@apollo/client";
import { useMutation } from '@apollo/client/react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";

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
  const { login: loginToContext } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  const [loginMutation, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      loginToContext(data.login.token, data.login.user);
      navigate("/");
    },
  });

  const submit = (e) => {
    e.preventDefault();
    loginMutation({ variables: form });
  };

  useEffect(() => {
    if (error) window.alert(error.message);
  }, [error]);

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Welcome Back!</h1>

      <form onSubmit={submit} className="custom-form">
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
      </form>
    </div>
  );
}