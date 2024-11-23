import React from 'react';

const StatusItem = ({ iconSrc, title, value, type, unit }) => {
  // Determine if a button should be displayed based on the type
  const buttonLabel = type === 'food' ? 'Feed' : type === 'water' ? 'Refill' : null;

  return (
    <div className='flex flex-row h-[64px] w-full bg-white rounded-full p-[8px] space-x-[16px] items-center'>
      <div className="w-[48px] h-[48px] bg-[#DBDBDC] rounded-full flex items-center justify-center">
        <img
          src={iconSrc}
          alt={`${title} Icon`}
          className="w-8 h-8 filter invert"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-lg text-[#969696]">{value} {unit}</p>
      </div>
      {/* Conditionally render the button if buttonLabel exists */}
      {buttonLabel && (
        <button className={`h-[48px] w-[100px] bg-black text-white rounded-full px-4 py-2`}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default StatusItem;
