import TpoNav from "../components/TpoNav";

function TpoDashboard() {
  // Manually set counts
  const studentsCount = 10;
  const companiesCount = 5;
  const testsCount = 0;

  return (
    <>
      <TpoNav />
      <div className="container py-4">
        <h3 className="mb-4 text-primary">TPO Dashboard</h3>

        <div className="row g-4">
          <div className="col-md-4">
            <div
              className="card text-white shadow-sm border-0 rounded-3 p-4 text-center"
              style={{ backgroundColor: "#1abc9c" }}
            >
              <h5>Students</h5>
              <p className="display-6">{studentsCount}</p>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card text-white shadow-sm border-0 rounded-3 p-4 text-center"
              style={{ backgroundColor: "#3498db" }}
            >
              <h5>Companies</h5>
              <p className="display-6">{companiesCount}</p>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card text-white shadow-sm border-0 rounded-3 p-4 text-center"
              style={{ backgroundColor: "#e74c3c" }}
            >
              <h5>Tests</h5>
              <p className="display-6">{testsCount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TpoDashboard;
