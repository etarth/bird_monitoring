// BirdHistory.js
import React, { useEffect, useState } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Tabs, Tab } from "@nextui-org/tabs";
import FoodTab from './FoodTab';  // Import the FoodTab component
import WaterTab from './WaterTab'; // Import the WaterTab component
import VideoTab from './VideoTab'; // Import the VideoTab component

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BirdHistory = () => {
  const [birdHistory, setBirdHistory] = useState([]);
  const [eatingAvg, setEatingAvg] = useState(0);
  const [waterIntakeAvg, setWaterIntakeAvg] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [activeTab, setActiveTab] = useState('food');

  useEffect(() => {
    const birdHistoryRef = ref(database, '/birdHistory');

    // Fetch data from Firebase
    onValue(birdHistoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const records = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setBirdHistory(records);

        // Calculate averages
        const totalFood = records.reduce((acc, record) => acc + record.foodWeight, 0);
        setEatingAvg(totalFood / records.length);

        const totalWater = records.reduce((acc, record) => acc + record.waterLevel, 0);
        setWaterIntakeAvg(totalWater / records.length);

        // Set the videoUrl of the last record
        setVideoUrl(records[records.length - 1]?.videoUrl || '');
      }
    });
  }, []);

  // Prepare data for food weight line graph
  const foodGraphData = {
    labels: birdHistory.map((record, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: 'Food Weight (grams)',
        data: birdHistory.map((record) => record.foodWeight),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  // Prepare data for water level line graph
  const waterGraphData = {
    labels: birdHistory.map((record, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: 'Water Level (%)',
        data: birdHistory.map((record) => record.waterLevel),
        fill: false,
        borderColor: 'rgba(54,162,235,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="bg-white h-full w-full rounded-[36px] p-6">
      <h2 className="text-xl font-semibold mb-4">Bird History</h2>

      {/* Custom Tab System */}
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('food')}
            className={`py-2 px-4 rounded-lg ${activeTab === 'food' ? 'bg-blue-200' : 'hover:bg-blue-100'}`}
          >
            Food
          </button>
          <button
            onClick={() => setActiveTab('water')}
            className={`py-2 px-4 rounded-lg ${activeTab === 'water' ? 'bg-blue-200' : 'hover:bg-blue-100'}`}
          >
            Water
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`py-2 px-4 rounded-lg ${activeTab === 'video' ? 'bg-blue-200' : 'hover:bg-blue-100'}`}
          >
            Video
          </button>
        </div>

        {activeTab === 'food' && <FoodTab birdHistory={birdHistory} foodGraphData={foodGraphData} />}
        {activeTab === 'water' && <WaterTab birdHistory={birdHistory} waterGraphData={waterGraphData} />}
        {activeTab === 'video' && <VideoTab birdHistory={birdHistory} videoUrl={videoUrl} />}
      </div>
    </div>
  );
};

export default BirdHistory;
