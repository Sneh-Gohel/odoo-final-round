import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StudentReg from "./student/StudentReg.jsx";
import TpoReg from "./tpo/TpoReg.jsx";
import CompanyReg from "./company/CompanyReg.jsx";
import Login from "./Login.jsx";
import StudentDashboard from "./student/StudentDashboard.jsx";
import RedirectToLogin from "./RedirectToLogin.jsx";
import StudentJob from "./student/StudentJob.jsx";
import CompanyDashboard from "./company/CompanyDashboard.jsx";
import Resume from "./student/Resume.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectToLogin />} />
        <Route path="/student/register" element={<StudentReg />} />
        <Route path="/login" element={<Login />} />
        <Route path="/company/register" element={<CompanyReg />} /> 
        <Route path="/tpo/register" element={<TpoReg />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/dashboard/job" element={<StudentJob />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/student/dashboard/resume" element={<Resume />} />

        {/* Catch all undefined routes and redirect to login */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
