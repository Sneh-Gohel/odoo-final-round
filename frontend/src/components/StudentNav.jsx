import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function StudentNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear any auth tokens / session storage if needed
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "Profile", path: "/student/profile" },
    { name: "Placements", path: "/student/placements" },
    { name: "Events", path: "/student/events" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/student/dashboard">
          StudentPortal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <Link
                  to={link.path}
                  className={`nav-link ${
                    location.pathname === link.path ? "active fw-bold" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="nav-item">
              <button
                className="btn btn-outline-danger ms-3"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default StudentNav;
