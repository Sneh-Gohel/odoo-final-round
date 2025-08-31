import { useEffect, useState } from "react";

function CompanyDashboard() {
  const [companyData, setCompanyData] = useState(null);
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobsError, setJobsError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
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

  const token = localStorage.getItem("jwtToken");

  // Fetch company profile
  useEffect(() => {
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    fetch("http://192.168.137.97:3000/api/company/dashboard", {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
      })
      .then((data) => {
        setCompanyData(Array.isArray(data) && data.length ? data[0] : data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  // Fetch jobs
  const fetchJobs = () => {
    if (!token) {
      setJobsError("No authentication token found");
      setJobsLoading(false);
      return;
    }

    setJobsLoading(true);
    fetch("http://192.168.137.97:3000/api/jobs", {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
      })
      .then((data) => {
        setJobsList(data.jobs || (Array.isArray(data) ? data : []));
        setJobsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setJobsError(err.message);
        setJobsLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      fetchJobs();
      const storedJobId = localStorage.getItem("selectedJobId");
      if (storedJobId) setSelectedJobId(storedJobId);
    }
  }, [token]);

  // Add Job
  const handleSubmitJob = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      package_lpa: parseFloat(formData.package_lpa),
      min_cgpa: parseFloat(formData.min_cgpa),
      max_backlogs: parseInt(formData.max_backlogs),
      allowed_departments: formData.allowed_departments.split(",").map((d) => d.trim()),
    };

    try {
      const res = await fetch("http://192.168.137.97:3000/api/company/jobs/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add job");

      alert("✅ Job added successfully!");
      setShowModal(false);
      setFormData({
        title: "", description: "", location: "", package_lpa: "", tier: "TIER_2",
        min_cgpa: "", allowed_departments: "", max_backlogs: "", application_deadline: "",
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("selectedJobId");
    window.location.href = "/login";
  };

  // View Applicants
  const handleViewApplicants = (jobId) => {
    localStorage.setItem("selectedJobId", jobId);
    setSelectedJobId(jobId);
    window.location.href = `http://localhost:5173/company/dashboard/viewapplicant/${jobId}`;
  };

  // Clear selected job
  const clearSelectedJob = () => {
    localStorage.removeItem("selectedJobId");
    setSelectedJobId(null);
  };

  // --- Loading/Error states ---
  if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-4">Error: {error}</div>;
  if (!companyData) return <div className="alert alert-warning m-4">No company data found</div>;

  return (
    <div className="company-dashboard">
      {/* Header */}
      <div className="dashboard-header py-4 px-4 text-white d-flex justify-content-between align-items-center">
        <div>
          <h1>{companyData.company_name}</h1>
          <p>Company Dashboard</p>
        </div>
        <div>
          <button className="btn btn-light me-2" onClick={() => setShowModal(true)}>Add Job</button>
          <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">
        {/* Selected Job Indicator */}
        {selectedJobId && (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>Currently viewing applicants for Job ID: <strong>{selectedJobId}</strong></span>
            <button className="btn btn-sm btn-outline-info" onClick={clearSelectedJob}>Clear Selection</button>
          </div>
        )}

        <div className="row">
          {/* Company Info */}
          <div className="col-xl-4 col-lg-5 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-white"><h5>Company Information</h5></div>
              <div className="card-body">
                <p>Email: {companyData.email}</p>
                <p>Website: <a href={companyData.website_url} target="_blank" rel="noreferrer">{companyData.website_url}</a></p>
                <p>Contact: {companyData.contact}</p>
                <p>HR Contact: {companyData.hr_contact}</p>
                <p>Description: {companyData.description}</p>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="col-xl-8 col-lg-7">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5>Jobs Posted</h5>
                <span className="badge bg-primary">{jobsList.length} jobs</span>
              </div>
              <div className="card-body">
                {jobsLoading && <div className="text-center">Loading jobs...</div>}
                {jobsError && <div className="alert alert-danger">Error: {jobsError}</div>}
                {!jobsLoading && jobsList.length === 0 && <div className="text-center">No jobs posted yet.</div>}

                {!jobsLoading && jobsList.length > 0 && (
                  <div className="row">
                    {jobsList.map((job) => (
                      <div key={job.id} className="col-md-6 mb-4">
                        <div className={`card p-3 ${selectedJobId === job.id.toString() ? 'border-primary' : ''}`}>
                          <h6>{job.title}</h6>
                          <p>{job.description}</p>
                          <p>{job.location} | {job.package_lpa} LPA</p>
                          <p>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</p>
                          <button
  className="btn btn-outline-primary w-100"
  onClick={() => {
    localStorage.setItem("selectedJobId", job.id);
    window.location.href = `http://localhost:5173/company/dashboard/viewapplicant/`;
  }}
>
  View Applicants
</button>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Job Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5>Add New Job</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitJob}>
                  <div className="mb-3">
                    <label>Job Title</label>
                    <input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required/>
                  </div>
                  <div className="mb-3">
                    <label>Location</label>
                    <input type="text" className="form-control" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required/>
                  </div>
                  <div className="mb-3">
                    <label>Description</label>
                    <textarea className="form-control" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required/>
                  </div>
                  <div className="mb-3">
                    <label>Package (LPA)</label>
                    <input type="number" step="0.1" className="form-control" value={formData.package_lpa} onChange={(e) => setFormData({...formData, package_lpa: e.target.value})} required/>
                  </div>
                  <div className="mb-3 d-flex gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Job</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .company-dashboard { background-color: #f8f9fa; min-height: 100vh; }
        .dashboard-header { background: linear-gradient(135deg,#4e54c8 0%,#8f94fb 100%); }
        .card { border-radius: 0.5rem; }
      `}</style>
    </div>
  );
}

export default CompanyDashboard;
