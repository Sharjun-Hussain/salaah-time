import React, { useEffect, useRef, useMemo } from 'react';

interface IslamicAnalogClockProps {
    colors?: { [key: string]: string };
    showArabicNumerals?: boolean;
}

const IslamicAnalogClock: React.FC<IslamicAnalogClockProps> = ({
    colors = {},
    showArabicNumerals = false,
}) => {
    // --- STEP 1: Use refs instead of state for the hands ---
    // This is the key to preventing re-renders. We will control the hands directly.
    const hourHandRef = useRef<SVGLineElement>(null);
    const minuteHandRef = useRef<SVGLineElement>(null);
    const secondHandRef = useRef<SVGLineElement>(null);

    // A clean, static, high-performance color palette
    const themeColors = {
        faceColor: '#FFFFFF',
        borderColor: '#E2E8F0',    // Light Gray
        numeralsColor: '#2D3748',  // Dark Slate
        hourHandColor: '#2D3748',
        minuteHandColor: '#2B6CB0', // Blue
        secondHandColor: '#E53E3E', // Red
        ...colors, // Allow overriding with props
    };

    // --- STEP 2: A single useEffect that runs ONLY ONCE ---
    useEffect(() => {
        let animationFrameId: number;

        // The animation loop is the only thing that runs continuously.
        const animate = () => {
            const now = new Date();
            const seconds = now.getSeconds();
            const minutes = now.getMinutes();
            const hours = now.getHours();
            const milliseconds = now.getMilliseconds();

            const continuousSeconds = seconds + milliseconds / 1000;
            const secondDeg = (continuousSeconds / 60) * 360;
            const minuteDeg = (minutes / 60) * 360 + (continuousSeconds / 60) * 6;
            const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30;

            // Update the hand rotation directly on the DOM, bypassing React.
            if (hourHandRef.current) {
                hourHandRef.current.setAttribute('transform', `rotate(${hourDeg} 100 100)`);
            }
            if (minuteHandRef.current) {
                minuteHandRef.current.setAttribute('transform', `rotate(${minuteDeg} 100 100)`);
            }
            if (secondHandRef.current) {
                secondHandRef.current.setAttribute('transform', `rotate(${secondDeg} 100 100)`);
            }

            // Continue the loop
            animationFrameId = requestAnimationFrame(animate);
        };

        // Start the animation
        animationFrameId = requestAnimationFrame(animate);

        // Cleanup function to stop the animation when the component is removed
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Empty dependency array means this effect runs only once.

    const center = 100;
    const radius = 90;

    // --- STEP 3: Use useMemo for static elements ---
    // This ensures the markers and numerals are calculated only once.
    const markersAndNumerals = useMemo(() => {
        const arabicNumerals = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢'];
        return Array.from({ length: 12 }).map((_, i) => {
            const numeral = i + 1;
            const angleRad = (numeral * 30 * Math.PI) / 180;

            const markerX1 = center + radius * Math.sin(angleRad);
            const markerY1 = center - radius * Math.cos(angleRad);
            const markerX2 = center + (radius - 5) * Math.sin(angleRad);
            const markerY2 = center - (radius - 5) * Math.cos(angleRad);

            const numeralX = center + (radius - 18) * Math.sin(angleRad);
            const numeralY = center - (radius - 18) * Math.cos(angleRad);
            const displayNumeral = showArabicNumerals ? arabicNumerals[i] : numeral;

            return (
                <g key={`marker-${numeral}`}>
                    <line x1={markerX1} y1={markerY1} x2={markerX2} y2={markerY2} stroke={themeColors.numeralsColor} strokeWidth="2" />
                    <text x={numeralX} y={numeralY} textAnchor="middle" dominantBaseline="middle" fill={themeColors.numeralsColor} fontSize="16" fontWeight="600" fontFamily="sans-serif">
                        {displayNumeral}
                    </text>
                </g>
            );
        });
    }, [showArabicNumerals, themeColors]); // Only recalculate if these props change

    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" aria-label="Lightweight Analog Clock">
            {/* The clock face and border are completely static */}
            <circle cx={center} cy={center} r="100" fill={themeColors.borderColor} />
            <circle cx={center} cy={center} r="96" fill={themeColors.faceColor} />

            {/* Render the memoized static elements */}
            {markersAndNumerals}

            {/* The hands are rendered once, then controlled by the useEffect */}
            <g>
                <line ref={hourHandRef} x1={center} y1={center} x2={center} y2={center - 55} stroke={themeColors.hourHandColor} strokeWidth="6" strokeLinecap="round" />
                <line ref={minuteHandRef} x1={center} y1={center} x2={center} y2={center - 80} stroke={themeColors.minuteHandColor} strokeWidth="4" strokeLinecap="round" />
                <line ref={secondHandRef} x1={center} y1={center + 20} x2={center} y2={center - 85} stroke={themeColors.secondHandColor} strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Center Pin */}
            <circle cx={center} cy={center} r="5" fill={themeColors.secondHandColor} />
        </svg>
    );
};

export default IslamicAnalogClock;