import React, { useState, useEffect, useRef } from 'react';

interface IslamicAnalogClockProps {
    colors?: { [key: string]: string };
    borderDesign?: 'simple' | 'geometric' | 'islamic';
    showArabicNumerals?: boolean;
    showDecorativeElements?: boolean;
}

const IslamicAnalogClock: React.FC<IslamicAnalogClockProps> = ({
    colors = {},
    borderDesign = 'islamic',
    showArabicNumerals = true,
    showDecorativeElements = true,
}) => {
    const [time, setTime] = useState(new Date());
    const animationFrameId = useRef<number>();

    // Professional color palette with Islamic aesthetic
    const defaultColors = {
        faceColor: 'rgba(253, 253, 250, 0.95)', // Soft ivory
        numeralsColor: '#2C3E50',
        hourHandColor: '#2C3E50',
        minuteHandColor: '#3498DB',
        secondHandColor: '#E74C3C',
        handShadowColor: 'rgba(0, 0, 0, 0.2)',
        arc1_colorA: '#16A085', // Islamic green
        arc1_colorB: '#2980B9', // Islamic blue
        arc2_colorA: '#8E44AD', // Royal purple
        arc2_colorB: '#E67E22', // Warm orange
        decorativeColor: '#D4AF37', // Gold for decorative elements
        centerPinColor: '#2C3E50',
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

    // Generate Islamic geometric pattern for the border
    const generateGeometricPattern = () => {
        if (borderDesign !== 'geometric') return null;

        const patterns = [];
        const segments = 24;
        const patternSize = 8;

        for (let i = 0; i < segments; i++) {
            const angle = (i * 360 / segments) - 90;
            const radian = angle * Math.PI / 180;
            const x = center + (borderR - patternSize / 2) * Math.cos(radian);
            const y = center + (borderR - patternSize / 2) * Math.sin(radian);

            patterns.push(
                <rect
                    key={`pattern-${i}`}
                    x={x - patternSize / 2}
                    y={y - patternSize / 2}
                    width={patternSize}
                    height={patternSize}
                    fill={themeColors.decorativeColor}
                    opacity="0.7"
                    transform={`rotate(${angle + 45} ${x} ${y})`}
                />
            );
        }

        return patterns;
    };

    // Generate Islamic art motifs
    const generateIslamicMotifs = () => {
        if (!showDecorativeElements) return null;

        const motifs = [];
        const segments = 8;

        for (let i = 0; i < segments; i++) {
            const angle = i * (360 / segments);
            const radian = angle * Math.PI / 180;
            const distance = radius - 25;
            const x = center + distance * Math.cos(radian);
            const y = center + distance * Math.sin(radian);

            motifs.push(
                <path
                    key={`motif-${i}`}
                    d="M-5,-5 C-5,-8 -8,-10 -10,-10 C-12,-10 -15,-8 -15,-5 C-15,-2 -12,0 -10,0 C-8,0 -5,-2 -5,-5 Z"
                    fill={themeColors.decorativeColor}
                    opacity="0.4"
                    transform={`translate(${x} ${y}) rotate(${angle})`}
                />
            );
        }

        return motifs;
    };

    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" aria-label="Professional Kinetic Islamic Analog Clock">
            <defs>
                {/* Gradients for the arcs */}
                <linearGradient id="arc1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={themeColors.arc1_colorA} />
                    <stop offset="100%" stopColor={themeColors.arc1_colorB} />
                </linearGradient>
                <linearGradient id="arc2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={themeColors.arc2_colorA} />
                    <stop offset="100%" stopColor={themeColors.arc2_colorB} />
                </linearGradient>

                {/* Masks for the arcs */}
                <mask id="arc1Mask">
                    <circle cx={center} cy={center} r={borderR} fill="transparent" stroke="white" strokeWidth="4"
                        strokeDasharray={`${borderCircumference * 0.6} ${borderCircumference * 0.4}`}
                        strokeLinecap="round"
                    />
                </mask>
                <mask id="arc2Mask">
                    <circle cx={center} cy={center} r={borderR} fill="transparent" stroke="white" strokeWidth="4"
                        strokeDasharray={`${borderCircumference * 0.4} ${borderCircumference * 0.6}`}
                        strokeLinecap="round"
                    />
                </mask>

                {/* Filter for hand shadows */}
                <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                    <feOffset dx="1" dy="1" result="offsetblur" />
                    <feFlood floodColor={themeColors.handShadowColor} floodOpacity="0.3" />
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Subtle radial gradient for the clock face */}
                <radialGradient id="faceGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor={themeColors.faceColor} stopOpacity="1" />
                    <stop offset="100%" stopColor={themeColors.faceColor} stopOpacity="0.95" />
                </radialGradient>
            </defs>

            {/* Clock background with subtle gradient */}
            <circle cx={center} cy={center} r={radius} fill="url(#faceGradient)" stroke="#E0E0E0" strokeWidth="0.5" />

            {/* Decorative Islamic motifs */}
            {generateIslamicMotifs()}

            {/* Border track */}
            <circle cx={center} cy={center} r={borderR} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4" />

            {/* Animated border elements */}
            <rect x="0" y="0" width="200" height="200" fill="url(#arc1Gradient)" mask="url(#arc1Mask)" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="12s" repeatCount="indefinite" />
            </rect>
            <rect x="0" y="0" width="200" height="200" fill="url(#arc2Gradient)" mask="url(#arc2Mask)" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="18s" repeatCount="indefinite" />
            </rect>

            {/* Geometric border pattern (if selected) */}
            {borderDesign === 'geometric' && generateGeometricPattern()}

            {/* Hour markers */}
            {Array.from({ length: 60 }).map((_, i) => (
                <line
                    key={`m-${i}`}
                    x1={center}
                    y1={center - radius}
                    x2={center}
                    y2={center - radius + (i % 5 === 0 ? 8 : 4)}
                    stroke={i % 5 === 0 ? themeColors.numeralsColor : "#BDC3C7"}
                    strokeWidth={i % 5 === 0 ? 2 : 1}
                    transform={`rotate(${i * 6} ${center} ${center})`}
                />
            ))}

            {/* Numerals */}
            {Array.from({ length: 12 }).map((_, i) => {
                const numeral = i + 1;
                const angleRad = (numeral * 30 * Math.PI) / 180;
                const numeralX = center + (radius - 20) * Math.sin(angleRad);
                const numeralY = center - (radius - 20) * Math.cos(angleRad);
                const displayNumeral = showArabicNumerals ? arabicNumerals[i] : numeral;

                return (
                    <text
                        key={`n-${i}`}
                        x={numeralX}
                        y={numeralY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={themeColors.numeralsColor}
                        fontSize="14"
                        fontWeight="600"
                        fontFamily={showArabicNumerals ? "'Scheherazade New', serif" : "'Open Sans', sans-serif"}
                    >
                        {displayNumeral}
                    </text>
                );
            })}

            {/* Clock Hands with Shadows */}
            <g filter="url(#handShadow)">
                {/* Hour hand with decorative element */}
                <line x1={center} y1={center + 10} x2={center} y2={center - 45} stroke={themeColors.hourHandColor} strokeWidth="6" strokeLinecap="round" transform={`rotate(${hourDeg} ${center} ${center})`} />
                <circle cx={center} cy={center + 12} r="4" fill={themeColors.hourHandColor} transform={`rotate(${hourDeg} ${center} ${center})`} />

                {/* Minute hand */}
                <line x1={center} y1={center + 12} x2={center} y2={center - 70} stroke={themeColors.minuteHandColor} strokeWidth="4" strokeLinecap="round" transform={`rotate(${minuteDeg} ${center} ${center})`} />

                {/* Second hand with counterweight */}
                <line x1={center} y1={center + 25} x2={center} y2={center - 80} stroke={themeColors.secondHandColor} strokeWidth="2" strokeLinecap="round" transform={`rotate(${secondDeg} ${center} ${center})`} />
                <circle cx={center} cy={center + 20} r="3" fill={themeColors.secondHandColor} transform={`rotate(${secondDeg} ${center} ${center})`} />
            </g>

            {/* Center Pin with decorative elements */}
            <circle cx={center} cy={center} r="8" fill={themeColors.centerPinColor} opacity="0.9" />
            <circle cx={center} cy={center} r="6" fill={themeColors.decorativeColor} opacity="0.7" />
            <circle cx={center} cy={center} r="3" fill={themeColors.secondHandColor} />

            {/* Subtle outer ring */}
            <circle cx={center} cy={center} r={borderR} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        </svg>
    );
};

export default IslamicAnalogClock;