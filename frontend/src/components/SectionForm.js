import React, { useState, useEffect } from "react";
import { updateResume, getResume } from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css"; // import the CSS

const SectionForm = () => {
  const { resumeId, sectionName } = useParams();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  const getDefaultEntry = (section) => {
    switch (section.toLowerCase()) {
      case "title":
        return { title: "" };
      case "personal-details":
        return { name: "", email: "", phone: "", dob: "", address: "", linkedin: "", github: "" };
      case "education":
        return { course: "", university: "", college: "", cgpa: "", tenthMarks: "", twelfthMarks: "", yearOfGraduation: "" };
      case "experience":
        return { companyName: "", role: "", years: "", description: "" };
      case "skills":
        return { skillName: "" };
      case "projects":
        return { title: "", description: "", link: "" };
      case "certifications":
        return { title: "", issuingOrganization: "", link: "" };
      case "achievements":
        return { title: "", description: "" };
      case "title-links":
        return { headline: "", links: "" };
      default:
        return { text: "" };
    }
  };

  useEffect(() => {
    const fetchResume = async () => {
      const { data } = await getResume(resumeId);
      const sectionData = data.sections[sectionName] || [];
      if (sectionName === "title") setEntries([{ title: data.title || "" }]);
      else if (Array.isArray(sectionData) && sectionData.length > 0) setEntries(sectionData);
      else if (typeof sectionData === "object" && Object.keys(sectionData).length > 0) setEntries([sectionData]);
      else setEntries([getDefaultEntry(sectionName)]);
    };
    fetchResume();
  }, [resumeId, sectionName]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const handleAdd = () => setEntries([...entries, getDefaultEntry(sectionName)]);
  const handleRemove = (index) => setEntries(entries.filter((_, i) => i !== index));

  const validateEntries = () => entries.every((entry) => Object.values(entry).every((val) => val !== ""));

  const handleSubmit = async () => {
    if (!validateEntries()) {
      alert("Please fill all fields before saving.");
      return;
    }
    await updateResume(resumeId, {
      sectionName: sectionName === "title" ? "title" : sectionName,
      sectionData: sectionName === "title" ? entries[0] : entries.length === 1 ? entries[0] : entries,
    });
    alert(`${sectionName.replace(/-/g, " ")} saved successfully!`);
    navigate(`/resume/${resumeId}`);
  };

  return (
    <div className="section-container">
      <h2 className="section-heading">Edit {sectionName.replace(/-/g, " ")}</h2>
      {entries.map((entry, index) => (
        <div key={index} className="entry-card">
          {entries.length > 1 && (
            <button className="remove-btn" onClick={() => handleRemove(index)}>✕</button>
          )}
          {Object.keys(entry).map((field) => (
            <div key={field} className="input-group">
              <label className="input-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </label>
              <input
                type="text"
                value={entry[field]}
                onChange={(e) => handleChange(index, field, e.target.value)}
                className="text-input"
              />
            </div>
          ))}
        </div>
      ))}

      {["education", "experience", "projects", "certifications", "achievements", "skills"].includes(sectionName.toLowerCase()) && (
        <button className="add-btn" onClick={handleAdd}>+ Add Another</button>
      )}

      <button className="submit-btn" onClick={handleSubmit}>Done</button>
    </div>
  );
};

export default SectionForm;
