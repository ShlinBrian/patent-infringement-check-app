import React, { useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";

const HomePage: React.FC = () => {
  const [patentId, setPatentId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/check-infringement", {
        patent_id: patentId,
        company_name: companyName,
      });
      setResults(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        // Display backend error message if available
        setError(err.response.data.detail || "An unexpected error occurred.");
      } else {
        setError("Failed to fetch infringement results. Please try again.");
      }
      console.error("Error running patent check:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center text-primary mb-4">Patent Infringement Checker</h1>
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
          <h3 className="mt-4">Top Infringing Products</h3>
          {results.top_infringing_products?.map((product: any, index: number) => (
            <div key={index} className="border-top pt-3 mt-3">
              <h4 className="text-primary">{product.product_name}</h4>
              <p><strong>Likelihood:</strong> {product.infringement_likelihood}</p>
              <p><strong>Explanation:</strong> {product.explanation}</p>
              <p><strong>Relevant Claims:</strong> {product.relevant_claims.join(", ")}</p>
              <ul className="list-unstyled">
                <strong>Specific Features:</strong>
                {product.specific_features.map((feature: string, i: number) => (
                  <li key={i} className="ms-3">- {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
