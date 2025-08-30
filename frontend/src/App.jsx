import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentReg from "./student/StudentReg.jsx";
import TpoReg from "./tpo/TpoReg.jsx";
import CompanyReg from "./company/CompanyReg.jsx";
import Login from "./Login.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/student/register" element={<StudentReg />} />
        <Route path="/login" element={<Login />} />
        <Route path="/company/register" element={<CompanyReg />} /> 
        <Route path="/tpo/register" element={<TpoReg />} />
      </Routes>
    </Router>
  );
}
export default App;