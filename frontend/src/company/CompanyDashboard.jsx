import { useEffect, useState } from "react";

function CompanyDashboard() {
  const [companyData, setCompanyData] = useState(null);
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobsError, setJobsError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    package_lpa: "",
    tier: "TIER_2",
    min_cgpa: "",
    allowed_departments: "",
    max_backlogs: "",
    application_deadline: "",
  });

  // get token from localStorage
  const token = localStorage.getItem("jwtToken");

  // 1️⃣ Fetch company profile
  useEffect(() => {
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    fetch("http://192.168.137.97:3000/api/company/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      })
      .then((data) => {
        // Handle both array and object responses
        if (Array.isArray(data) && data.length > 0) {
          setCompanyData(data[0]);
        } else {
          setCompanyData(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching company data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  // 2️⃣ Fetch jobs posted by this company
  const fetchJobs = () => {
    if (!token) {
      setJobsError("No authentication token found");
      setJobsLoading(false);
      return;
    }

    setJobsLoading(true);
    fetch("http://192.168.137.97:3000/api/jobs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
      })
      .then((data) => {
        // Handle different response formats
        if (data.jobs) {
          setJobsList(data.jobs);
        } else if (Array.isArray(data)) {
          setJobsList(data);
        } else {
          setJobsList([]);
        }
        setJobsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setJobsError(err.message);
        setJobsLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token]);

  // 3️⃣ Handle Add Job Form Submit
  const handleSubmitJob = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      package_lpa: parseFloat(formData.package_lpa),
      min_cgpa: parseFloat(formData.min_cgpa),
      max_backlogs: parseInt(formData.max_backlogs),
      allowed_departments: formData.allowed_departments
        .split(",")
        .map((d) => d.trim()),
    };

    try {
      const res = await fetch("http://192.168.137.97:3000/api/company/jobs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add job");
      }

      alert("✅ Job added successfully!");
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        location: "",
        package_lpa: "",
        tier: "TIER_2",
        min_cgpa: "",
        allowed_departments: "",
        max_backlogs: "",
        application_deadline: "",
      });

      fetchJobs(); // Refresh the jobs list
    } catch (err) {
      console.error("Error adding job:", err);
      alert("❌ Error: " + err.message);
    }
  };

  // 4️⃣ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  // --- Loading/Error states ---
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading company data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          No company data found
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">{companyData.company_name}</h2>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Job
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Company Info */}
      <div className="card shadow-sm p-4 mb-4">
        <p><strong>Email:</strong> {companyData.email}</p>
        <p>
          <strong>Website:</strong>{" "}
          <a
            href={companyData.website_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {companyData.website_url}
          </a>
        </p>
        <p><strong>Contact:</strong> {companyData.contact}</p>
        <p><strong>HR Contact:</strong> {companyData.hr_contact}</p>
        <p><strong>Description:</strong> {companyData.description}</p>
      </div>

      {/* Jobs List */}
      <div className="card shadow-sm p-4">
        <h4 className="fw-bold mb-3">Jobs Posted</h4>
        {jobsLoading && (
          <div className="d-flex justify-content-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading jobs...</span>
            </div>
            <span className="ms-2">Loading jobs...</span>
          </div>
        )}
        {jobsError && (
          <div className="alert alert-danger" role="alert">
            Error loading jobs: {jobsError}
          </div>
        )}
        {!jobsLoading && jobsList.length === 0 && (
          <div className="alert alert-info" role="alert">
            No jobs posted yet. Click the "Add Job" button to create your first job posting.
          </div>
        )}

        <div className="row">
          {jobsList.map((job) => (
            <div key={job.id} className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <p className="card-text">{job.description}</p>
                  <div className="mb-2">
                    <span className="badge bg-primary me-1">{job.location}</span>
                    <span className="badge bg-secondary me-1">{job.package_lpa} LPA</span>
                    <span className="badge bg-info text-dark">{job.status}</span>
                  </div>
                  <p className="card-text">
                    <small className="text-muted">
                      Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                    </small>
                  </p>
                  <button className="btn btn-primary btn-sm">View Applicants</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Job Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Job</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitJob}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Job Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Job Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Package (LPA)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.package_lpa}
                        onChange={(e) => setFormData({ ...formData, package_lpa: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Tier</label>
                      <select
                        className="form-control"
                        value={formData.tier}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                      >
                        <option value="TIER_1">TIER 1</option>
                        <option value="TIER_2">TIER 2</option>
                        <option value="TIER_3">TIER 3</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Minimum CGPA</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={formData.min_cgpa}
                        onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Allowed Departments (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.allowed_departments}
                        onChange={(e) => setFormData({ ...formData, allowed_departments: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Max Backlogs</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.max_backlogs}
                        onChange={(e) => setFormData({ ...formData, max_backlogs: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Application Deadline</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.application_deadline}
                      onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Job
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyDashboard;