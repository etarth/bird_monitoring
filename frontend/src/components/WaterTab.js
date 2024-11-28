import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';

const WaterTab = ({ waterGraphData, chartOptions }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <Line ref={chartRef} data={waterGraphData} options={chartOptions} />;
};

export default WaterTab;