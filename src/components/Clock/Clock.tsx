import React, { useState, useEffect, useRef } from 'react';

// --- Interface (no change) ---
interface IslamicAnalogClockProps {
    colors?: { [key: string]: string };
    borderDesign?: 'simple' | 'islamic'; // Removed 'geometric' for simplicity
    showArabicNumerals?: boolean;
    showDecorativeElements?: boolean;
}

const IslamicAnalogClock: React.FC<IslamicAnalogClockProps> = ({
    colors = {},
    borderDesign = 'islamic',
    showArabicNumerals = false,
    showDecorativeElements = true, // Enabled by default for a richer look
}) => {
    const [time, setTime] = useState(new Date());
    const animationFrameId = useRef<number>();

    // A refined, high-contrast color palette
    const defaultColors = {
        faceColor: '#FFFFFF', // Clean white face
        numeralsColor: '#2C3E50', // Dark Slate
        hourHandColor: '#2C3E50',
        minuteHandColor: '#3498DB', // Bright Blue
        secondHandColor: '#E74C3C', // Bright Red
        handShadowColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(44, 62, 80, 0.1)', // Subtle border track
        glowColor: '#3498DB', // A single, clean glow color
        decorativeColor: '#D4AF37', // Gold
        centerPinColor: '#2C3E50',
    };

    const themeColors = { ...defaultColors, ...colors };

    // Smooth animation loop using requestAnimationFrame (most efficient)
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

    // Smooth hand calculation logic
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

    // Generate Islamic star pattern for the border
    const generateIslamicBorder = () => {
        if (borderDesign !== 'islamic') return null;
        const points = 8;
        const pathData = Array.from({ length: points * 2 }).map((_, i) => {
            const angle = (i * 360) / (points * 2);
            const r = i % 2 === 0 ? borderR : borderR - 5;
            const x = center + r * Math.cos(angle * Math.PI / 180 - Math.PI / 2);
            const y = center + r * Math.sin(angle * Math.PI / 180 - Math.PI / 2);
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(' ');
        return <path d={`${pathData} Z`} fill={themeColors.borderColor} />;
    };

    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" aria-label="Lightweight Islamic Analog Clock">
            <defs>
                {/* Simplified filter for a subtle glow */}
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Simplified filter for hand shadows */}
                <filter id="handShadow">
                    <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor={themeColors.handShadowColor} floodOpacity="0.3" />
                </filter>
            </defs>

            {/* Background and Border */}
            <circle cx={center} cy={center} r="100" fill="#f4f4f4" />
            {borderDesign === 'islamic' ? generateIslamicBorder() : <circle cx={center} cy={center} r={borderR} fill="none" stroke={themeColors.borderColor} strokeWidth="1" />}
            <circle cx={center} cy={center} r={radius} fill={themeColors.faceColor} />

            {/* THE NEW LIGHTWEIGHT BORDER ANIMATION */}
            {/* This is a single arc with a glow effect that rotates with the second hand. */}
            <circle
                cx={center}
                cy={center}
                r={borderR}
                fill="none"
                stroke={themeColors.glowColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${borderCircumference * 0.25} ${borderCircumference * 0.75}`} // 25% arc
                filter="url(#glow)"
                transform={`rotate(${secondDeg - 90} ${center} ${center})`}
            />

            {/* Decorative Motifs */}
            {showDecorativeElements && Array.from({ length: 4 }).map((_, i) => (
                <circle key={`motif-${i}`} cx={center} cy={center} r={radius - 25} fill="none" stroke={themeColors.decorativeColor} strokeWidth="0.5" opacity="0.5"
                    transform={`rotate(${i * 90} ${center} ${center})`} />
            ))}

            {/* Hour Markers */}
            {Array.from({ length: 12 }).map((_, i) => (
                <line key={`h-marker-${i}`} x1={center} y1={center - radius} x2={center} y2={center - radius + 8} stroke={themeColors.numeralsColor} strokeWidth={2} transform={`rotate(${i * 30} ${center} ${center})`} />
            ))}

            {/* Numerals */}
            {Array.from({ length: 12 }).map((_, i) => {
                const numeral = i + 1;
                const angleRad = (numeral * 30 * Math.PI) / 180;
                const numeralX = center + (radius - 20) * Math.sin(angleRad);
                const numeralY = center - (radius - 20) * Math.cos(angleRad);
                const displayNumeral = showArabicNumerals ? arabicNumerals[i] : numeral;
                return (
                    <text key={`n-${i}`} x={numeralX} y={numeralY} textAnchor="middle" dominantBaseline="middle" fill={themeColors.numeralsColor} fontSize="14" fontWeight="600" fontFamily="sans-serif">
                        {displayNumeral}
                    </text>
                );
            })}

            {/* Clock Hands */}
            <g filter="url(#handShadow)">
                <line x1={center} y1={center} x2={center} y2={center - 45} stroke={themeColors.hourHandColor} strokeWidth="6" strokeLinecap="round" transform={`rotate(${hourDeg} ${center} ${center})`} />
                <line x1={center} y1={center} x2={center} y2={center - 70} stroke={themeColors.minuteHandColor} strokeWidth="4" strokeLinecap="round" transform={`rotate(${minuteDeg} ${center} ${center})`} />
                <line x1={center} y1={center + 20} x2={center} y2={center - 80} stroke={themeColors.secondHandColor} strokeWidth="2" strokeLinecap="round" transform={`rotate(${secondDeg} ${center} ${center})`} />
            </g>

            {/* Center Pin */}
            <circle cx={center} cy={center} r="6" fill={themeColors.centerPinColor} />
            <circle cx={center} cy={center} r="2" fill={themeColors.secondHandColor} />
        </svg>
    );
};

export default IslamicAnalogClock;