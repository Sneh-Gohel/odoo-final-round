import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNav from "../components/StudentNav";
import Ip from "../Ip.jsx";

function StudentDashboard() {
  const navigate = useNavigate();

  // State to store API data
  const [appliedJobs, setAppliedJobs] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [placementStatus, setPlacementStatus] = useState("Not Placed");

  useEffect(() => {
    const token = localStorage.getItem("token");
    

    // Fetch dashboard data
    fetch(Ip("3000/api/student/dashboard"), {
      headers: {
        Authorization: `Bearer ${token}`, // Pass JWT token
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAppliedJobs(data.appliedJobs || 0);
        setUpcomingEvents(data.upcomingEvents || 0);
        setPlacementStatus(data.placementStatus || "Not Placed");
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
      });
  }, [navigate]);

  return (
    <div>
      {/* Navbar */}
      <StudentNav />

      {/* Main Dashboard */}
      <div className="container mt-4">
        <div className="row align-items-center">
          {/* Left Side → Cards */}
          <div className="col-md-6">
            {/* Welcome Section */}
            <h4 className="fw-bold">👋 Welcome Student</h4>

            <div className="row mt-3">
              <div className="col-md-4">
                <div className="card text-center shadow-sm p-3 rounded-3 bg-primary text-white">
                  <h6>Applied Jobs</h6>
                  <h3>{appliedJobs}</h3>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-center shadow-sm p-3 rounded-3 bg-warning text-white">
                  <h6>Upcoming Events</h6>
                  <h3>{upcomingEvents}</h3>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-center shadow-sm p-3 rounded-3 bg-success text-white">
                  <h6>Placement Status</h6>
                  <h6>{placementStatus}</h6>
                </div>
              </div>
            </div>

            {/* Sections */}
            <h5 className="mt-5 fw-bold">Sections</h5>
            <div className="row mt-3">
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm p-3 rounded-3 text-center bg-primary text-white">
                  <h6>Jobs</h6>
                  <p>Track and apply to opportunities.</p>
                  <button className="btn btn-light btn-sm fw-semibold">Go To</button>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card shadow-sm p-3 rounded-3 text-center bg-warning text-white">
                  <h6>Practice And Exam</h6>
                  <p>Test your skills and stay exam ready.</p>
                  <button className="btn btn-light btn-sm fw-semibold">Go To</button>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="card shadow-sm p-3 rounded-3 text-center bg-success text-white">
                  <h6>Resume Builder</h6>
                  <p>Build a resume that stands out.</p>
                  <button className="btn btn-light btn-sm fw-semibold">Go To</button>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div
                  className="card shadow-sm p-3 rounded-3 text-center text-white"
                  style={{ backgroundColor: "#8e44ad" }}
                >
                  <h6>Leader-Board</h6>
                  <p>See where you rank among peers.</p>
                  <button className="btn btn-light btn-sm fw-semibold">Go To</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side → Illustration */}
          <div className="col-md-6 text-center">
            <img
            
              src="../src/images/Studentdashboard.jpg"
              alt="illustration"
              className="img-fluid"
              style={{ maxHeight: "500px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
