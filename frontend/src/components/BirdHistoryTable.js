import React from 'react';
import { FaVideo } from 'react-icons/fa';

const BirdHistoryTable = ({ birdHistory }) => {
  // Sort records by date in descending order (latest date first)
  const sortedHistory = [...birdHistory].sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="flex flex-col h-[55%]"> {/* Make the container flexible */}
      <div className="flex-grow overflow-y-auto"> {/* Allow the table to fill available space */}
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
                <td className="border-b text-[14px] p-2">{record.time}</td>
                <td className="border-b text-[14px] p-2">{record.food}</td>
                <td className="border-b text-[14px] p-2">{record.water}</td>
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
