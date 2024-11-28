import React, { useEffect, useState, useRef } from 'react';
import { database } from './firebaseConfig'; // Import the database instance
import { ref, onValue } from 'firebase/database';
import SideMenu from './components/SideMenu';
import BirdStatus from './components/BirdStatus';
import CameraStream from './components/CameraStream';
import BirdHistory from './components/BirdHistory';
import SettingsModal from './components/SettingsModal'; // Import the new modal component

const App = () => {
  const [sensorData, setSensorData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('liveStream');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const liveStreamRef = useRef(null);
  const pettingRef = useRef(null);
  const birdHistoryRef = useRef(null);

  // Firebase data fetching
  useEffect(() => {
    const sensorDataRef = ref(database, '/');

    onValue(sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Data from Firebase:', data);
      setSensorData(data);
    });
  }, []);

  // Toggle side menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Scroll to a specific section
  const scrollToSection = (section) => {
    switch (section) {
      case 'liveStream':
        liveStreamRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'feeding':
        pettingRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'birdHistory':
        birdHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  // Section selection handler
  // Section selection handler
const handleSectionSelect = (section) => {
  if (section === 'settingsModal') {
    setIsOpen(false); // Close sidebar
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  } else {
    setIsOpen(false); // Close sidebar
    setTimeout(() => {
      setSelectedSection(section); // Update selectedSection
      scrollToSection(section); // Scroll to the selected section
    }, 100);
  }
};

  
  // Handle modal save and close actions
  const handleModalDone = (settings) => {
    console.log('Saved Settings:', settings);
    setIsModalOpen(false); // Close modal
    // The selectedSection remains unchanged
  };  

  return (
    <div className="flex-col min-h-screen space-y-[24px] bg-[#DBDBDC] p-6 overflow-hidden">
      <button
        onClick={toggleMenu}
        className="rounded-full transition-transform duration-300"
      >
        <span className="text-black text-[32px]">
          {isOpen ? '×' : '☰'}
        </span>
      </button>

      <div
        className={`flex-row transition-all duration-300 ease-in-out h-[85vh] w-full 
          ${isOpen ? 'translate-x-[50%]' : 'translate-x-0'}`}
      >
        <SideMenu selectedSection={selectedSection} onSelectSection={handleSectionSelect} />
        <div className="flex-col space-y-[24px] h-[85vh] w-full rounded-[36px] overflow-y-auto snap-mandatory snap-y">
          <div className="h-[85vh] w-full snap-center" ref={liveStreamRef}>
            <CameraStream />
          </div>
          {sensorData ? (
            <div className="h-[85vh] w-full snap-center" ref={pettingRef}>
              <BirdStatus data={sensorData} />
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading sensor data...</p>
          )}
          <div className="h-[85vh] w-full snap-center" ref={birdHistoryRef}>
            <BirdHistory />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleModalDone} />
    </div>
  );
};

export default App;
