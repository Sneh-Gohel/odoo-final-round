import "./StudentReg.css"; // custom css for exact palette
import { Link, useNavigate } from "react-router-dom";

function StudentReg() {
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
      <h1 className="fw-bold text-dark mb-4">Student Registration</h1>

      <div className="row reg-card shadow-lg rounded-4 p-4">
        {/* Illustration */}
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

        {/* Form */}
        <div className="col-md-6">
          <form action="" method="POST">
            <div className="mb-3">
              <select
                className="form-select custom-input"
                onChange={handleRoleChange}
                defaultValue="Student"
              >
                <option value="Student">Student</option>
                <option value="Company">Company</option>
                <option value="TPO">TPO</option>
              </select>
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Enter your Name"
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control custom-input"
                placeholder="Enter your Email"
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
                placeholder="Roll Number"
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control custom-input"
                placeholder="CGPA"
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                className="form-control custom-input"
                placeholder="No. of Backlogs"
              />
            </div>

            <div className="mb-3">
              <select className="form-select custom-input" defaultValue="">
                <option value="" hidden>
                  Select Your Institute
                </option>
                <option>SPEC</option>
                <option>DDIT</option>
                <option>Changa</option>
              </select>
            </div>

            <div className="mb-3">
              <select className="form-select custom-input">
                <option>Select Your Branch</option>
                <option>CSE</option>
                <option>IT</option>
                <option>ECE</option>
              </select>
            </div>

            <div className="mb-3">
              <select className="form-select custom-input">
                <option>Select Your Year</option>
                <option>2025</option>
                <option>2026</option>
                <option>2027</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary custom-btn w-100">
              Create Your Account
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
