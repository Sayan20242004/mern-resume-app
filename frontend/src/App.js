import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ResumePage from "./pages/ResumePage";
import SectionPage from "./pages/SectionPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resume/:resumeId" element={<ResumePage />} />
      <Route
        path="/resume/:resumeId/section/:sectionName"
        element={<SectionPage />}
      />
    </Routes>
  </Router>
);

export default App;
