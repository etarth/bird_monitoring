import React from 'react';
import { FaVideo } from 'react-icons/fa';

const BirdHistoryTable = ({ birdHistory }) => {
  const sortedHistory = [...birdHistory].sort((a, b) => new Date(b.time) - new Date(a.time));

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok'
    }).format(new Date(date));
  };

  return (
    <div className="flex flex-col h-[55%]">
      <div className="flex-grow overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className='sticky top-0 bg-white'>
            <tr>
              <th className="border-b-2 p-2">Day</th>
              <th className="border-b-2 p-2">Food (g)</th>
              <th className="border-b-2 p-2">Water (ml)</th>
              <th className="border-b-2 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((record) => (
              <tr key={record.id}>
                <td className="border-b text-[14px] p-2">{record.timestamp}</td>
                <td className="border-b text-[14px] p-2">{record.food}</td>
                <td className="border-b text-[14px] p-2">{record.waterLevel}</td>
                <td className="border-b p-2">
                  {record.video ? (
                    <a href={record.video} target="_blank" rel="noopener noreferrer">
                      <FaVideo className="text-gray-400" />
                    </a>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BirdHistoryTable;