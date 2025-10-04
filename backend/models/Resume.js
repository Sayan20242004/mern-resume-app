const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    resumeId: { type: String, unique: true },
    title: { type: String, default: "Untitled Resume" },  // user-entered
    sections: {
      personalDetails: {
        name: String,
        email: String,
        phone: String,
        dob: String,
        address: String,
        linkedin: String,
        github: String,
      },
      education: [
        {
          course: String,
          university: String,
          college: String,
          cgpa: String,
          tenthMarks: String,
          twelfthMarks: String,
          yearOfGraduation: String,
        },
      ],
      experience: [
        { companyName: String, role: String, years: String, description: String },
      ],
      skills: [{ skillName: String }],
      projects: [{ title: String, description: String, link: String }],
      certifications: [{ title: String, issuingOrganization: String, link: String }],
      achievements: [{ title: String, description: String }],
      titleLinks: { headline: String, links: [String] },
    },
    generatedResume: { type: String },
    isVisible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);
