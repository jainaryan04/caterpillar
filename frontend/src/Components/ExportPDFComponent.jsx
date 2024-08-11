import React, { useState } from 'react';
import ReportForm from './ReportForm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportPDFComponent = () => {
  const [reportDetails, setReportDetails] = useState(null);

  const fetchReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`);
      const data = await response.json();
      const parsedData = {
        ...data,
        tyre: JSON.parse(data.tyre),
        battery: JSON.parse(data.battery),
        engine: JSON.parse(data.engine),
        brake: JSON.parse(data.brake),
        exterior: JSON.parse(data.exterior),
        header: JSON.parse(data.header),
      };
      setReportDetails(parsedData);
      console.log(parsedData);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const handleDownloadPdf = () => {
    const input = document.getElementById('reportDetails');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('report.pdf');
    });
  };

  const {
    id,
    tyre,
    battery,
    engine,
    brake,
    exterior,
    header
  } = reportDetails || {};

  return (
    <div>
      <ReportForm onFetchReport={fetchReport} />
      {reportDetails && (
        <div id="reportDetails" style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
          <h2>Report Details</h2>
          <p><strong>ID:</strong> {id}</p>

          {header && (
            <div>
              <h3>Header</h3>
              <p><strong>Truck Serial No:</strong> {header.truckSerialNo}</p>
              <p><strong>Model:</strong> {header.model}</p>
              <p><strong>Inspector Name:</strong> {header.inspectorName}</p>
              <p><strong>Inspection Employee ID:</strong> {header.inspectionEmployeeID}</p>
              <p><strong>Location:</strong> {header.location}</p>
              <p><strong>Service Meter Hours:</strong> {header.serviceMeterHours}</p>
              <p><strong>Customer Company Name:</strong> {header.customerCompanyName}</p>
              <p><strong>Cat Customer ID:</strong> {header.catCustomerID}</p>
            </div>
          )}

          {tyre && (
            <div>
              <h3>Tyre</h3>
              <p><strong>Press Left Front:</strong> {tyre.pressltft}</p>
              <p><strong>Press Right Front:</strong> {tyre.pressrtft}</p>
              <p><strong>Press Right Rear:</strong> {tyre.pressrtrr}</p>
              <p><strong>Press Left Rear:</strong> {tyre.pressltrr}</p>
              <p><strong>Condition Left Front:</strong> {tyre.condltft}</p>
              <p><strong>Condition Right Front:</strong> {tyre.condrtft}</p>
              <p><strong>Condition Left Rear:</strong> {tyre.condltrr}</p>
              <p><strong>Condition Right Rear:</strong> {tyre.condrtrr}</p>
            </div>
          )}

          {battery && (
            <div>
              <h3>Battery</h3>
              <p><strong>Battery Make:</strong> {battery.batteryMake}</p>
              <p><strong>Battery Replacement Date:</strong> {battery.batteryReplacementDate}</p>
              <p><strong>Battery Voltage:</strong> {battery.batteryVoltage}</p>
              <p><strong>Battery Water Level:</strong> {battery.batteryWaterLevel}</p>
              <p><strong>Battery Condition:</strong> {battery.batteryCondition}</p>
              <p><strong>Battery Leak:</strong> {battery.batteryLeak}</p>
              <p><strong>Battery Summary:</strong> {battery.batterySummary}</p>
            </div>
          )}

          {exterior && (
            <div>
              <h3>Exterior</h3>
              <p><strong>Exterior Damage:</strong> {exterior.exteriorDamage}</p>
              <p><strong>Oil Leak Suspension:</strong> {exterior.oilLeakSuspension}</p>
              <p><strong>Exterior Summary:</strong> {exterior.exteriorSummary}</p>
            </div>
          )}

          {brake && (
            <div>
              <h3>Brake</h3>
              <p><strong>Brake Fluid Level:</strong> {brake.brakeFluidLevel}</p>
              <p><strong>Brake Condition Front:</strong> {brake.brakeConditionFront}</p>
              <p><strong>Brake Condition Rear:</strong> {brake.brakeConditionRear}</p>
              <p><strong>Emergency Brake:</strong> {brake.emergencyBrake}</p>
              <p><strong>Brake Summary:</strong> {brake.brakeSummary}</p>
            </div>
          )}

          {engine && (
            <div>
              <h3>Engine</h3>
              <p><strong>Rust Damage:</strong> {engine.rustDamage}</p>
              <p><strong>Oil Condition:</strong> {engine.oilCondition}</p>
              <p><strong>Oil Color:</strong> {engine.oilColor}</p>
              <p><strong>Fluid Condition:</strong> {engine.fluidCondition}</p>
              <p><strong>Fluid Color:</strong> {engine.fluidColor}</p>
              <p><strong>Oil Leak:</strong> {engine.oilLeak}</p>
              <p><strong>Summary:</strong> {engine.summary}</p>
            </div>
          )}

          <button onClick={handleDownloadPdf}>Download as PDF</button>
        </div>
      )}
    </div>
  );
};

export default ExportPDFComponent;
