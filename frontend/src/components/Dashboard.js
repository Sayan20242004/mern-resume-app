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
    const { data } = await getAllResumes();
    setResumes(data);
  };

  const handleAddResume = async () => {
    const { data } = await createResume({ title: "Untitled Resume" });
    navigate(`/resume/${data.resumeId}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">My Resumes</h1>
      <button className="add-resume-btn" onClick={handleAddResume}>
        + Add Resume
      </button>
      <div className="resume-cards-list">
        {resumes.map((resume) => (
          <ResumeCard key={resume.resumeId} resume={resume} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
