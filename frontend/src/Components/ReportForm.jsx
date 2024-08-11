import React, { useState } from 'react';

const ReportForm = ({ onFetchReport }) => {
  const [reportId, setReportId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFetchReport(reportId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="reportId">Enter Report ID:</label>
      <input
        type="text"
        id="reportId"
        value={reportId}
        onChange={(e) => setReportId(e.target.value)}
      />
      <button type="submit">Fetch Report</button>
    </form>
  );
};

export default ReportForm;
