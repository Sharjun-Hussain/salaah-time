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


    // Refined color palette for the new effects
    const defaultColors = {
        faceStartColor: 'rgba(245, 247, 250, 0.95)', // Lighter center
        faceEndColor: 'rgba(220, 225, 230, 0.95)',   // Darker edge for 3D effect
        borderTrackColor: 'rgba(74, 144, 226, 0.15)',// Dim track for the glow
        glowColor: '#50E3C2',                       // Vibrant teal for the glow
        numeralsColor: '#1A202C',
        centerDotColor: '#FFD700',
        hourHandColor: '#1A202C',
        minuteHandColor: '#4A90E2',
        secondHandColor: '#FF5733',
    };

    const themeColors = { ...defaultColors, ...colors };

    // Using requestAnimationFrame for perfectly smooth animations
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

    // Calculation for smooth hand movements
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
        <svg width="100%" height="100%" viewBox="0 0 200 200" aria-label="Islamic Analog Clock">
            <defs>
                {/* EFFECT 1: Definition for the GLOW */}
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* EFFECT 2: Definition for the 3D CLOCK FACE */}
                <radialGradient id="faceGradient">
                    <stop offset="0%" stopColor={themeColors.faceStartColor} />
                    <stop offset="100%" stopColor={themeColors.faceEndColor} />
                </radialGradient>

                {/* EFFECT 3: Definition for the HAND SHADOWS */}
                <filter id="handShadow">
                    <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.3" />
                </filter>
            </defs>

            {/* Clock Face with 3D gradient and Border */}
            <circle cx={center} cy={center} r={radius} fill="url(#faceGradient)" />
            <circle cx={center} cy={center} r={borderR} fill="none" stroke={themeColors.borderTrackColor} strokeWidth="1" />

            {/* The Dynamic Glowing Arc */}
            <circle
                cx={center}
                cy={center}
                r={borderR}
                fill="none"
                stroke={themeColors.glowColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${borderCircumference * 0.20} ${borderCircumference * 0.80}`} // A 20% arc
                filter="url(#glow)"
                transform={`rotate(${secondDeg - 90} ${center} ${center})`}
            />

            {/* EFFECT 4: Detailed Minute/Second Markers */}
            {Array.from({ length: 60 }).map((_, i) => {
                const angleRad = (i * 6 * Math.PI) / 180;
                const isHourMarker = i % 5 === 0;
                const startRadius = isHourMarker ? radius - 8 : radius - 5;
                const x1 = center + radius * Math.sin(angleRad);
                const y1 = center - radius * Math.cos(angleRad);
                const x2 = center + startRadius * Math.sin(angleRad);
                const y2 = center - startRadius * Math.cos(angleRad);

                // We don't draw on top of the main hour markers, which are handled below
                if (isHourMarker) return null;

                return (
                    <line key={`minute-marker-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={themeColors.numeralsColor} strokeWidth="0.5" />
                );
            })}

            {/* Hour Markers and Numerals */}
            {Array.from({ length: 12 }).map((_, i) => {
                const numeral = i + 1;
                const angleRad = (numeral * 30 * Math.PI) / 180;
                const numeralX = center + (radius - 18) * Math.sin(angleRad);
                const numeralY = center - (radius - 18) * Math.cos(angleRad);
                const displayNumeral = showArabicNumerals ? arabicNumerals[i] : numeral;
                return (
                    <g key={`marker-${i}`}>
                        <text x={numeralX} y={numeralY} textAnchor="middle" dominantBaseline="middle" fill={themeColors.numeralsColor} fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">
                            {displayNumeral}
                        </text>
                    </g>
                );
            })}

            {/* Clock Hands with Shadows */}
            <g filter="url(#handShadow)">
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