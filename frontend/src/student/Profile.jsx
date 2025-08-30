import { useState, useEffect } from "react";
import StudentNav from "../components/StudentNav";

function Profile() {
  const [profileData, setProfileData] = useState({
    full_name: "",
    enrollment_no: "",
    institute_name: "",
    branch: "",
    current_year: "",
    cgpa: "",
    skills: "",
    active_backlogs: "",
    default_resume_url: ""
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Get JWT token from localStorage
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setMessage({ type: "error", text: "No authentication token found. Please login." });
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://192.168.137.97:3000/api/student/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProfileData({
        full_name: data.full_name || "",
        enrollment_no: data.enrollment_no || "",
        institute_name: data.institute_name || "",
        branch: data.branch || "",
        current_year: data.current_year || "",
        cgpa: data.cgpa || "",
        skills: data.skills || "",
        active_backlogs: data.active_backlogs || "",
        default_resume_url: data.default_resume_url || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Failed to fetch profile data." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setMessage({ type: "error", text: "Please upload a PDF file only." });
        return;
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size should be less than 5MB." });
        return;
      }
      
      setResumeFile(file);
      setMessage({ type: "success", text: "File selected: " + file.name });
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) {
      setMessage({ type: "error", text: "Please select a file first." });
      return;
    }

    if (!token) {
      setMessage({ type: "error", text: "No authentication token found. Please login." });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await fetch("http://192.168.137.97:3000/api/student/resume/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage({ type: "success", text: "Resume uploaded successfully!" });
      
      // Update the resume URL in profile data
      if (data.fileUrl) {
        setProfileData(prev => ({
          ...prev,
          default_resume_url: data.fileUrl
        }));
      }
      
      // Clear the file input
      setResumeFile(null);
      document.getElementById("resumeFile").value = "";
      
    } catch (error) {
      console.error("Error uploading resume:", error);
      setMessage({ type: "error", text: "Failed to upload resume. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setMessage({ type: "error", text: "No authentication token found. Please login." });
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch("http://192.168.137.97:3000/api/student/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage({ type: "success", text: "Profile updated successfully!" });
      console.log("Profile updated:", data);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div>
        <StudentNav />
        <div className="container mt-4">
          <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StudentNav />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">Student Profile</h3>
                <p className="mb-0 small">Enrollment No: {profileData.enrollment_no}</p>
              </div>
              <div className="card-body">
                {message.text && (
                  <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`} role="alert">
                    {message.text}
                  </div>
                )}

                <div className="row">
                  <div className="col-md-8">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="full_name" className="form-label">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="full_name"
                            name="full_name"
                            value={profileData.full_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="enrollment_no" className="form-label">Enrollment Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="enrollment_no"
                            name="enrollment_no"
                            value={profileData.enrollment_no}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="institute_name" className="form-label">Institute Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="institute_name"
                            name="institute_name"
                            value={profileData.institute_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="branch" className="form-label">Branch</label>
                          <select
                            className="form-select"
                            id="branch"
                            name="branch"
                            value={profileData.branch}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Branch</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Electronics and Communication">Electronics and Communication</option>
                            <option value="Information Technology">Information Technology</option>
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="current_year" className="form-label">Current Year</label>
                          <select
                            className="form-select"
                            id="current_year"
                            name="current_year"
                            value={profileData.current_year}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="cgpa" className="form-label">CGPA</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            className="form-control"
                            id="cgpa"
                            name="cgpa"
                            value={profileData.cgpa}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="skills" className="form-label">Skills</label>
                          <textarea
                            className="form-control"
                            id="skills"
                            name="skills"
                            rows="3"
                            value={profileData.skills}
                            onChange={handleInputChange}
                            placeholder="List your skills separated by commas"
                            required
                          ></textarea>
                          <div className="form-text">Separate skills with commas (e.g., Java, Python, React)</div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="active_backlogs" className="form-label">Active Backlogs</label>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            id="active_backlogs"
                            name="active_backlogs"
                            value={profileData.active_backlogs}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="d-grid">
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={updating}
                        >
                          {updating ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Updating...
                            </>
                          ) : (
                            "Update Profile"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Resume Upload</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label htmlFor="resumeFile" className="form-label">Upload Resume (PDF only)</label>
                          <input
                            type="file"
                            className="form-control"
                            id="resumeFile"
                            accept=".pdf"
                            onChange={handleFileChange}
                          />
                          <div className="form-text">Max file size: 50MB</div>
                        </div>
                        
                        <button 
                          className="btn btn-success w-100"
                          onClick={uploadResume}
                          disabled={uploading || !resumeFile}
                        >
                          {uploading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Uploading...
                            </>
                          ) : (
                            "Upload Resume"
                          )}
                        </button>

                        {profileData.default_resume_url && (
                          <div className="mt-3">
                            <h6>Current Resume:</h6>
                            <a 
                              href={profileData.default_resume_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm w-100"
                            >
                              View Current Resume
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display current skills as badges */}
                {profileData.skills && (
                  <div className="mt-4">
                    <h5>Your Skills:</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {profileData.skills.split(',').map((skill, index) => (
                        skill.trim() && (
                          <span key={index} className="badge bg-primary">
                            {skill.trim()}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;