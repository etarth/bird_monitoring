import React, { useState } from 'react';

const CameraStream = () => {
  const streamURL = process.env.REACT_APP_CAMERA_STREAM_URL;
  const [isStreamLoaded, setIsStreamLoaded] = useState(false);
  const [isStreamError, setIsStreamError] = useState(false);

  const handleImageLoad = () => {
    setIsStreamLoaded(true);
  };

  const handleImageError = () => {
    setIsStreamError(true);
  };

  return (
    <div className="flex flex-col items-center bg-white space-y-[8px] w-full h-full rounded-[36px] p-[8px]">
    <div className="relative bg-[#DBDBDC] w-full h-full rounded-[36px] overflow-hidden flex items-center justify-center">
      {!isStreamLoaded || isStreamError ? (
        <div className="text-center text-white">
          <div className="text-6xl">🐦</div>
          <div className="text-xl mt-2">Stream not available</div>
        </div>
      ) : null}
      <img
        src={streamURL}
        alt="Live camera feed"
        className={`w-full h-full object-cover rounded-[36px] ${!isStreamLoaded || isStreamError ? 'hidden' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
    </div>
  );
};

export default CameraStream;