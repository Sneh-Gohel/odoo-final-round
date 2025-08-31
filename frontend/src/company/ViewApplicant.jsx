import { useEffect, useState } from "react";

function ViewApplicant() {
  const [jobDetails, setJobDetails] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwtToken");
  const jobId = localStorage.getItem("jobId"); // Job ID from localStorage

  useEffect(() => {
    if (!jobId) {
      setError("No job selected. Please select a job from the dashboard.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/api/company/jobs/${jobId}/applicants`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
      })
      .then((data) => {
        setJobDetails(data.jobDetails);
        setApplicants(data.applicants || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [jobId, token]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="container py-4">
      {/* Job Details */}
      <div className="card shadow-sm p-3 mb-4">
        <h4>{jobDetails.title}</h4>
        <p>{jobDetails.description}</p>
        <p>
          <strong>Location:</strong> {jobDetails.location} |{" "}
          <strong>Package:</strong> {jobDetails.package_lpa} LPA |{" "}
          <strong>Tier:</strong> {jobDetails.tier}
        </p>
        <p>
          <strong>Min CGPA:</strong> {jobDetails.min_cgpa} |{" "}
          <strong>Max Backlogs:</strong> {jobDetails.max_backlogs} |{" "}
          <strong>Departments:</strong> {jobDetails.allowed_departments.join(", ")}
        </p>
        <p>
          <strong>Application Deadline:</strong>{" "}
          {new Date(jobDetails.application_deadline).toLocaleDateString()} |{" "}
          <strong>Status:</strong> {jobDetails.status}
        </p>
      </div>

      {/* Applicants List */}
      <h5 className="mb-3">Applicants</h5>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <div className="row">
          {applicants.map((applicant, index) => (
            <div key={index} className="col-md-6 mb-3">
              <div className="card shadow-sm p-3">
                <h6>{applicant.full_name}</h6>
                <p>
                  <strong>Enrollment No:</strong> {applicant.enrollment_no}<br/>
                  <strong>Branch:</strong> {applicant.branch} | <strong>Year:</strong> {applicant.current_year}<br/>
                  <strong>CGPA:</strong> {applicant.cgpa}<br/>
                  <strong>Skills:</strong> {applicant.skills}<br/>
                  <strong>Backlogs:</strong> {applicant.active_backlogs}<br/>
                  <strong>Status:</strong> {applicant.application_status}<br/>
                  <strong>Applied At:</strong> {new Date(applicant.applied_at).toLocaleString()}<br/>
                  <strong>Resume:</strong>{" "}
                  {applicant.default_resume_url ? (
                    <a href={applicant.default_resume_url} target="_blank" rel="noreferrer">View</a>
                  ) : " Not uploaded"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewApplicant;
