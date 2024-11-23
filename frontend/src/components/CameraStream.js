import React from 'react';

const CameraStream = () => {
  // Replace the src URL with your ESP32-CAM IP address
  const streamURL = 'http://192.168.x.x:81/stream';

  return (
    <div className="relative flex-col space-y-[8px] w-full h-full rounded-[36px] overflow-hidden">
      <img
        src={streamURL}
        alt="Live camera feed"
        className="bg-white h-[100vh] w-full rounded-[36px]"
      />
    </div>
  );
};

export default CameraStream;
