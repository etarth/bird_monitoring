// WaterTab.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const WaterTab = ({ birdHistory, waterGraphData }) => {
  return (
    <div>
      {/* Line Graph for Water Level */}
      {birdHistory.length > 0 ? (
        <div className="mb-6">
          <Line data={waterGraphData} options={{ responsive: true }} />
        </div>
      ) : (
        <p className="text-gray-500">No water level history available.</p>
      )}

      {/* List of Water History */}
      {birdHistory.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Detailed Water Level History</h3>
          <ul className="list-disc pl-5 space-y-2">
            {birdHistory.map((record, index) => (
              <li key={index} className="text-sm">
                <strong>{`Day ${index + 1}`}</strong>: {record.waterLevel}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WaterTab;
