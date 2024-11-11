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

  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";; // Use the service name 'backend'
  console.log("API URL:", API_URL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/check-infringement`, {
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
      const response = await axios.get(`${API_URL}/get-reports`, {
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
      fetchSavedReports();
    }
    setShowSavedReports(!showSavedReports);
  };

  const handleSaveReport = async () => {
    if (!results) return;

    try {
      await axios.post(`${API_URL}/save-report`, results, {
        withCredentials: true,
      });
      alert("Report saved successfully!");
    } catch (err: any) {
      console.error("Error saving report:", err);
      alert("Failed to save report.");
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        color: "#FFFFFF",
        backgroundColor: "#000000",
        margin: "0",
        padding: "0",
        maxWidth: "100%",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-center mb-4" style={{ color: "#57DC2F" }}>
        Patent Infringement Checker
      </h1>

      {/* Infringement Check Form */}
      <form
        onSubmit={handleSubmit}
        className="card p-4 shadow mb-4"
        style={{ backgroundColor: "#121212", border: "1px solid #57DC2F", borderRadius: "10px" }}
      >
        <div className="mb-3">
          <label
            className="form-label"
            style={{
              color: "#57DC2F", // Updated to match the theme
              fontWeight: "bold",
            }}
          >
            Patent ID:
          </label>
          <input
            type="text"
            value={patentId}
            onChange={(e) => setPatentId(e.target.value)}
            className="form-control"
            style={{
              backgroundColor: "#1A1A1A",
              color: "#FFFFFF",
              border: "1px solid #57DC2F",
              borderRadius: "5px",
            }}
            required
          />
        </div>
        <div className="mb-3">
          <label
            className="form-label"
            style={{
              color: "#57DC2F", // Updated to match the theme
              fontWeight: "bold",
            }}
          >
            Company Name:
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="form-control"
            style={{
              backgroundColor: "#1A1A1A",
              color: "#FFFFFF",
              border: "1px solid #57DC2F",
              borderRadius: "5px",
            }}
            required
          />
        </div>
        <button
          type="submit"
          className="btn w-100"
          style={{
            backgroundColor: "#57DC2F",
            color: "#000000",
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
          }}
          disabled={loading}
        >
            {loading ? <strong>Checking...</strong> : <strong>Check Infringement</strong>}
        </button>
      </form>


      {loading && <Spinner />} {/* Show spinner during loading */}

      {error && (
        <div
          className="alert text-center mt-3"
          style={{
            color: "#FFFFFF",
            backgroundColor: "#FF0000",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          {error}
        </div>
      )}

      {results && (
        <div
          className="card p-4 shadow mt-4"
          style={{
            backgroundColor: "#121212",
            border: "1px solid #57DC2F",
            borderRadius: "10px",
            color: "#FFFFFF",
          }}
        >
          <h2 style={{ color: "#57DC2F", fontWeight: "bold", marginBottom: "20px" }}>
            Infringement Results
          </h2>
          <p>
            <strong style={{ color: "#57DC2F" }}>Patent ID:</strong> {results.patent_id}
          </p>
          <p>
            <strong style={{ color: "#57DC2F" }}>Company Name:</strong> {results.company_name}
          </p>
          <p>
            <strong style={{ color: "#57DC2F" }}>Overall Risk Assessment:</strong>{" "}
            {results.overall_risk_assessment}
          </p>
          <p>
            <strong style={{ color: "#57DC2F" }}>Created Time:</strong>{" "}
            {new Date(results.create_time).toLocaleString()}
          </p>

          <h3 style={{ color: "#57DC2F", marginTop: "30px", marginBottom: "15px" }}>
            Top Infringing Products
          </h3>
          {results.top_infringing_products?.length > 0 ? (
            results.top_infringing_products.map((product, index) => (
              <div
                key={index}
                style={{
                  borderTop: "1px solid #57DC2F",
                  paddingTop: "15px",
                  marginTop: "15px",
                }}
              >
                <h4
                  style={{
                    color: "#57DC2F",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {product.product_name}
                </h4>
                <p>
                  <strong style={{ color: "#57DC2F" }}>Likelihood:</strong>{" "}
                  {product.infringement_likelihood}
                </p>
                <p>
                  <strong style={{ color: "#57DC2F" }}>Explanation:</strong>{" "}
                  {product.explanation}
                </p>
                <p>
                  <strong style={{ color: "#57DC2F" }}>Relevant Claims:</strong>{" "}
                  {product.relevant_claims.join(", ")}
                </p>
                <p style={{ marginBottom: "10px", fontWeight: "bold", color: "#57DC2F" }}>
                  Specific Features:
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  {product.specific_features.map((feature, i) => (
                    <li key={i} style={{ color: "#FFFFFF", marginBottom: "5px" }}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p style={{ color: "#FFFFFF", marginTop: "15px" }}>
              No infringing products found.
            </p>
          )}

          <button
            className="btn mt-4"
            style={{
              backgroundColor: "#57DC2F",
              color: "#000000",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
            onClick={handleSaveReport}
          >
            Save This Report
          </button>
        </div>
      )}



      {/* Saved Reports Section */}
      <div
        className="card p-4 shadow mt-5"
        style={{ backgroundColor: "#121212", border: "1px solid #57DC2F", borderRadius: "10px" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h2 style={{ color: "#57DC2F" }}>Saved Reports</h2>
          <button
            className="btn"
            style={{
              backgroundColor: "#57DC2F",
              color: "#000000",
              borderRadius: "5px",
            }}
            onClick={toggleSavedReports}
          >
            {showSavedReports ? <strong>Hide Saved Reports</strong> : <strong>Show Saved Reports</strong>}
          </button>
        </div>

        {showSavedReports && (
          <div className="mt-3">
            {fetchingReports ? (
              <Spinner />
            ) : savedReports.length === 0 ? (
              <p style={{ color: "#FFFFFF" }}>No saved reports found.</p>
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
