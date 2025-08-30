import { useState } from "react";
import StudentNav from "../components/StudentNav";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Resume() {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      github: "",
    },
    education: [
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
      },
    ],
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    skills: [],
    projects: [
      {
        name: "",
        description: "",
        technologies: "",
      },
    ],
    certifications: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      const updatedArray = [...resumeData[section]];
      updatedArray[index][field] = value;
      setResumeData({
        ...resumeData,
        [section]: updatedArray,
      });
    } else {
      setResumeData({
        ...resumeData,
        [section]: {
          ...resumeData[section],
          [field]: value,
        },
      });
    }
  };

  const addItem = (section, template) => {
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], template],
    });
  };

  const removeItem = (section, index) => {
    const updatedArray = [...resumeData[section]];
    updatedArray.splice(index, 1);
    setResumeData({
      ...resumeData,
      [section]: updatedArray,
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills.splice(index, 1);
    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    });
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setResumeData({
        ...resumeData,
        certifications: [...resumeData.certifications, newCertification.trim()],
      });
      setNewCertification("");
    }
  };

  const removeCertification = (index) => {
    const updatedCerts = [...resumeData.certifications];
    updatedCerts.splice(index, 1);
    setResumeData({
      ...resumeData,
      certifications: updatedCerts,
    });
  };

  const generatePDF = () => {
    const input = document.getElementById("resume-template");
    
    html2canvas(input, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resumeData.personalInfo.fullName || "resume"}.pdf`);
    });
  };

  return (
    <div>
      <StudentNav />
      <div className="container-fluid py-4">
        <div className="row">
          {/* Resume Form */}
          <div className="col-lg-5">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Resume Builder</h5>
              </div>
              <div className="card-body">
                {/* Personal Information */}
                <div className="mb-4">
                  <h6 className="border-bottom pb-2">Personal Information</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) =>
                          handleInputChange("personalInfo", "fullName", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          handleInputChange("personalInfo", "email", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          handleInputChange("personalInfo", "phone", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={resumeData.personalInfo.address}
                        onChange={(e) =>
                          handleInputChange("personalInfo", "address", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">LinkedIn</label>
                      <input
                        type="url"
                        className="form-control"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          handleInputChange("personalInfo", "linkedin", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">GitHub</label>
                      <input
                        type="url"
                        className="form-control"
                        value={resumeData.personalInfo.github}
                        onChange={(e) =>
                          handleInputChange("personalInfo", "github", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="border-bottom pb-2">Education</h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        addItem("education", {
                          institution: "",
                          degree: "",
                          field: "",
                          startDate: "",
                          endDate: "",
                          gpa: "",
                        })
                      }
                    >
                      + Add Education
                    </button>
                  </div>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="card-title mb-0">Education #{index + 1}</h6>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => removeItem("education", index)}
                          ></button>
                        </div>
                        <div className="row">
                          <div className="col-12 mb-2">
                            <label className="form-label">Institution</label>
                            <input
                              type="text"
                              className="form-control"
                              value={edu.institution}
                              onChange={(e) =>
                                handleInputChange("education", "institution", e.target.value, index)
                              }
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <label className="form-label">Degree</label>
                            <input
                              type="text"
                              className="form-control"
                              value={edu.degree}
                              onChange={(e) =>
                                handleInputChange("education", "degree", e.target.value, index)
                              }
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <label className="form-label">Field of Study</label>
                            <input
                              type="text"
                              className="form-control"
                              value={edu.field}
                              onChange={(e) =>
                                handleInputChange("education", "field", e.target.value, index)
                              }
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <label className="form-label">Start Date</label>
                            <input
                              type="month"
                              className="form-control"
                              value={edu.startDate}
                              onChange={(e) =>
                                handleInputChange("education", "startDate", e.target.value, index)
                              }
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <label className="form-label">End Date</label>
                            <input
                              type="month"
                              className="form-control"
                              value={edu.endDate}
                              onChange={(e) =>
                                handleInputChange("education", "endDate", e.target.value, index)
                              }
                            />
                          </div>
                          <div className="col-12 mb-2">
                            <label className="form-label">GPA</label>
                            <input
                              type="text"
                              className="form-control"
                              value={edu.gpa}
                              onChange={(e) =>
                                handleInputChange("education", "gpa", e.target.value, index)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="border-bottom pb-2">Work Experience</h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        addItem("experience", {
                          company: "",
                          position: "",
                          startDate: "",
                          endDate: "",
                          description: "",
                        })
                      }
                    >
                      + Add Experience
                    </button>
                  </div>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="card-title mb-0">Experience #{index + 1}</h6>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => removeItem("experience", index)}
                          ></button>
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <label className="form-label">Company</label>
                            <input
                              type="text"
                              className="form-control"
                              value={exp.company}
                              onChange={(e) =>
                                handleInputChange("experience", "company", e.target.value, index)
                              }
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <label className="form-label">Position</label>
                            <input
                              type="text"
                              className="form-control"
                              value={exp.position}
                              onChange={(e) =>
                                handleInputChange("experience", "position", e.target.value, index)
                              }
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <label className="form-label">Start Date</label>
                            <input
                              type="month"
                              className="form-control"
                              value={exp.startDate}
                              onChange={(e) =>
                                handleInputChange("experience", "startDate", e.target.value, index)
                              }
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <label className="form-label">End Date</label>
                            <input
                              type="month"
                              className="form-control"
                              value={exp.endDate}
                              onChange={(e) =>
                                handleInputChange("experience", "endDate", e.target.value, index)
                              }
                            />
                          </div>
                          <div className="col-12 mb-2">
                            <label className="form-label">Description</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={exp.description}
                              onChange={(e) =>
                                handleInputChange("experience", "description", e.target.value, index)
                              }
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h6 className="border-bottom pb-2">Skills</h6>
                  <div className="d-flex mb-3">
                    <input
                      type="text"
                      className="form-control me-2"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                    />
                    <button type="button" className="btn btn-primary" onClick={addSkill}>
                      Add
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span key={index} className="badge bg-primary d-flex align-items-center">
                        {skill}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => removeSkill(index)}
                          style={{ fontSize: "0.6rem" }}
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="border-bottom pb-2">Projects</h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        addItem("projects", {
                          name: "",
                          description: "",
                          technologies: "",
                        })
                      }
                    >
                      + Add Project
                    </button>
                  </div>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="card-title mb-0">Project #{index + 1}</h6>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => removeItem("projects", index)}
                          ></button>
                        </div>
                        <div className="row">
                          <div className="col-12 mb-2">
                            <label className="form-label">Project Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={project.name}
                              onChange={(e) =>
                                handleInputChange("projects", "name", e.target.value, index)
                              }
                            />
                          </div>
                          <div className="col-12 mb-2">
                            <label className="form-label">Description</label>
                            <textarea
                              className="form-control"
                              rows="2"
                              value={project.description}
                              onChange={(e) =>
                                handleInputChange("projects", "description", e.target.value, index)
                              }
                            ></textarea>
                          </div>
                          <div className="col-12 mb-2">
                            <label className="form-label">Technologies</label>
                            <input
                              type="text"
                              className="form-control"
                              value={project.technologies}
                              onChange={(e) =>
                                handleInputChange("projects", "technologies", e.target.value, index)
                              }
                              placeholder="HTML, CSS, JavaScript, React, etc."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="mb-4">
                  <h6 className="border-bottom pb-2">Certifications</h6>
                  <div className="d-flex mb-3">
                    <input
                      type="text"
                      className="form-control me-2"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add a certification"
                    />
                    <button type="button" className="btn btn-primary" onClick={addCertification}>
                      Add
                    </button>
                  </div>
                  <ul className="list-group">
                    {resumeData.certifications.map((cert, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {cert}
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => removeCertification(index)}
                        ></button>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="btn btn-success w-100" onClick={generatePDF}>
                  Generate & Download Resume
                </button>
              </div>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="col-lg-7">
            <div className="sticky-top" style={{ top: "20px" }}>
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Resume Preview</h5>
                </div>
                <div className="card-body">
                  <div id="resume-template" className="resume-template">
                    <div className="resume-header">
                      <h1>{resumeData.personalInfo.fullName || "Your Name"}</h1>
                      <div className="contact-info">
                        {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                        {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                        {resumeData.personalInfo.address && <span>{resumeData.personalInfo.address}</span>}
                        {resumeData.personalInfo.linkedin && (
                          <span>
                            <a href={resumeData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                              LinkedIn
                            </a>
                          </span>
                        )}
                        {resumeData.personalInfo.github && (
                          <span>
                            <a href={resumeData.personalInfo.github} target="_blank" rel="noopener noreferrer">
                              GitHub
                            </a>
                          </span>
                        )}
                      </div>
                    </div>

                    {resumeData.education.some(edu => edu.institution) && (
                      <div className="resume-section">
                        <h2>Education</h2>
                        {resumeData.education.map((edu, index) => (
                          edu.institution && (
                            <div key={index} className="education-item">
                              <h3>{edu.institution}</h3>
                              <p>
                                {edu.degree} {edu.field && `in ${edu.field}`}
                                {(edu.startDate || edu.endDate) && ` | ${edu.startDate} - ${edu.endDate}`}
                                {edu.gpa && ` | GPA: ${edu.gpa}`}
                              </p>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {resumeData.experience.some(exp => exp.company) && (
                      <div className="resume-section">
                        <h2>Experience</h2>
                        {resumeData.experience.map((exp, index) => (
                          exp.company && (
                            <div key={index} className="experience-item">
                              <h3>{exp.position} at {exp.company}</h3>
                              <p>
                                {exp.startDate} - {exp.endDate || "Present"}
                              </p>
                              {exp.description && <p>{exp.description}</p>}
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {resumeData.skills.length > 0 && (
                      <div className="resume-section">
                        <h2>Skills</h2>
                        <div className="skills">
                          {resumeData.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.projects.some(proj => proj.name) && (
                      <div className="resume-section">
                        <h2>Projects</h2>
                        {resumeData.projects.map((project, index) => (
                          project.name && (
                            <div key={index} className="project-item">
                              <h3>{project.name}</h3>
                              {project.technologies && (
                                <p className="technologies">
                                  <strong>Technologies:</strong> {project.technologies}
                                </p>
                              )}
                              {project.description && <p>{project.description}</p>}
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {resumeData.certifications.length > 0 && (
                      <div className="resume-section">
                        <h2>Certifications</h2>
                        <ul>
                          {resumeData.certifications.map((cert, index) => (
                            <li key={index}>{cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .resume-template {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          color: #333;
          padding: 20px;
          background: white;
        }
        
        .resume-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #2c3e50;
          padding-bottom: 15px;
        }
        
        .resume-header h1 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #2c3e50;
        }
        
        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 15px;
          font-size: 14px;
        }
        
        .contact-info span {
          display: flex;
          align-items: center;
        }
        
        .contact-info a {
          color: #2c3e50;
          text-decoration: none;
        }
        
        .resume-section {
          margin-bottom: 20px;
        }
        
        .resume-section h2 {
          font-size: 18px;
          color: #2c3e50;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        
        .education-item, .experience-item, .project-item {
          margin-bottom: 15px;
        }
        
        .education-item h3, .experience-item h3, .project-item h3 {
          font-size: 16px;
          margin-bottom: 5px;
          color: #34495e;
        }
        
        .education-item p, .experience-item p, .project-item p {
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .skill-tag {
          background: #ecf0f1;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
        }
        
        .technologies {
          font-style: italic;
        }
        
        .resume-section ul {
          padding-left: 20px;
        }
        
        .resume-section li {
          margin-bottom: 5px;
        }
        
        @media (max-width: 992px) {
          .resume-template {
            padding: 15px;
          }
          
          .contact-info {
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
}

export default Resume;