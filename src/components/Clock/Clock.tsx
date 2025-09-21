import React, { useState, useEffect, useRef } from 'react';

// Interface remains the same
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
    const animationFrameId = useRef<number>();

    // A vibrant palette for the multi-layered animated gradients
    const defaultColors = {
        faceColor: 'rgba(255, 255, 255, 0.98)', // A clean, solid white face
        numeralsColor: '#1A202C',
        hourHandColor: '#1A202C',
        minuteHandColor: '#2B6CB0', // Blued Steel
        secondHandColor: '#D00000', // Ruby Red
        handShadowColor: '#000000',
        // Gradients for the two counter-rotating arcs
        arc1_colorA: '#50E3C2', // Teal
        arc1_colorB: '#4A90E2', // Blue
        arc2_colorA: '#8A2BE2', // BlueViolet
        arc2_colorB: '#FF69B4', // HotPink
    };

    const themeColors = { ...defaultColors, ...colors };

    // Smooth animation logic using requestAnimationFrame
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
    const borderR = 98;
    const borderCircumference = borderR * 2 * Math.PI;

    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" aria-label="Kinetic Gradient Islamic Analog Clock">
            <defs>
                {/* --- DEFINITIONS FOR THE DUAL ANIMATED BORDER --- */}

                {/* Gradient for the first (clockwise) arc */}
                <linearGradient id="arc1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={themeColors.arc1_colorA} />
                    <stop offset="100%" stopColor={themeColors.arc1_colorB} />
                </linearGradient>

                {/* Gradient for the second (counter-clockwise) arc */}
                <linearGradient id="arc2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={themeColors.arc2_colorA} />
                    <stop offset="100%" stopColor={themeColors.arc2_colorB} />
                </linearGradient>

                {/* Mask 1: A 60% arc for the clockwise gradient */}
                <mask id="arc1Mask">
                    <circle cx={center} cy={center} r={borderR} fill="transparent" stroke="white" strokeWidth="4"
                        strokeDasharray={`${borderCircumference * 0.6} ${borderCircumference * 0.4}`}
                        strokeLinecap="round"
                    />
                </mask>

                {/* Mask 2: A 40% arc for the counter-clockwise gradient */}
                <mask id="arc2Mask">
                    <circle cx={center} cy={center} r={borderR} fill="transparent" stroke="white" strokeWidth="4"
                        strokeDasharray={`${borderCircumference * 0.4} ${borderCircumference * 0.6}`}
                        strokeLinecap="round"
                    />
                </mask>

                {/* Filter for hand shadows */}
                <filter id="handShadow">
                    <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor={themeColors.handShadowColor} floodOpacity="0.2" />
                </filter>
            </defs>

            {/* --- CLOCK CONSTRUCTION --- */}

            {/* The clean, white clock face */}
            <circle cx={center} cy={center} r={radius} fill={themeColors.faceColor} />

            {/* A subtle track for the border */}
            <circle cx={center} cy={center} r={borderR} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4" />

            {/* BORDER EFFECT 1: A gradient rectangle masked into a 60% arc, animated CLOCKWISE */}
            <rect x="0" y="0" width="200" height="200" fill="url(#arc1Gradient)" mask="url(#arc1Mask)">
                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite" />
            </rect>

            {/* BORDER EFFECT 2: A second gradient rectangle masked into a 40% arc, animated COUNTER-CLOCKWISE */}
            <rect x="0" y="0" width="200" height="200" fill="url(#arc2Gradient)" mask="url(#arc2Mask)">
                <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="15s" repeatCount="indefinite" />
            </rect>

            {/* Numerals and Markers (on top of the white face) */}
            {Array.from({ length: 60 }).map((_, i) => (
                <line key={`m-${i}`} x1={center} y1={center - radius} x2={center} y2={center - radius + (i % 5 === 0 ? 6 : 3)} stroke={i % 5 === 0 ? themeColors.numeralsColor : "#A0AEC0"} strokeWidth="1" transform={`rotate(${i * 6} ${center} ${center})`} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => {
                const numeral = i + 1;
                const angleRad = (numeral * 30 * Math.PI) / 180;
                const numeralX = center + (radius - 15) * Math.sin(angleRad);
                const numeralY = center - (radius - 15) * Math.cos(angleRad);
                const displayNumeral = showArabicNumerals ? arabicNumerals[i] : numeral;
                return (
                    <text key={`n-${i}`} x={numeralX} y={numeralY} textAnchor="middle" dominantBaseline="middle" fill={themeColors.numeralsColor} fontSize="16" fontWeight="600" fontFamily="sans-serif">
                        {displayNumeral}
                    </text>
                );
            })}

            {/* Clock Hands with Shadows */}
            <g filter="url(#handShadow)">
                <line x1={center} y1={center} x2={center} y2={center - 50} stroke={themeColors.hourHandColor} strokeWidth="6" strokeLinecap="round" transform={`rotate(${hourDeg} ${center} ${center})`} />
                <line x1={center} y1={center} x2={center} y2={center - 75} stroke={themeColors.minuteHandColor} strokeWidth="4" strokeLinecap="round" transform={`rotate(${minuteDeg} ${center} ${center})`} />
                <line x1={center} y1={center + 20} x2={center} y2={center - 80} stroke={themeColors.secondHandColor} strokeWidth="2" transform={`rotate(${secondDeg} ${center} ${center})`} />
            </g>

            {/* Center Pin */}
            <circle cx={center} cy={center} r="6" fill="#4A5568" />
            <circle cx={center} cy={center} r="2" fill={themeColors.secondHandColor} />
        </svg>
    );
};

export default IslamicAnalogClock;