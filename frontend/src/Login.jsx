import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Role:", role, "Name:", name, "Password:", password);
    if (role === "Student") navigate("/student/dashboard");
    if (role === "Company") navigate("/company/dashboard");
    if (role === "TPO") navigate("/tpo/dashboard");
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
          {/* Title */}
          <h4 className="text-center mb-4">
            Continue your journey to placements
          </h4>

          {/* Role Select */}
          <div className="mb-3">
            <label className="form-label">Select Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Your Role</option>
              <option value="Student">Student</option>
              <option value="Company">Company</option>
              <option value="TPO">TPO</option>
            </select>
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <Link to="/student/register" className="text-decoration-none fw-bold">
              Signup Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;
