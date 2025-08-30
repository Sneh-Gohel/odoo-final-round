import { useState, useEffect } from "react";
import StudentNav from "../components/StudentNav";

function StudentJob() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    domain: "",
    package: "",
    location: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJyb2xlIjoiQ09NUEFOWSIsImVtYWlsIjoiamFja0BnYW1pbC5jb20iLCJpYXQiOjE3NTY1NTcxNTYsImV4cCI6MTc1NjY0MzU1Nn0.Sm1rUbDhV2KW7hwVnsNudmnO_HbVHrdjcBf6bRSZEbA"; 
    
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    fetchJobs(token);
  }, []);

  const fetchJobs = async (token) => {
    try {
      const response = await fetch("http://192.168.137.97:3000/api/jobs", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch jobs: ${response.status}`);

      const data = await response.json();
      const mappedJobs = data.map(job => ({
        id: job.id,
        company: "Company Name", // placeholder
        role: job.title,
        department: job.tier,
        salaryPackage: job.package_lpa,
        location: job.location,
        eligibility: "Check company website",
        status: job.status
      }));

      setJobs(mappedJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredJobs = jobs.filter(job => {
    const domainMatch = filters.domain === "" || job.department === filters.domain;
    
    // Convert numeric package ranges to match filter
    let packageMatch = true;
    if (filters.package !== "") {
      const [min, max] = filters.package.split("-").map(Number);
      const jobPackage = parseFloat(job.salaryPackage);
      if (max) packageMatch = jobPackage >= min && jobPackage <= max;
      else packageMatch = jobPackage >= min; // "20+" case
    }

    const locationMatch = filters.location === "" || job.location === filters.location;

    return domainMatch && packageMatch && locationMatch;
  });

  return (
    <div className="student-job-portal">
      <StudentNav />
      
      <div className="container-fluid px-4 py-4">
        <div className="row">
          {/* Sidebar Filters */}
          <div className="col-lg-3 mb-4">
            <div className="filter-card card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">Filter Jobs</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Domain</label>
                  <select 
                    className="form-select"
                    name="domain"
                    value={filters.domain}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Domains</option>
                    <option value="CS/IT">CS/IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Package (LPA)</label>
                  <select 
                    className="form-select"
                    name="package"
                    value={filters.package}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Package</option>
                    <option value="5-10">5-10 LPA</option>
                    <option value="10-15">10-15 LPA</option>
                    <option value="15-20">15-20 LPA</option>
                    <option value="20+">20+ LPA</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Location</label>
                  <select 
                    className="form-select"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Location</option>
                    <option value="Remote">Remote</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>
                
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setFilters({ domain: "", package: "", location: "" })}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Job Opportunities</h2>
              <span className="badge bg-primary">{filteredJobs.length} jobs found</span>
            </div>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading job opportunities...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-briefcase text-muted" viewBox="0 0 16 16">
                      <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                  </div>
                  <h5 className="card-title">No jobs found</h5>
                  <p className="card-text text-muted">Try adjusting your filters to find more opportunities.</p>
                </div>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {filteredJobs.map(job => (
                  <div key={job.id} className="col">
                    <div className="job-card card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="card-title mb-0">{job.role}</h5>
                            <p className="text-muted mb-0">{job.company}</p>
                          </div>
                          <span className="badge bg-success bg-opacity-10 text-success">{job.status}</span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt text-primary me-2" viewBox="0 0 16 16">
                              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            </svg>
                            <span>{job.location}</span>
                          </div>
                          
                          <div className="d-flex align-items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cash-coin text-primary me-2" viewBox="0 0 16 16">
                              <path d="M5.5 10.5A.5.5 0 0 1 6 10h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                              <path d="M8.5 4.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
                              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/>
                              <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/>
                            </svg>
                            <span>{job.salaryPackage} LPA</span>
                          </div>
                          
                          <div className="d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-building text-primary me-2" viewBox="0 0 16 16">
                              <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"/>
                              <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3V1z"/>
                            </svg>
                            <span>{job.department}</span>
                          </div>
                        </div>
                        
                        <div className="border-top pt-3 mt-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <button className="btn btn-primary">Apply Now</button>
                            <button className="btn btn-outline-secondary">
                              View Details
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right ms-1" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show position-fixed bottom-0 end-0 m-3" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <style jsx>{`
        .student-job-portal {
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        
        .filter-card {
          position: sticky;
          top: 20px;
        }
        
        .job-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default StudentJob;