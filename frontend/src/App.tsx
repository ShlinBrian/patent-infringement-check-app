import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import SavedReportsPage from "./components/SavedReportsPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/saved-reports" element={<SavedReportsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
