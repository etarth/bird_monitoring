import React, { useEffect, useState } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import FoodTab from './FoodTab';
import WaterTab from './WaterTab';
import BirdHistoryTable from './BirdHistoryTable'; // Import the new component

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
  const [videoUrl, setVideoUrl] = useState('');
  const [activeTab, setActiveTab] = useState('food');

  useEffect(() => {
    const birdHistoryRef = ref(database, '/birdHistory');
  
    onValue(birdHistoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const records = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .sort((a, b) => new Date(a.time) - new Date(b.time)); // Sort by time (earliest to latest)
        setBirdHistory(records);
        setVideoUrl(records[records.length - 1]?.video || '');
      }
    });
  }, []);  

  const foodGraphData = {
    labels: birdHistory.map((record) => record.time),
    datasets: [
      {
        label: 'Food Weight (grams)',
        data: birdHistory.map((record) => record.food),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const waterGraphData = {
    labels: birdHistory.map((record) => record.time),
    datasets: [
      {
        label: 'Water Level (ml)',
        data: birdHistory.map((record) => record.water),
        fill: false,
        borderColor: 'rgba(54,162,235,1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hides the legend
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0]?.label; // Show time from `record.time` in the tooltip
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: true, 
        },
      },
    },
  }

  return (
    <div className="flex flex-col bg-white h-full w-full rounded-[36px] p-6">
      <h2 className="text-xl font-semibold mb-4">Bird History</h2>

      <div className="mb-10 h-[30%]">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('food')}
            className={`py-2 px-4 rounded-lg ${activeTab === 'food' ? 'bg-[#DBDBDC]' : 'hover:bg-[#F7F7F7]'}`}
          >
            Food
          </button>
          <button
            onClick={() => setActiveTab('water')}
            className={`py-2 px-4 rounded-lg ${activeTab === 'water' ? 'bg-[#DBDBDC]' : 'hover:bg-[#F7F7F7]'}`}
          >
            Water
          </button>
        </div>
        {activeTab === 'food' && <FoodTab birdHistory={birdHistory} foodGraphData={foodGraphData} chartOptions={chartOptions} />}
        {activeTab === 'water' && <WaterTab birdHistory={birdHistory} waterGraphData={waterGraphData} chartOptions={chartOptions} />}
      </div>

      <BirdHistoryTable birdHistory={birdHistory}/>

    </div>
  );
};

export default BirdHistory;
