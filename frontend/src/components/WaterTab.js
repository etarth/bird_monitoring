import { Line } from 'react-chartjs-2';

const WaterTab = ({ waterGraphData, chartOptions }) => {
  return <Line data={waterGraphData} options={chartOptions} />;
};

export default WaterTab;