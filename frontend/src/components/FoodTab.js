import { Line } from 'react-chartjs-2';

const FoodTab = ({ foodGraphData, chartOptions }) => {
  return <Line data={foodGraphData} options={chartOptions} />;
};

export default FoodTab;