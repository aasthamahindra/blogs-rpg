import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        textDecoration: "none",
      }}
    >
      {/* Show "Blogs" only when logged in */}
      {isLoggedIn ? (
        <h2>
          <Link to="/">Blogs</Link>
        </h2>
      ) : (
        <div></div> // placeholder to keep spacing aligned
      )}

      <div>
        {isLoggedIn ? (
          <>
            <NotificationBell />
            <Link to="/create-post">Create</Link>
            <button style={{ marginLeft: 10 }} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link style={{ marginLeft: 10 }} to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
