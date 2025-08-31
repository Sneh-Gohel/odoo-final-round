import { useEffect, useState } from "react";
import TpoNav from "../components/TpoNav";

function TpoCompanies() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedJob, setSelectedJob] = useState(null);
  const [applicantsData, setApplicantsData] = useState(null);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const token = localStorage.getItem("jwtToken");

  // Fetch jobs list
  useEffect(() => {
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    fetch("http://192.168.137.97:3000/api/jobs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
      })
      .then((data) => {
        setJobs(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  // Fetch applicants when job selected
  const handleViewApplicants = (jobId) => {
    setSelectedJob(jobId);
    setApplicantsData(null);
    setLoadingApplicants(true);

    fetch(`http://192.168.137.97:3000/api/tpo/jobs/${jobId}/applicants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
      })
      .then((data) => {
        setApplicantsData(data);
        setLoadingApplicants(false);
      })
      .catch((err) => {
        console.error(err);
        setApplicantsData(null);
        setLoadingApplicants(false);
      });

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("applicantsModal"));
    modal.show();
  };

  return (
    <>
      <TpoNav />
      <div className="container py-4">
        <h3 className="mb-4 text-primary">Available Jobs</h3>

        {loading && <div className="text-center mt-5">Loading jobs...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && jobs.length === 0 && (
          <div className="alert alert-warning">No jobs available.</div>
        )}

        <div className="row">
          {jobs.map((job) => (
            <div key={job.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0 rounded-3">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{job.title}</h5>
                  <p className="card-text">
                    <strong>Location:</strong> {job.location} <br />
                    <strong>Package:</strong> {job.package_lpa} LPA <br />
                    <strong>Tier:</strong> {job.tier} <br />
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        job.status === "OPEN" ? "text-success" : "text-danger"
                      }
                    >
                      {job.status}
                    </span>{" "}
                    <br />
                    <strong>Deadline:</strong>{" "}
                    {new Date(job.application_deadline).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleViewApplicants(job.id)}
                  >
                    View Applicants
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="applicantsModal"
        tabIndex="-1"
        aria-labelledby="applicantsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="applicantsModalLabel">
                Applicants
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {loadingApplicants && (
                <div className="text-center my-4">Loading applicants...</div>
              )}

              {applicantsData && (
                <>
                  {/* Job Details */}
                  <div className="mb-3">
                    <h5 className="fw-bold">{applicantsData.jobDetails.title}</h5>
                    <p className="text-muted">{applicantsData.jobDetails.description}</p>
                    <p>
                      <strong>Location:</strong> {applicantsData.jobDetails.location} <br />
                      <strong>Package:</strong> {applicantsData.jobDetails.package_lpa} LPA <br />
                      <strong>Min CGPA:</strong> {applicantsData.jobDetails.min_cgpa} <br />
                      <strong>Allowed Departments:</strong>{" "}
                      {JSON.parse(applicantsData.jobDetails.allowed_departments).join(", ")} <br />
                      <strong>Max Backlogs:</strong> {applicantsData.jobDetails.max_backlogs}
                    </p>
                  </div>

                  {/* Applicants */}
                  <h6 className="fw-bold">Applicants:</h6>
                  {applicantsData.applicants.length === 0 ? (
                    <div className="alert alert-warning">No applicants found.</div>
                  ) : (
                    <div className="list-group">
                      {applicantsData.applicants.map((applicant, index) => (
                        <div
                          key={index}
                          className="list-group-item list-group-item-action flex-column align-items-start"
                        >
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{applicant.full_name}</h6>
                            <small className="text-muted">
                              {new Date(applicant.applied_at).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-1">
                            <strong>Enrollment No:</strong> {applicant.enrollment_no} <br />
                            <strong>Branch:</strong> {applicant.branch} <br />
                            <strong>Year:</strong> {applicant.current_year} <br />
                            <strong>CGPA:</strong> {applicant.cgpa} <br />
                            <strong>Skills:</strong> {applicant.skills} <br />
                            <strong>Backlogs:</strong> {applicant.active_backlogs} <br />
                            <strong>Status:</strong> {applicant.application_status}
                          </p>
                          <a
                            href={applicant.default_resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View Resume
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TpoCompanies;