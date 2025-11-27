import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';

const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const [register, {loading, error}] = useMutation(REGISTER, {
        onCompleted: (data) => {
            localStorage.setItem("token", data.register.token);
            navigate('/login');
        },
    });

    const submit = (e) => {
        e.preventDefault();
        register({ variables: form });
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
          <h2>Create account</h2>
          <form onSubmit={submit}>
          <input
              placeholder="Name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            /><br/>

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

            <button disabled={loading}>Register</button>

            {error && <p style={{ color: "red" }}>{error.message}</p>}
          </form>
        </div>
    );
}