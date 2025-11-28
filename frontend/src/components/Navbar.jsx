import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const isLoggedIn = !!token;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {isLoggedIn && (
          <h2 className="navbar-title">
            <Link to="/">Blogs</Link>
          </h2>
        )}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <NotificationBell />
            <Link to="/login" onClick={handleLogout}>Logout</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
