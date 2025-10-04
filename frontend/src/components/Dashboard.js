import React, { useEffect, useState } from "react";
import { getAllResumes, createResume } from "../utils/api";
import ResumeCard from "./ResumeCard";
import { useNavigate } from "react-router-dom";
import "../App.css"; // import the CSS

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await getAllResumes();
      // Ensure data is always an array
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      setResumes([]); // fallback to empty array
    }
  };

  const handleAddResume = async () => {
    try {
      const { data } = await createResume({ title: "Untitled Resume" });
      navigate(`/resume/${data.resumeId}`);
    } catch (err) {
      console.error("Failed to create resume:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">My Resumes</h1>
      <button className="add-resume-btn" onClick={handleAddResume}>
        + Add Resume
      </button>
      <div className="resume-cards-list">
        {Array.isArray(resumes) && resumes.length > 0 ? (
          resumes.map((resume) => (
            <ResumeCard key={resume.resumeId} resume={resume} />
          ))
        ) : (
          <p>No resumes found. Click "+ Add Resume" to create one.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
