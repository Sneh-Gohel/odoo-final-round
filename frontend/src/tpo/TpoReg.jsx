import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function TpoReg() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "TPO",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    institute: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    if (role === "Student") navigate("/student/register");
    if (role === "Company") navigate("/company/register");
    if (role === "TPO") setFormData({ ...formData, role: "TPO" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      role: formData.role,
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      instituteName: formData.institute,
      contactPhone: formData.contactNumber,
    };

    try {
      const res = await fetch("http://192.168.137.97:3000/api/auth/register", {
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
      {/* Loader */}
      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <h1 className="fw-bold text-dark mb-4">TPO Registration</h1>

      <div className="row reg-card shadow-lg rounded-4 p-4">
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
          <img
            src="http://localhost:5173/src/images/Registartionimg.png"
            alt="TPO Registration Illustration"
            className="img-fluid mb-3"
            style={{ maxWidth: "360px" }}
          />
          <p className="text-muted text-center">
            Register as TPO to manage student placements and connect with top talent.
          </p>
        </div>

        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <select
                className="form-select custom-input"
                name="role"
                onChange={handleRoleChange}
                defaultValue="TPO"
              >
                <option value="Student">Student</option>
                <option value="Company">Company</option>
                <option value="TPO">TPO</option>
              </select>
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Full Name"
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="TPO Email"
              />
            </div>

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

            <div className="mb-3">
              <input
                type="text"
                name="institute"
                value={formData.institute}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Institute / College"
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Contact Number"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary custom-btn w-100"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create Account"}
            </button>

            <p className="text-center mt-2 small">
              Already have an account?{" "}
              <Link to="/login" className="text-success fw-semibold">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default TpoReg;