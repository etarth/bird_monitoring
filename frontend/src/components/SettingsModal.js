import { useState, useEffect } from 'react';

const SettingsModal = ({ isOpen, onClose, onSave }) => {
  const [birdName, setBirdName] = useState('');
  const [foodWeight, setFoodWeight] = useState('');
  const [waterLevel, setWaterLevel] = useState('');
  const [temperatureRange, setTemperatureRange] = useState({ min: 20, max: 30 });
  const [humidityRange, setHumidityRange] = useState({ min: 40, max: 60 });
  const [file, setFile] = useState(null);

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleTemperatureChange = (e, name) => {
    const value = parseInt(e.target.value);
    setTemperatureRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHumidityChange = (e, name) => {
    const value = parseInt(e.target.value);
    setHumidityRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('birdName', birdName);
    formData.append('foodWeight', foodWeight);
    formData.append('waterLevel', waterLevel);
    formData.append('temperatureRange', JSON.stringify(temperatureRange));
    formData.append('humidityRange', JSON.stringify(humidityRange));
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/settings`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Settings data saved successfully');
        onSave({
          birdName,
          foodWeight,
          waterLevel,
          temperatureRange,
          humidityRange,
          file: file ? file.name : null,
        });
      } else {
        console.error('Error saving settings data');
      }
    } catch (error) {
      console.error('Error saving settings data:', error);
    }
  };

  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    let timeout;
    if (isOpen) {
      // Fetch settings data when the modal opens
      const fetchSettings = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/settings`);
          const data = await response.json();
          setBirdName(data.birdName || '');
          setFoodWeight(data.foodWeight || '');
          setWaterLevel(data.waterLevel || '');
          setTemperatureRange(data.temperatureRange || { min: 20, max: 30 });
          setHumidityRange(data.humidityRange || { min: 40, max: 60 });
          setFile(null); // Reset file input
        } catch (error) {
          console.error('Error fetching settings data:', error);
        }
      };
      fetchSettings();

      // Delay adding the background until the transition ends
      timeout = setTimeout(() => {
        setShowBackground(true);
      }, 300); // Match the duration of your transition (300ms)
    } else {
      // Immediately remove background when closing
      setShowBackground(false);
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    <div
      className={`fixed -top-[24px] left-0 w-full h-full z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${showBackground ? 'bg-black bg-opacity-50' : ''}`}
    >
      <div className="flex justify-center items-center h-full">
        <div className="bg-white rounded-[36px] p-[24px] w-[90%] md:w-[60%] lg:w-[40%] shadow-xl transform transition-all">
          <h2 className="text-xl font-semibold text-center mb-6">Settings</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bird Name</label>
            <input
              type="text"
              value={birdName}
              onChange={(e) => handleInputChange(e, setBirdName)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter bird name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Bird Photo</label>
            <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-md">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="cursor-pointer text-blue-500 hover:text-blue-700">
                <p className="text-gray-500">Drag and drop a photo or click to select</p>
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-700">
                Selected file: <strong>{file.name}</strong>
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Weight of Food (grams)</label>
            <input
              type="number"
              value={foodWeight}
              onChange={(e) => handleInputChange(e, setFoodWeight)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter max weight of food"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Level of Water (ml)</label>
            <input
              type="number"
              value={waterLevel}
              onChange={(e) => handleInputChange(e, setWaterLevel)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter max water level"
            />
          </div>

          <div className="mb-6 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Preferred Temperature (°C)</label>
            <div className="flex flex-row items-center space-x-[12px]">
              <input
                type="number"
                value={temperatureRange.min}
                onChange={(e) => handleTemperatureChange(e, 'min')}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Min Temp"
              />
              <span className="text-gray-700">-</span>
              <input
                type="number"
                value={temperatureRange.max}
                onChange={(e) => handleTemperatureChange(e, 'max')}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Max Temp"
              />
            </div>
          </div>

          <div className="mb-6 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Preferred Humidity (%)</label>
            <div className='flex flex-row items-center space-x-[12px]'>
              <input
                type="number"
                value={humidityRange.min}
                onChange={(e) => handleHumidityChange(e, 'min')}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Min Humidity"
              />
              <span className="text-gray-700">-</span>
              <input
                type="number"
                value={humidityRange.max}
                onChange={(e) => handleHumidityChange(e, 'max')}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Max Humidity"
              />
            </div>
          </div>

          <div className="flex flex-row justify-end space-x-4">
            <button
              onClick={onClose}
              className="w-full px-6 py-2 bg-[#DBDBDC] text-black font-bold rounded-full hover:bg-[#999999] transition-all"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="w-full px-6 py-2 bg-black text-white font-bold rounded-full hover:bg-blue-600 transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;