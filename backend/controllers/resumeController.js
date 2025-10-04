const Resume = require("../models/Resume");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

// Create new resume with initialized sections
exports.createResume = async (req, res) => {
  try {
    const resume = new Resume({
      resumeId: uuidv4(),
      sections: {
        personalDetails: {
          name: "",
          email: "",
          phone: "",
          dob: "",
          address: "",
          linkedin: "",
          github: "",
        },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        titleLinks: { headline: "", links: [] },
      },
    });
    await resume.save();
    res.json(resume);
  } catch (err) {
    console.error("createResume error", err);
    res.status(500).json({ error: "Failed to create resume" });
  }
};

// Get all resumes (only visible ones)
exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ isVisible: true }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err) {
    console.error("getAllResumes error", err);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
};

// Get a single resume
exports.getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ resumeId });
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json(resume);
  } catch (err) {
    console.error("getResume error", err);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};

// Update resume section or title
exports.updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { sectionName, sectionData } = req.body;

    const resume = await Resume.findOne({ resumeId });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    if (sectionName === "title") {
      resume.title = sectionData.title;
    } else if (sectionName === "personal-details") {
      resume.sections.personalDetails = sectionData;
    } else {
      resume.sections[sectionName] = sectionData;
    }

    await resume.save();
    res.json(resume);
  } catch (err) {
    console.error("updateResume error", err);
    res.status(500).json({ error: "Failed to update resume" });
  }
};

// Generate AI resume and mark visible
exports.generateResumeAI = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ resumeId });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    // Check if title is filled
    if (!resume.title || resume.title.trim() === "") {
      return res.status(400).json({ error: "Please fill in Title before generating resume" });
    }

    const inputData = {
      title: resume.title,
      personalDetails: resume.sections.personalDetails,
      education: resume.sections.education,
      skills: resume.sections.skills,
      projects: resume.sections.projects,
      certifications: resume.sections.certifications,
      experience: resume.sections.experience,
      achievements: resume.sections.achievements,
      titleLinks: resume.sections.titleLinks,
    };

    const prompt = `
You are an assistant that generates professional, ATS-friendly resumes in HTML format.
Use the following JSON data and produce only clean HTML:
${JSON.stringify(inputData, null, 2)}
`;

    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You generate clean, ATS-friendly HTML resumes only." },
          { role: "user", content: prompt },
        ],
        max_tokens: 3000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const aiHtml = aiResponse.data?.choices?.[0]?.message?.content || "";

    resume.generatedResume = aiHtml;
    resume.isVisible = true; // mark visible
    await resume.save();

    res.json({ generatedResume: aiHtml });
  } catch (err) {
    console.error("generateResume error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate resume" });
  }
};
