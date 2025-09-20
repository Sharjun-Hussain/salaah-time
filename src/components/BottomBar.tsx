import React, { useState, useEffect } from 'react';

// Type definition for the countdown state
interface TimeLeft {
    hours?: number;
    minutes?: number;
    seconds?: number;
}

// --- CountdownTimer Component ---
// This component calculates and displays the countdown to the next prayer.
function CountdownTimer() {
    const [targetTime] = useState(() => {
        const target = new Date();
        // In a real app, this time would come from your prayer data.
        // We'll set it to 11:43:00 for this example.
        target.setHours(11, 43, 0, 0);

        // If the time has already passed today, set the target for tomorrow
        if (new Date() > target) {
            target.setDate(target.getDate() + 1);
        }
        return target;
    });

    const calculateTimeLeft = (): TimeLeft => {
        const difference = +targetTime - +new Date();
        if (difference > 0) {
            return {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return {};
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    // Helper to format numbers with a leading zero (e.g., 5 -> "05")
    const formatTime = (time: number = 0) => String(time).padStart(2, '0');

    return (
        <div className="bg-teal-600/90 py-1 px-4 rounded-full text-lg font-semibold">
            <span>Jumu'ah - </span>
            <span>{formatTime(timeLeft.hours)}:</span>
            <span>{formatTime(timeLeft.minutes)}:</span>
            <span>{formatTime(timeLeft.seconds)}</span>
        </div>
    );
}


// --- BottomBar Component ---
// This is the main component that creates the scrolling marquee effect.
interface BottomBarProps {
    message: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ message }) => {

    // This is the content that will scroll. We define it once.
    const MarqueeContent = () => (
        <div className="flex items-center flex-shrink-0 px-12"> {/* px-12 adds spacing between loops */}
            <p className="text-lg text-gray-200">{message}</p>
            <div className="ml-24"> {/* ml-24 adds space between the message and the timer */}
                <CountdownTimer />
            </div>
        </div>
    );

    return (
        // The "viewport" for the marquee. It's fixed at the bottom and hides overflow.
        <footer className="absolute bottom-0 left-0 w-full h-14 bg-black/60 backdrop-blur-sm overflow-hidden flex items-center">

            {/* This container holds the duplicated content and has the animation class applied. */}
            <div className="flex whitespace-nowrap animate-marquee">
                <MarqueeContent />
                <MarqueeContent /> {/* We render the content twice to create a seamless loop */}
            </div>

        </footer>
    );
}

export default BottomBar;