import "./StudentReg.css"; // custom css for exact palette
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Ip from "../Ip.jsx";

function StudentReg() {
  const navigate = useNavigate();

  // Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const savedRole = localStorage.getItem("role");
    if (token && savedRole) {
      navigate(`/${savedRole.toLowerCase()}/dashboard`);
    }
  }, [navigate]);

  // form state
  const [formData, setFormData] = useState({
    role: "STUDENT",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    enrollmentNo: "",
    instituteName: "",
    currentYear: "",
    cgpa: "",
    active_backlogs: "",
    skills: "",
    branch: "",
  });

  // loading state
  const [loading, setLoading] = useState(false);

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle role change
  const handleRoleChange = (e) => {
    const role = e.target.value;
    if (role === "Student") {
      setFormData({ ...formData, role: "STUDENT" });
      navigate("/student/register");
    }
    if (role === "Company") navigate("/company/register");
    if (role === "TPO") navigate("/tpo/register");
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
      fullName: formData.fullName,
      enrollmentNo: formData.enrollmentNo,
      instituteName: formData.instituteName,
      branch: formData.branch,
      currentYear: Number(formData.currentYear),
      cgpa: Number(formData.cgpa),
      active_backlogs: Number(formData.active_backlogs) || 0,
      skills: formData.skills || "N/A",
    };

    try {
      const res = await fetch(Ip("3000/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      console.log("✅ Registered successfully:", result);
      navigate("/login");
    } catch (err) {
      console.error("❌ Registration failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-reg-container d-flex flex-column justify-content-center align-items-center">
      {/* Loader Overlay */}
      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <h1 className="fw-bold text-dark mb-4">Student Registration</h1>

      <div className="row reg-card shadow-lg rounded-4 p-4">
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
          <img
            src="http://localhost:5173/src/images/Registartionimg.png"
            alt="Registration Illustration"
            className="img-fluid mb-3"
            style={{ maxWidth: "360px" }}
          />
          <p className="text-muted text-center">
            Register and get matched with the best opportunities.
          </p>
        </div>

        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            {/* Role */}
            <div className="mb-3">
              <select
                className="form-select custom-input"
                name="role"
                onChange={handleRoleChange}
                defaultValue="Student"
              >
                <option value="Student">Student</option>
                <option value="Company">Company</option>
                <option value="TPO">TPO</option>
              </select>
            </div>

            {/* Full Name */}
            <div className="mb-3">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Enter your Name"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Enter your Email"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Password"
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Confirm Password"
              />
            </div>

            {/* Enrollment No */}
            <div className="mb-3">
              <input
                type="text"
                name="enrollmentNo"
                value={formData.enrollmentNo}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Roll / Enrollment Number"
              />
            </div>

            {/* CGPA */}
            <div className="mb-3">
              <input
                type="text"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="CGPA"
              />
            </div>

            {/* Active Backlogs */}
            <div className="mb-3">
              <input
                type="number"
                name="active_backlogs"
                value={formData.active_backlogs}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Active Backlogs"
              />
            </div>

            {/* Institute */}
            <div className="mb-3">
              <select
                className="form-select custom-input"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
              >
                <option value="" hidden>
                  Select Your Institute
                </option>
                <option value="SPEC">SPEC</option>
                <option value="DDIT">DDIT</option>
                <option value="Central University">Central University</option>
              </select>
            </div>

            {/* Branch */}
            <div className="mb-3">
              <select
                className="form-select custom-input"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="">Select Your Branch</option>
                <option value="Computer Science">Computer Science</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
              </select>
            </div>

            {/* Current Year */}
            <div className="mb-3">
              <select
                className="form-select custom-input"
                name="currentYear"
                value={formData.currentYear}
                onChange={handleChange}
              >
                <option hidden>Select Your Year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            {/* Skills */}
            <div className="mb-3">
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Skills (comma separated)"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary custom-btn w-100"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create Your Account"}
            </button>

            <p className="text-center mt-2 small">
              Already have an account?{" "}
              <Link to="/login" className="text-success fw-semibold">
                Login?
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default StudentReg;