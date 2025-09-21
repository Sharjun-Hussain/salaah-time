import React, { useState, useEffect, useRef } from 'react';

interface IslamicAnalogClockProps {
    colors?: { [key: string]: string };
    borderDesign?: 'simple' | 'geometric';
    showArabicNumerals?: boolean;
}

const IslamicAnalogClock: React.FC<IslamicAnalogClockProps> = ({
    colors = {},
    borderDesign = 'simple',
    showArabicNumerals = false,
}) => {
    const [time, setTime] = useState(new Date());
    // Use a ref to hold the animation frame ID
    const animationFrameId = useRef<number>();

    const defaultColors = {
        faceColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#4A90E2', // Primary blue
        borderTrackColor: 'rgba(74, 144, 226, 0.2)', // Faded blue for the track
        gradientStartColor: '#50E3C2', // Secondary green
        gradientEndColor: '#4A90E2',   // Primary blue
        numeralsColor: '#1A202C',
        centerDotColor: '#FFD700',
        hourHandColor: '#1A202C',
        minuteHandColor: '#4A90E2',
        secondHandColor: '#FF5733',
    };

    const themeColors = { ...defaultColors, ...colors };

    // EFFECT FOR SMOOTH ANIMATION
    useEffect(() => {
        const animate = () => {
            setTime(new Date());
            animationFrameId.current = requestAnimationFrame(animate);
        };
        // Start the animation loop
        animationFrameId.current = requestAnimationFrame(animate);

        // Cleanup function to cancel the animation when the component unmounts
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    const getRotationDegrees = () => {
        const seconds = time.getSeconds();
        const milliseconds = time.getMilliseconds();
        const minutes = time.getMinutes();
        const hours = time.getHours();

        // SMOOTH SECOND HAND CALCULATION: Use milliseconds for a continuous value
        const continuousSeconds = seconds + milliseconds / 1000;
        const secondDeg = (continuousSeconds / 60) * 360;

        // Minute and hour hands also get smoother movement based on the seconds
        const minuteDeg = (minutes / 60) * 360 + (continuousSeconds / 60) * 6;
        const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30;

        return { secondDeg, minuteDeg, hourDeg };
    };

    const { secondDeg, minuteDeg, hourDeg } = getRotationDegrees();
    const arabicNumerals = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢'];
    const center = 100;
    const radius = 90;
    const borderR = 98; // Radius for the border
    const borderCircumference = borderR * 2 * Math.PI;

    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" aria-label="Islamic Analog Clock">
            <defs>
                {/* GRADIENT DEFINITION for the border arc */}
                <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={themeColors.gradientStartColor} stopOpacity="1" />
                    <stop offset="100%" stopColor={themeColors.gradientEndColor} stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Clock Face and Border */}
            <circle cx={center} cy={center} r={radius} fill={themeColors.faceColor} />

            {/* 1. Static Background Border Track */}
            <circle cx={center} cy={center} r={borderR} fill="none" stroke={themeColors.borderTrackColor} strokeWidth="4" />

            {/* 2. Dynamic Gradient Arc that follows the second hand */}
            <circle
                cx={center}
                cy={center}
                r={borderR}
                fill="none"
                stroke="url(#borderGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                // This creates an arc that is 25% of the circle's length
                strokeDasharray={`${borderCircumference * 0.25} ${borderCircumference * 0.75}`}
                // The rotation is synced with the second hand
                transform={`rotate(${secondDeg - 90} ${center} ${center})`}
            />

            {borderDesign === 'geometric' && (
                <circle cx={center} cy={center} r="92" fill="none" stroke={themeColors.borderColor} strokeWidth="1" strokeDasharray="4 8" />
            )}

            {/* Hour/Minute Markers and Numerals */}
            {Array.from({ length: 12 }).map((_, i) => {
                const numeral = i + 1;
                const angleRad = (numeral * 30 * Math.PI) / 180;
                const x1 = center + radius * Math.sin(angleRad);
                const y1 = center - radius * Math.cos(angleRad);
                const x2 = center + (radius - 5) * Math.sin(angleRad);
                const y2 = center - (radius - 5) * Math.cos(angleRad);
                const numeralX = center + (radius - 18) * Math.sin(angleRad);
                const numeralY = center - (radius - 18) * Math.cos(angleRad);
                const displayNumeral = showArabicNumerals ? arabicNumerals[i] : numeral;
                return (
                    <g key={`marker-${i}`}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={themeColors.numeralsColor} strokeWidth="2" />
                        <text x={numeralX} y={numeralY} textAnchor="middle" dominantBaseline="middle" fill={themeColors.numeralsColor} fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">
                            {displayNumeral}
                        </text>
                    </g>
                );
            })}

            {/* Clock Hands */}
            <g>
                <line x1={center} y1={center} x2={center} y2={center - 50} stroke={themeColors.hourHandColor} strokeWidth="5" strokeLinecap="round" transform={`rotate(${hourDeg} ${center} ${center})`} />
                <line x1={center} y1={center} x2={center} y2={center - 75} stroke={themeColors.minuteHandColor} strokeWidth="3" strokeLinecap="round" transform={`rotate(${minuteDeg} ${center} ${center})`} />
                <line x1={center} y1={center + 20} x2={center} y2={center - 80} stroke={themeColors.secondHandColor} strokeWidth="1.5" transform={`rotate(${secondDeg} ${center} ${center})`} />
            </g>

            {/* Center Dot */}
            <circle cx={center} cy={center} r="6" fill={themeColors.centerDotColor} />
            <circle cx={center} cy={center} r="2" fill={themeColors.secondHandColor} />
        </svg>
    );
};

export default IslamicAnalogClock;