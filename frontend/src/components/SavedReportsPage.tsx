import React, { useEffect, useState } from "react";
import axios from "axios";

interface Report {
  report_id: number;
  patent_id: number;
  company_name: string;
  results: any;
}

const SavedReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/get-reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Saved Reports</h2>
      {reports.map((report) => (
        <div key={report.report_id}>
          <h3>{report.company_name} (Patent ID: {report.patent_id})</h3>
          <pre>{JSON.stringify(report.results, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

export default SavedReportsPage;
