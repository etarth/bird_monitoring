import React, { useState } from 'react';
import SettingsModal from './SettingsModal'; // Import the modal component

const SideMenu = ({ selectedSection, onSelectSection }) => {

  return (
    <>
      {/* Side Menu */}
      <div className="fixed mt-0 left-0 w-[50%] h-[75vh] transform -translate-x-full">
        <div className="flex-col h-full space-y-[16px] p-[12px] content-center">
          <div>
            <button
              onClick={() => onSelectSection('liveStream')}
              className={`text-[16px] font-medium text-[#989898] hover:text-[#000000] hover:text-[20px] hover:font-semibold ${
                selectedSection === 'liveStream' ? 'text-black text-[20px] font-semibold' : ''
              }`}
            >
              Live Stream
            </button>
          </div>
          <div>
            <button
              onClick={() => onSelectSection('feeding')}
              className={`text-[16px] font-medium text-[#989898] hover:text-[#000000] hover:text-[20px] hover:font-semibold ${
                selectedSection === 'feeding' ? 'text-black text-[20px] font-semibold' : ''
              }`}
            >
              Petting
            </button>
          </div>
          <div>
            <button
              onClick={() => onSelectSection('birdHistory')}
              className={`text-[16px] font-medium text-[#989898] hover:text-[#000000] hover:text-[20px] hover:font-semibold ${
                selectedSection === 'birdHistory' ? 'text-black text-[20px] font-semibold' : ''
              }`}
            >
              Bird History
            </button>
          </div>
          <div>
            <button
              onClick={() => onSelectSection('settingsModal')}
              className={`text-[16px] font-medium text-[#989898] hover:text-[#000000] hover:text-[20px] hover:font-semibold`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
