import React, { useEffect, useState } from "react";
import { getResume, generateResume } from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "../App.css"; // import the CSS

const sections = [
  "Title",
  "Personal Details",
  "Education",
  "Experience",
  "Skills",
  "Projects",
  "Certifications",
  "Achievements",
  "Title & Links",
];

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResume();
  }, [resumeId]);

  const fetchResume = async () => {
    const { data } = await getResume(resumeId);
    setResume(data);
  };

  const handleDownload = async () => {
    const sectionKeys = Object.keys(resume.sections);
    for (const key of sectionKeys) {
      const sec = resume.sections[key];
      if (Array.isArray(sec)) {
        if (sec.length === 0 || sec.some((entry) => Object.values(entry).some((v) => !v || v.trim() === ""))) {
          alert(`Please fill all fields in ${key}`);
          return;
        }
      } else if (typeof sec === "object") {
        if (Object.values(sec).some((v) => !v || v.trim() === "")) {
          alert(`Please fill all fields in ${key}`);
          return;
        }
      }
    }

    try {
      const { data } = await generateResume(resumeId);
      const element = document.createElement("div");
      element.innerHTML = data.generatedResume;
      document.body.appendChild(element);

      html2pdf()
        .from(element)
        .set({
          margin: 0.5,
          filename: `${resume.title || "MyResume"}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save();

      document.body.removeChild(element);
      alert("Resume downloaded as PDF!");
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download resume");
    }
  };

  if (!resume) return <p className="loading-text">Loading...</p>;

  return (
    <div className="resume-builder-container">
      <h2 className="resume-title">{resume.title || "Untitled Resume"}</h2>
      <button className="download-btn" onClick={handleDownload}>
        Download Resume
      </button>

      <div className="sections-list">
        {sections.map((section) => (
          <a
            key={section}
            href={`/resume/${resumeId}/section/${section.toLowerCase().replace(/ /g, "-")}`}
            className="section-link"
          >
            {section}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResumeBuilder;
