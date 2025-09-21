import { useState } from "react";
import React, { useEffect, useRef } from 'react';

interface IslamicAnalogClockProps {
    colors?: { [key: string]: string };
    showArabicNumerals?: boolean;
}

const IslamicAnalogClock: React.FC<IslamicAnalogClockProps> = ({
    colors = {},
    showArabicNumerals = false,
}) => {
    const [time, setTime] = useState(new Date());
    const animationFrameId = useRef<number>();

    // A simple, high-contrast, lightweight color palette
    const defaultColors = {
        faceColor: '#1A202C',      // Dark Charcoal
        borderColor: '#4A5568',    // Gray Slate
        numeralsColor: '#E2E8F0',  // Light Gray
        handColor: '#FFFFFF',      // White
        secondHandColor: '#38B2AC', // A calming Teal
    };

    const themeColors = { ...defaultColors, ...colors };

    // The most performant animation loop for smooth hand movement
    useEffect(() => {
        const animate = () => {
            setTime(new Date());
            animationFrameId.current = requestAnimationFrame(animate);
        };
        animationFrameId.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    // Hand calculation logic for smooth movement
    const getRotationDegrees = () => {
        const seconds = time.getSeconds();
        const milliseconds = time.getMilliseconds();
        const minutes = time.getMinutes();
        const hours = time.getHours();

        const continuousSeconds = seconds + milliseconds / 1000;
        const secondDeg = (continuousSeconds / 60) * 360;
        const minuteDeg = (minutes / 60) * 360 + (continuousSeconds / 60) * 6;
        const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30;

        return { secondDeg, minuteDeg, hourDeg };
    };

    const { secondDeg, minuteDeg, hourDeg } = getRotationDegrees();
    const arabicNumerals = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢'];
    const center = 100;
    const radius = 90;

    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" aria-label="Lightweight Analog Clock">
            {/* Clock Body - Simple and clean */}
            <circle cx={center} cy={center} r="100" fill={themeColors.borderColor} />
            <circle cx={center} cy={center} r={radius} fill={themeColors.faceColor} />

            {/* Hour Markers (Minimalist) */}
            {Array.from({ length: 12 }).map((_, i) => (
                <line
                    key={`h-marker-${i}`}
                    x1={center} y1={center - radius}
                    x2={center} y2={center - radius + 5}
                    stroke={themeColors.numeralsColor}
                    strokeWidth="2"
                    transform={`rotate(${i * 30} ${center} ${center})`}
                />
            ))}

            {/* Numerals (Clean, readable font) */}
            {Array.from({ length: 12 }).map((_, i) => {
                const numeral = i + 1;
                const angleRad = (numeral * 30 * Math.PI) / 180;
                const numeralX = center + (radius - 18) * Math.sin(angleRad);
                const numeralY = center - (radius - 18) * Math.cos(angleRad);
                const displayNumeral = showArabicNumerals ? arabicNumerals[i] : numeral;
                return (
                    <text key={`n-${i}`} x={numeralX} y={numeralY} textAnchor="middle" dominantBaseline="middle" fill={themeColors.numeralsColor} fontSize="16" fontWeight="500" fontFamily="sans-serif">
                        {displayNumeral}
                    </text>
                );
            })}

            {/* Clock Hands (Simple and sharp) */}
            <g>
                <line x1={center} y1={center} x2={center} y2={center - 55} stroke={themeColors.handColor} strokeWidth="5" strokeLinecap="round" transform={`rotate(${hourDeg} ${center} ${center})`} />
                <line x1={center} y1={center} x2={center} y2={center - 80} stroke={themeColors.handColor} strokeWidth="3" strokeLinecap="round" transform={`rotate(${minuteDeg} ${center} ${center})`} />
                <line x1={center} y1={center + 20} x2={center} y2={center - 85} stroke={themeColors.secondHandColor} strokeWidth="2" strokeLinecap="round" transform={`rotate(${secondDeg} ${center} ${center})`} />
            </g>

            {/* Center Pin */}
            <circle cx={center} cy={center} r="4" fill={themeColors.handColor} />
        </svg>
    );
};

export default IslamicAnalogClock;