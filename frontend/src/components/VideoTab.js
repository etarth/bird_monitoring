// VideoTab.js
import React from 'react';

const VideoTab = ({ birdHistory, videoUrl }) => {
  return (
    <div>
      {/* Video URL */}
      {birdHistory.length > 0 && videoUrl && (
        <div>
          <h3 className="text-lg font-medium mb-4">Latest Video</h3>
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Watch Latest Video
          </a>
        </div>
      )}
      {/* List of Video URLs */}
      {birdHistory.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">All Video Links</h3>
          <ul className="list-disc pl-5 space-y-2">
            {birdHistory.map((record, index) => (
              <li key={index} className="text-sm">
                {record.videoUrl && (
                  <a href={record.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Watch Day {index + 1} Video
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoTab;
