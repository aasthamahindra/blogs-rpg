import { useContext } from "react";
import { AuthContext } from "./auth/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { token, authReady } = useContext(AuthContext);

  if (!authReady) {
    return <div>Loading...</div>;
  }

  return token ? children : <Login />;
}
