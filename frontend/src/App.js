import React, { useEffect, useState, useRef } from 'react';
import { database } from './firebaseConfig'; // Import the database instance
import { ref, onValue } from 'firebase/database';
import SideMenu from './components/SideMenu';
import BirdStatus from './components/BirdStatus';
import CameraStream from './components/CameraStream';

const App = () => {
  const [sensorData, setSensorData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('liveStream');

  const liveStreamRef = useRef(null);
  const pettingRef = useRef(null);
  const eatingHistoryRef = useRef(null);
  const changeNameRef = useRef(null);

  // Firebase data fetching
  useEffect(() => {
    const sensorDataRef = ref(database, '/');

    onValue(sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Data from Firebase:", data);
      setSensorData(data);
    });
  }, []);

  // Toggle side menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
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
      case 'eatingHistory':
        eatingHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'changeName':
        changeNameRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  // Section selection handler that closes the menu and scrolls
  const handleSectionSelect = (section) => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedSection(section);
      scrollToSection(section);
    },100)
  };

  // IntersectionObserver to track section visibility
  useEffect(() => {
    const sections = [
      { id: 'liveStream', ref: liveStreamRef },
      { id: 'feeding', ref: pettingRef },
      { id: 'eatingHistory', ref: eatingHistoryRef },
      { id: 'changeName', ref: changeNameRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const visibleSection = sections.find((section) => section.ref.current === entry.target);
            if (visibleSection && visibleSection.id !== selectedSection) {
              setSelectedSection(visibleSection.id);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    // Cleanup observer on unmount
    return () => {
      sections.forEach((section) => {
        if (section.ref.current) {
          observer.unobserve(section.ref.current);
        }
      });
    };
  }, [selectedSection]);

  return (
    <div className="flex-col min-h-screen space-y-[24px] bg-[#DBDBDC] pt-[32px] p-6 overflow-hidden">
        <button
          onClick={toggleMenu}
          className="rounded-full transition-transform duration-300"
        >
          <span className="text-black text-[32px]">
            {isOpen ? '×' : '☰'}
          </span>
        </button>

      <div 
        className={
          `flex-row transition-all duration-300 ease-in-out h-[85vh] w-full 
          ${isOpen ? 'translate-x-[50%]' : 'translate-x-0'}`
        }
      >
        <SideMenu selectedSection={selectedSection} onSelectSection={handleSectionSelect} />
        <div className="flex-col space-y-[24px] h-[85vh] w-full rounded-[24px] overflow-y-auto snap-mandatory snap-y">
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
        </div>
      </div>
    </div>
  );
};

export default App;
