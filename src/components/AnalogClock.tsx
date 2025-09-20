import React, { useState, useEffect } from 'react';

function AnalogClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

    return (
        <div className="relative w-48 h-48 bg-teal-500/50 rounded-full border-4 border-white/50 shadow-inner">
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>

            {/* Hour Hand */}
            <div
                className="absolute top-1/2 left-1/2 w-1 h-12 bg-white origin-bottom rounded-t-full"
                style={{ transform: `translateX(-50%) rotate(${hourDegrees}deg)` }}
            ></div>

            {/* Minute Hand */}
            <div
                className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-white origin-bottom rounded-t-full"
                style={{ transform: `translateX(-50%) rotate(${minuteDegrees}deg)` }}
            ></div>

            {/* Second Hand */}
            <div
                className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-red-500 origin-bottom rounded-t-full"
                style={{ transform: `translateX(-50%) rotate(${secondDegrees}deg)` }}
            ></div>

            {/* Clock Numbers/Markers can be added here with absolute positioning */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-lg">12</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-lg">6</div>
            <div className="absolute top-1/2 right-2 -translate-y-1/2 font-bold text-lg">3</div>
            <div className="absolute top-1/2 left-2 -translate-y-1/2 font-bold text-lg">9</div>
        </div>
    );
}

export default AnalogClock;