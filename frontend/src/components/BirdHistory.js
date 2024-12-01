import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import FoodTab from './FoodTab';
import WaterTab from './WaterTab';
import BirdHistoryTable from './BirdHistoryTable';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BirdHistory = () => {
  const [birdHistory, setBirdHistory] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [activeTab, setActiveTab] = useState('food');

  useEffect(() => {
    const fetchBirdHistory = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/bird-history`);
        const data = await response.json();
        const records = data.sort((a, b) => new Date(a.time) - new Date(b.time));
        // console.log('kuy pun')
        // console.log(records)
        setBirdHistory(records);
        setVideoUrl(records[records.length - 1]?.video || '');
      } catch (error) {
        console.error('Error fetching bird history:', error);
      }
    };
    fetchBirdHistory();
  }, []);

  const foodGraphData = {
    labels: birdHistory.map((record) => record.timestamp),
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

  const waterGraphData = {
    labels: birdHistory.map((record) => record.timestamp),
    datasets: [
      {
        label: 'Water Level (ml)',
        data: birdHistory.map((record) => record.waterLevel),
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
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0]?.label;
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
  };

  return (
    <div className="flex flex-col bg-white h-full w-full rounded-[36px] p-6">
      <h2 className="text-xl font-semibold mb-4">Bird History</h2>

      <div className="mb-10 h-[30%]">
        <div className="flex space-x-4 mb-4">
          <button onClick={() => setActiveTab('food')} className={`py-2 px-6 rounded-full ${activeTab === 'food' ? 'bg-[#000000] text-white' : 'hover:bg-[#F7F7F7]'}`}>
            Food
          </button>
          <button onClick={() => setActiveTab('water')} className={`py-2 px-6 rounded-full ${activeTab === 'water' ? 'bg-[#000000] text-white' : 'hover:bg-[#F7F7F7]'}`}>
            Water
          </button>
        </div>
        {activeTab === 'food' && <FoodTab birdHistory={birdHistory} foodGraphData={foodGraphData} chartOptions={chartOptions} />}
        {activeTab === 'water' && <WaterTab birdHistory={birdHistory} waterGraphData={waterGraphData} chartOptions={chartOptions} />}
      </div>

      <BirdHistoryTable birdHistory={birdHistory} />
    </div>
  );
};

export default BirdHistory;