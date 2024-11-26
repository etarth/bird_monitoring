import React from 'react';

const CameraStream = () => {
  // Replace the src URL with your ESP32-CAM IP address
  const streamURL = 'http://172.20.10.3/sustain?video=1/';

  return (
    <div className="relative bg-white w-full h-full rounded-[36px] overflow-hidden">
      <img
        src={streamURL}
        alt="Live camera feed"
        className="w-full h-full object-cover rounded-[36px]"
      />
    </div>
  );
};

export default CameraStream;
