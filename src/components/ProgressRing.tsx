import React from 'react';

interface ProgressRingProps {
    radius: number;
    stroke: number;
    progress: number; // A value between 0 and 1
}

const ProgressRing: React.FC<ProgressRingProps> = ({ radius, stroke, progress }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <svg
            height={radius * 2}
            width={radius * 2}
            className="-rotate-90"
        >
            {/* Background Track */}
            <circle
                stroke="rgba(255, 255, 255, 0.1)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            {/* Foreground Progress */}
            <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#50E3C2" /> {/* secondary-green */}
                    <stop offset="100%" stopColor="#4A90E2" /> {/* primary-blue */}
                </linearGradient>
            </defs>
            <circle
                stroke="url(#progressGradient)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
        </svg>
    );
};

export default ProgressRing;