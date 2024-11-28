import React, { useEffect, useState } from 'react';

const Loading = ({ isVisible }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isVisible) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev < 100) {
                        return prev + 1;
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 10);
        }
    }, [isVisible]);

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-white z-50 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div className="text-center">
                <div className="mb-4 text-2xl">
                    Loading <span role="img" aria-label="bird">🐦</span>
                </div>
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-400"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    Bird monitor is waking up...
                </div>
            </div>
        </div>
    );
};

export default Loading;