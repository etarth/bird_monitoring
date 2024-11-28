import React from 'react';

const CameraStream = () => {
  const streamURL = process.env.REACT_APP_CAMERA_STREAM_URL;

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