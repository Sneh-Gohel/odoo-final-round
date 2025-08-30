import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Ip from "./Ip.jsx"; // function returning backend URL

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Auto redirect if already logged in
  useEffect(() => {
  const token = localStorage.getItem("jwtToken");
  const savedRole = localStorage.getItem("role");
  if (token && savedRole) {
    navigate(`/${savedRole.toLowerCase()}/dashboard`);
  }
}, []); // run once only


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select your role before logging in.");
      return;
    }

    try {
      const res = await fetch(Ip("3000/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token and role
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate to dashboard immediately
      navigate(`/${data.user.role.toLowerCase()}/dashboard`);
    } catch (err) {
      setError(err.message);
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Left Side Image */}
      <div className="d-flex justify-content-center align-items-center bg-white w-50">
        <img
          src="../src/images/login.jpg"
          alt="Placement Illustration"
          className="img-fluid"
          style={{ maxHeight: "50%", maxWidth: "80%" }}
        />
      </div>

      {/* Right Side Form */}
      <div className="d-flex justify-content-center align-items-center w-50 bg-primary">
        <div
          className="bg-white shadow-lg p-4"
          style={{ width: "400px", borderRadius: "20px" }}
        >
          <h4 className="text-center mb-4">
            Continue your journey to placements
          </h4>

          {error && <p className="text-danger text-center">{error}</p>}

          {/* Role Select */}
          <div className="mb-3">
            <label className="form-label">Select Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option hidden>Select Your Role</option>
              <option value="STUDENT">Student</option>
              <option value="COMPANY">Company</option>
              <option value="TPO">TPO</option>
            </select>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            className="btn btn-primary w-100 rounded-pill py-2"
            onClick={handleLogin}
          >
            Login
          </button>

          {/* Signup link */}
          <p className="text-center mt-3 small">
            Create an account?{" "}
            <Link
              to="/student/register"
              className="text-decoration-none fw-bold"
            >
              Signup Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
