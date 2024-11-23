import React from 'react';

const SideMenu = ({ selectedSection, onSelectSection }) => {
  return (
    <div className={`fixed left-0 w-[50%] h-[75vh] transform -translate-x-full`}>
      <div className="flex-col h-full space-y-[16px] p-[12px] content-center">
        <div>
          <button
            onClick={() => onSelectSection('liveStream')}
            className={`text-[16px] font-medium text-[#989898] hover:text-[#000000] hover:text-[20px] hover:text-semibold ${selectedSection === 'liveStream' ? 'text-black text-[20px] font-semibold' : ''}`}
          >
            Live Stream
          </button>
        </div>
        <div>
          <button
            onClick={() => onSelectSection('feeding')}
            className={`text-[16px] font-medium text-[#989898] hover:text-[#000000] hover:text-[20px] hover:text-semibold ${selectedSection === 'feeding' ? 'text-black text-[20px] font-semibold' : ''}`}
          >
            Petting
          </button>
        </div>
        <div>
          <button
            onClick={() => onSelectSection('eatingHistory')}
            className={`text-[16px] font-medium text-[#989898] hover:text-[#000000] hover:text-[20px] hover:text-semibold ${selectedSection === 'eatingHistory' ? 'text-black text-[20px] font-semibold' : ''}`}
          >
            Eating History
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
