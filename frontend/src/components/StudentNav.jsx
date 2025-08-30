import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function StudentNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
  // Clear JWT token, role, and user info from localStorage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  // Redirect to login page
  navigate("/login");
};


  const navLinks = [
    { name: "Jobs", path: "/student/dashboard/job" },
    { name: "Resume Builder", path: "/student/dashboard/resume" },
    { name: "Leader Board", path: "/student/dashboard/leaderboard" },
    { name: "Profile", path: "/student/dashboard/profile" },
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
