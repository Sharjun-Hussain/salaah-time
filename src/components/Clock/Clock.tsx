import React, { useState, useEffect } from 'react';

interface IslamicAnalogClockProps {
    prayerTimes?: { [key: string]: string }; // Note: This prop isn't used within the clock itself, but might be passed.
    colors?: { [key: string]: string };
    showPrayerTimes?: boolean;
    borderDesign?: 'simple' | 'geometric';
    showArabicNumerals?: boolean;
}

const IslamicAnalogClock: React.FC<IslamicAnalogClockProps> = ({
    colors = {},
    // Removed prayerTimes, showPrayerTimes as they are not used in this specific clock display
    borderDesign = 'simple',
    showArabicNumerals = false,
}) => {
    const [time, setTime] = useState(new Date());

    const defaultColors = {
        faceColor: 'rgba(255, 255, 255, 0.95)', // Slightly translucent white for modernity
        borderColor: '#4A90E2', // Primary blue for border
        numeralsColor: '#1A202C', // Dark background color for numerals
        centerDotColor: '#FFD700', // Accent gold for center
        hourHandColor: '#1A202C',
        minuteHandColor: '#4A90E2',
        secondHandColor: '#FF5733', // A bright contrasting color
        prayerTimeMarkerColor: '#50E3C2', // Secondary green
        prayerTimeTextColor: '#008000', // Unused in this version, but kept for consistency
    };

    const themeColors = { ...defaultColors, ...colors };

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const getRotationDegrees = () => {
        const seconds = time.getSeconds();
        const minutes = time.getMinutes();
        const hours = time.getHours();
        const secondDeg = (seconds / 60) * 360;
        const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
        const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30;
        return { secondDeg, minuteDeg, hourDeg };
    };

    const { secondDeg, minuteDeg, hourDeg } = getRotationDegrees();
    const arabicNumerals = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢'];
    const center = 100;
    const radius = 90;

    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" aria-label="Islamic Analog Clock">
            {/* Clock Face and Border */}
            <circle cx={center} cy={center} r="98" fill="none" stroke={themeColors.borderColor} strokeWidth="4" />
            {borderDesign === 'geometric' && (
                <circle
                    cx={center}
                    cy={center}
                    r="92"
                    fill="none"
                    stroke={themeColors.borderColor}
                    strokeWidth="1"
                    strokeDasharray="4 8"
                />
            )}
            <circle cx={center} cy={center} r={radius} fill={themeColors.faceColor} />

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
                        <text
                            x={numeralX}
                            y={numeralY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={themeColors.numeralsColor}
                            fontSize="14"
                            fontWeight="bold"
                            fontFamily="Arial, sans-serif"
                        >
                            {displayNumeral}
                        </text>
                    </g>
                );
            })}

            {/* Clock Hands */}
            <g>
                <line
                    x1={center} y1={center} x2={center} y2={center - 50}
                    stroke={themeColors.hourHandColor} strokeWidth="5" strokeLinecap="round"
                    transform={`rotate(${hourDeg} ${center} ${center})`}
                />
                <line
                    x1={center} y1={center} x2={center} y2={center - 75}
                    stroke={themeColors.minuteHandColor} strokeWidth="3" strokeLinecap="round"
                    transform={`rotate(${minuteDeg} ${center} ${center})`}
                />
                <line
                    x1={center} y1={center + 20} x2={center} y2={center - 80}
                    stroke={themeColors.secondHandColor} strokeWidth="1.5"
                    transform={`rotate(${secondDeg} ${center} ${center})`}
                />
            </g>

            {/* Center Dot */}
            <circle cx={center} cy={center} r="6" fill={themeColors.centerDotColor} />
            <circle cx={center} cy={center} r="2" fill={themeColors.secondHandColor} />
        </svg>
    );
};

export default IslamicAnalogClock;