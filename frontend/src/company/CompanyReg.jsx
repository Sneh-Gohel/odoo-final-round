import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function CompanyReg() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "COMPANY",
    companyName: "",
    companyEmail: "",
    password: "",
    confirmPassword: "",
    hrContact: "",
    contact: "",
    description: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    if (role === "Student") navigate("/student/register");
    if (role === "Company") setFormData({ ...formData, role: "COMPANY" });
    if (role === "TPO") navigate("/tpo/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: formData.companyEmail, 
      password: formData.password,
      role: formData.role,
      companyName: formData.companyName,
      contactEmail: formData.companyEmail,
      contact: formData.contact,
      hrContactPhone: formData.hrContact,
      description: formData.description,
      websiteUrl: formData.website
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

      <h1 className="fw-bold text-dark mb-4">Company Registration</h1>

      <div className="row reg-card shadow-lg rounded-4 p-4">
        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
          <img
            src="http://localhost:5173/src/images/Registartionimg.png"
            alt="Company Registration Illustration"
            className="img-fluid mb-3"
            style={{ maxWidth: "360px" }}
          />
          <p className="text-muted text-center">
            Register your company and connect with top talent.
          </p>
        </div>

        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div className="mb-3">
              <select
                className="form-select custom-input"
                name="role"
                onChange={handleRoleChange}
                defaultValue="Company"
              >
                <option value="Student">Student</option>
                <option value="Company">Company</option>
                <option value="TPO">TPO</option>
              </select>
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Company Name"
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Company Email"
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="General Contact"
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
                name="hrContact"
                value={formData.hrContact}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="HR Contact"
              />
            </div>

            <div className="mb-3">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Company Description"
                rows="3"
              ></textarea>
            </div>

            <div className="mb-3">
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="form-control custom-input"
                placeholder="Company Website URL"
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

export default CompanyReg;
