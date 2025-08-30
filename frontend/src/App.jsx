import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentReg from "./student/StudentReg.jsx";
import TpoReg from "./tpo/TpoReg.jsx";
import CompanyReg from "./company/CompanyReg.jsx";
import Login from "./Login.jsx";
import StudentDashboard from "./student/StudentDashboard.jsx";
function App() {
  return (

    <Router>
      <Routes>
        <Route path="/student/register" element={<StudentReg />} />
        <Route path="/login" element={<Login />} />
        <Route path="/company/register" element={<CompanyReg />} /> 
        <Route path="/tpo/register" element={<TpoReg />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;