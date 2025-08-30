import { Link, useNavigate } from "react-router-dom";

function CompanyReg() {
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const role = e.target.value;
    if (role === "Student") navigate("/student/register");
    if (role === "Company") navigate("/company/register");
    if (role === "TPO") navigate("/tpo/register");
  };

  return (
    <div className="student-reg-container d-flex flex-column justify-content-center align-items-center">
      {/* Header */}
      <h1 className="fw-bold text-dark mb-4">Company Registration</h1>

      <div className="row reg-card shadow-lg rounded-4 p-4">
        {/* Illustration */}
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

        {/* Form */}
        <div className="col-md-6">
          <form action="" method="POST">
            {/* Role selector */}
            <div className="mb-3">
              <select
                className="form-select custom-input"
                onChange={handleRoleChange}
                defaultValue="Company"
              >
                <option>Student</option>
                <option>Company</option>
                <option>TPO</option>
              </select>
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Company Name"
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control custom-input"
                placeholder="Company Email"
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control custom-input"
                placeholder="Password"
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control custom-input"
                placeholder="Confirm Password"
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control custom-input"
                placeholder="HR Contact Person"
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Contact Number"
              />
            </div>

            <div className="mb-3">
              <textarea
                className="form-control custom-input"
                placeholder="Company Description"
                rows="3"
              ></textarea>
            </div>

            <div className="mb-3">
              <input
                type="url"
                className="form-control custom-input"
                placeholder="Company Website URL"
              />
            </div>

            <button type="submit" className="btn btn-primary custom-btn w-100">
              Create Account
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
