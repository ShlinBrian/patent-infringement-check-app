import React, { useState } from "react";
import { InfringementReport } from "./types"; // Adjust the path as needed



type SavedReportItemProps = {
  report: InfringementReport;
};

const SavedReportItem: React.FC<SavedReportItemProps> = ({ report }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <p><strong>Patent ID:</strong> {report.patent_id}</p>
          <p><strong>Company Name:</strong> {report.company_name}</p>
          <p><strong>Created At:</strong> {new Date(report.create_time).toLocaleString()}</p>
        </div>
        <button className="btn btn-link" onClick={toggleDetails}>
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3">
          <p><strong>Overall Risk Assessment:</strong> {report.overall_risk_assessment}</p>
          <h4>Top Infringing Products</h4>
          {report.top_infringing_products.length > 0 ? (
            <ul>
              {report.top_infringing_products.map((product, i) => (
                <li key={i}>
                  <p><strong>Product Name:</strong> {product.product_name}</p>
                  <p><strong>Likelihood:</strong> {product.infringement_likelihood}</p>
                  <p><strong>Explanation:</strong> {product.explanation}</p>
                  <p><strong>Relevant Claims:</strong> {product.relevant_claims.join(", ")}</p>
                  <p><strong>Specific Features:</strong></p>
                  <ul>
                    {product.specific_features.map((feature, j) => (
                      <li key={j}>{feature}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No infringing products found.</p>
          )}
        </div>
      )}
    </li>
  );
};

export default SavedReportItem;
