// File: src/components/TpoNav.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function TpoNav() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3">
      <Link className="navbar-brand fw-bold text-primary" to="/tpo/dashboard">
        TPO Dashboard
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/tpo/dashboard">
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/tpo/companies">
              Companies
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/tpo/students">
              Students
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tpo/test">
              test
            </Link>
          </li>

          <li className="nav-item">
            <button
              className="btn btn-outline-primary ms-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default TpoNav;
