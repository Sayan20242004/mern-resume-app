import React from "react";
import { useNavigate } from "react-router-dom";

const ResumeCard = ({ resume }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/resume/${resume.resumeId}`)} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", cursor: "pointer" }}>
      <h3>{resume.title || "Untitled Resume"}</h3>
      <p>Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ResumeCard;
