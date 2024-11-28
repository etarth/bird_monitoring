import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';

const FoodTab = ({ foodGraphData, chartOptions }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <Line ref={chartRef} data={foodGraphData} options={chartOptions} />;
};

export default FoodTab;