import React, { useState } from "react";
import { InfringementReport } from "./types"; // Adjust the path as needed
import axios from "axios";
import Spinner from "./Spinner";
import SavedReportItem from "./SavedReportItem"; // Import the new component


const HomePage: React.FC = () => {
  const [patentId, setPatentId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [results, setResults] = useState<InfringementReport | null>(null);
  const [savedReports, setSavedReports] = useState<InfringementReport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingReports, setFetchingReports] = useState<boolean>(false); // Spinner for saved reports
  const [error, setError] = useState<string | null>(null);
  const [showSavedReports, setShowSavedReports] = useState<boolean>(false); // Toggle for Saved Reports

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/check-infringement", {
        patent_id: patentId,
        company_name: companyName,
      });
      setResults(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || "An unexpected error occurred.");
      } else {
        setError("Failed to fetch infringement results. Please try again.");
      }
      console.error("Error running patent check:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedReports = async () => {
    setFetchingReports(true);

    try {
      const response = await axios.get("http://localhost:8000/get-reports", {
        withCredentials: true,
      });
      setSavedReports(response.data);
    } catch (err: any) {
      console.error("Error fetching saved reports:", err); // Log the error silently
    } finally {
      setFetchingReports(false);
    }
  };

  const toggleSavedReports = () => {
    if (!showSavedReports) {
      // Fetch reports when the section is expanded
      fetchSavedReports();
    }
    setShowSavedReports(!showSavedReports);
  };

  const handleSaveReport = async () => {
    if (!results) return;

    try {
      await axios.post("http://localhost:8000/save-report", results, {
        withCredentials: true,
      });
      alert("Report saved successfully!");
    } catch (err: any) {
      console.error("Error saving report:", err);
      alert("Failed to save report.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center text-primary mb-4">Patent Infringement Checker</h1>

      {/* Infringement Check Form */}
      <form onSubmit={handleSubmit} className="card p-4 shadow mb-4">
        <div className="mb-3">
          <label className="form-label">Patent ID:</label>
          <input
            type="text"
            value={patentId}
            onChange={(e) => setPatentId(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Infringement"}
        </button>
      </form>

      {loading && <Spinner />} {/* Show spinner during loading */}

      {error && (
        <div className="alert alert-danger text-center mt-3">
          {error}
        </div>
      )}

      {results && (
        <div className="card p-4 shadow mt-4">
          <h2 className="card-title text-secondary">Infringement Results</h2>
          <p><strong>Patent ID:</strong> {results.patent_id}</p>
          <p><strong>Company Name:</strong> {results.company_name}</p>
          <p><strong>Overall Risk Assessment:</strong> {results.overall_risk_assessment}</p>
          <p><strong>Created Time:</strong> {new Date(results.create_time).toLocaleString()}</p>
          <h3 className="mt-4">Top Infringing Products</h3>
          {results.top_infringing_products?.map((product, index) => (
            <div key={index} className="border-top pt-3 mt-3">
              <h4 className="text-primary">{product.product_name}</h4>
              <p><strong>Likelihood:</strong> {product.infringement_likelihood}</p>
              <p><strong>Explanation:</strong> {product.explanation}</p>
              <p><strong>Relevant Claims:</strong> {product.relevant_claims.join(", ")}</p>
              <ul>
                {product.specific_features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
          <button className="btn btn-success mt-3" onClick={handleSaveReport}>
            Save This Report
          </button>
        </div>
      )}

      {/* Saved Reports Section */}
      <div className="card p-4 shadow mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="text-secondary">Saved Reports</h2>
          <button className="btn btn-secondary" onClick={toggleSavedReports}>
            {showSavedReports ? "Hide Saved Reports" : "Show Saved Reports"}
          </button>
        </div>

        {showSavedReports && (
          <div className="mt-3">
            {fetchingReports ? (
              <Spinner />
            ) : savedReports.length === 0 ? (
              <p>No saved reports found.</p>
            ) : (
              <ul className="list-group">
                {savedReports.map((report, index) => (
                  <SavedReportItem key={index} report={report} />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
