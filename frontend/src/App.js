import React, { useEffect, useState, useRef } from 'react';
import SideMenu from './components/SideMenu';
import BirdStatus from './components/BirdStatus';
import CameraStream from './components/CameraStream';
import BirdHistory from './components/BirdHistory';
import SettingsModal from './components/SettingsModal';
import Loading from './components/Loading';

const App = () => {
  const [sensorData, setSensorData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('liveStream');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const liveStreamRef = useRef(null);
  const pettingRef = useRef(null);
  const birdHistoryRef = useRef(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/sensor-data`);
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };
    fetchSensorData();

    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  const handleSectionSelect = (section) => {
    if (section === 'settingsModal') {
      setIsOpen(false);
      setTimeout(() => {
        setIsModalOpen(true);
      }, 100);
    } else {
      setIsOpen(false);
      setTimeout(() => {
        setSelectedSection(section);
        scrollToSection(section);
      }, 100);
    }
  };

  const handleModalDone = (settings) => {
    console.log('Saved Settings:', settings);
    setIsModalOpen(false);
  };

  return (
    <div className="flex-col min-h-screen space-y-[24px] bg-[#DBDBDC] p-6 overflow-hidden">
      {isLoading && <Loading isVisible={isLoading} />}
      <button onClick={toggleMenu} className="rounded-full transition-transform duration-300">
        <span className="text-black text-[32px]">{isOpen ? '×' : '☰'}</span>
      </button>

      <div className={`flex-row transition-all duration-300 ease-in-out h-[85vh] w-full ${isOpen ? 'translate-x-[50%]' : 'translate-x-0'}`}>
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

      <SettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleModalDone} />
    </div>
  );
};

export default App;