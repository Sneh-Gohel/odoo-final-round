// File Path: src/pages/TpoTest.jsx

import { useState, useEffect } from "react";
import TpoNav from "../components/TpoNav";

function TpoTest() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [purpose, setPurpose] = useState("PREPARATION");
  const [jobId, setJobId] = useState("");

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([{ text: "", is_correct: false }]);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetch("http://192.168.137.97:3000/api/tests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTests(data))
      .catch((err) => console.error(err));
  }, [token]);

  const createTest = async () => {
    if (!title || !duration) {
      setMessage("Title and Duration are required!");
      return;
    }
    const body = { title, duration_minutes: parseInt(duration), purpose };
    if (purpose === "EVALUATION" && jobId) body.jobId = parseInt(jobId);

    const res = await fetch("http://192.168.137.97:3000/api/tests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "Failed to create test.");
      return;
    }

    const newTest = {
      id: data.testId,
      title,
      duration_minutes: parseInt(duration),
      purpose,
      questions: [],
    };

    setTests([...tests, newTest]);
    setSelectedTest(newTest);

    setTitle("");
    setDuration("");
    setJobId("");
    setMessage("Test created! Add questions below.");
  };

  const addQuestion = async () => {
    const filteredOptions = options.filter((o) => o.text.trim() !== "");
    if (!questionText || filteredOptions.length < 2) {
      setMessage("Please provide question text and at least two options.");
      return;
    }

    const body = { question_text: questionText, options: filteredOptions };

    const res = await fetch(
      `http://192.168.137.97:3000/api/tests/${selectedTest.id}/questions/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || "Failed to add question.");
      return;
    }

    const updatedTests = tests.map((t) =>
      t.id === selectedTest.id ? { ...t, questions: [...(t.questions || []), body] } : t
    );
    setTests(updatedTests);
    setSelectedTest({ ...selectedTest, questions: [...selectedTest.questions, body] });

    setQuestionText("");
    setOptions([{ text: "", is_correct: false }]);
    setMessage("Question added successfully!");
  };

  const addOptionField = () => setOptions([...options, { text: "", is_correct: false }]);
  const removeOptionField = (index) => {
    const newOpts = options.filter((_, i) => i !== index);
    setOptions(newOpts.length ? newOpts : [{ text: "", is_correct: false }]);
  };

  return (
    <>
      <TpoNav />
      <div className="container py-5">
        <h3 className="mb-4 text-primary text-center">TPO Test Management</h3>

        {message && (
          <div className="alert alert-info text-center shadow-sm">{message}</div>
        )}

        {/* Create Test */}
        <div className="card shadow-sm p-4 mb-4 bg-light rounded">
          <h5 className="mb-3 text-secondary">Create Test</h5>
          <div className="row g-2">
            <div className="col-md-6">
              <input
                className="form-control form-control-lg"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control form-control-lg"
                type="number"
                placeholder="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-select-lg"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                <option value="PREPARATION">Preparation</option>
                <option value="EVALUATION">Evaluation</option>
              </select>
            </div>
          </div>
          {purpose === "EVALUATION" && (
            <input
              className="form-control form-control-lg mt-3"
              type="number"
              placeholder="Job ID"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            />
          )}
          <button className="btn btn-primary btn-lg mt-3 w-100 shadow-sm" onClick={createTest}>
            Create Test
          </button>
        </div>

        {/* List Tests */}
        {tests.map((test) => (
          <div key={test.id} className="card shadow-sm p-4 mb-4 bg-white rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">{test.title}</h6>
              <span className="badge bg-info text-dark">
                {test.duration_minutes} min | {test.purpose}
              </span>
            </div>
            <button
              className="btn btn-outline-primary btn-sm mb-3"
              onClick={() => setSelectedTest(test)}
            >
              Add Question
            </button>

            {selectedTest?.id === test.id && (
              <div className="mb-3">
                <textarea
                  className="form-control mb-3 form-control-lg shadow-sm"
                  placeholder="Question Text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
                {options.map((opt, i) => (
                  <div key={i} className="mb-2 d-flex align-items-center gap-2">
                    <input
                      className="form-control"
                      placeholder={`Option ${i + 1}`}
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[i].text = e.target.value;
                        setOptions(newOpts);
                      }}
                    />
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={opt.is_correct}
                        onChange={(e) => {
                          const newOpts = [...options];
                          newOpts[i].is_correct = e.target.checked;
                          setOptions(newOpts);
                        }}
                      />
                      <label className="form-check-label">Correct</label>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeOptionField(i)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="d-flex gap-2 mb-3">
                  <button className="btn btn-sm btn-outline-secondary" onClick={addOptionField}>
                    Add Option
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={addQuestion}>
                    Add Question
                  </button>
                </div>
              </div>
            )}

            {test.questions?.length > 0 && (
              <ul className="list-group">
                {test.questions.map((q, i) => (
                  <li key={i} className="list-group-item shadow-sm">
                    {q.question_text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default TpoTest;
