// FoodTab.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const FoodTab = ({ birdHistory, foodGraphData }) => {
  return (
    <div>
      {/* Line Graph for Food Weight */}
      {birdHistory.length > 0 ? (
        <div className="mb-6">
          <Line data={foodGraphData} options={{ responsive: true }} />
        </div>
      ) : (
        <p className="text-gray-500">No food history available.</p>
      )}

      {/* List of Food History */}
      {birdHistory.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Detailed Food History</h3>
          <ul className="list-disc pl-5 space-y-2">
            {birdHistory.map((record, index) => (
              <li key={index} className="text-sm">
                <strong>{`Day ${index + 1}`}</strong>: {record.foodWeight}g
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FoodTab;