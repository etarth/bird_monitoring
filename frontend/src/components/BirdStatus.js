import React from 'react';
import StatusItem from './StatusItem';

const BirdStatus = ({ data }) => {
  return (
    <div className="flex flex-col w-full h-full rounded-[24px] space-y-[4px]">
      
      {/* Main container with 60% width */}
      <div className="flex flex-col items-center bg-white space-y-[8px] w-full h-full rounded-[36px] p-[8px]">
        <div className='bg-[#DBDBDC] rounded-[30px] w-full h-full'>

        </div>
        <div className='w-full p-[16px] '>
          <p className='text-[24px] font-semibold'>Hi👋, My name is {data.birdName}</p>
        </div>
      </div>


      <StatusItem
        iconSrc="/food.png"
        title="Food Weight"
        value={data.foodWeight}
        type="food"
        unit="g"
      />
      <StatusItem
        iconSrc="/water.png"
        title="Water Level"
        value={data.waterLevel}
        type="water"
        unit="ml"
      />
      <StatusItem
        iconSrc="/humidity.png"
        title="Humidity"
        value={data.humidity}
        type="humidity"
        unit="%"
      />
      <StatusItem
        iconSrc="/light.png"
        title="Light Level"
        value={data.lightLevel}
        type="light"
        unit="lux"
      />
      <StatusItem
        iconSrc="/temperature.png"
        title="Temperature"
        value={data.temperature}
        type="temperature"
        unit="°C"
      />
    </div>
  );
};

export default BirdStatus;
