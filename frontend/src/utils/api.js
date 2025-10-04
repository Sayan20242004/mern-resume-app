import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" }); // backend URL

export const createResume = (data) => API.post("/resumes", data); // no userId needed
export const getAllResumes = () => API.get("/resumes"); // fetch all resumes
export const getResume = (resumeId) => API.get(`/resumes/${resumeId}`);
export const updateResume = (resumeId, data) => API.put(`/resumes/${resumeId}`, data);
export const generateResume = (resumeId) => API.post(`/resumes/${resumeId}/generate`);
