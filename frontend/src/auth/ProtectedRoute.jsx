import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Login from "../pages/Login";

export default function ProtectedRoute({ children }) {
  const { token, authReady } = useContext(AuthContext);

  if (!authReady) {
    return <div>Loading...</div>;
  }

  return token ? children : <Login />;
}
