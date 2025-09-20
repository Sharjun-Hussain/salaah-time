import React, { useState, useEffect } from 'react';

// Define the props interface for type safety
interface IslamicAnalogClockProps {
    prayerTimes?: { [key: string]: string };
    colors?: { [key: string]: string };
    showPrayerTimes?: boolean;
    borderDesign?: 'simple' | 'geometric';
    showArabicNumerals?: boolean;
}

const IslamicAnalogClock: React.FC<IslamicAnalogClockProps> = ({
    prayerTimes = {},
    colors = {},
    showPrayerTimes = true,
    borderDesign = 'simple',
    showArabicNumerals = false,
}) => {
    const [time, setTime] = useState(new Date());

    const defaultColors = {
        faceColor: '#ffffff',
        borderColor: '#333333',
        numeralsColor: '#000000',
        centerDotColor: '#000000',
        hourHandColor: '#222222',
        minuteHandColor: '#444444',
        secondHandColor: '#ff0000',
        prayerTimeMarkerColor: '#006400',
        prayerTimeTextColor: '#008000',
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
        const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30; // Use modulo 12 for hours
        return { secondDeg, minuteDeg, hourDeg };
    };

    /**
     * FIX: This function now correctly handles both 24-hour ("14:30")
     * and 12-hour ("2:30 PM") time formats.
     */
    const parseTimeToDegrees = (timeStr: string | undefined): number => {
        if (!timeStr) return 0;

        let hours: number, minutes: number;

        if (timeStr.includes('AM') || timeStr.includes('PM')) {
            const [timePart, modifier] = timeStr.split(' ');
            [hours, minutes] = timePart.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0; // Midnight case
        } else {
            [hours, minutes] = timeStr.split(':').map(Number);
        }

        const totalHours = hours + minutes / 60;
        return (totalHours % 12) * 30; // Use modulo 12 and convert to degrees
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
                /**
                 * FIX: The angle calculation now correctly corresponds to the numeral (1-12).
                 * The angle for numeral 'n' is n * 30 degrees.
                 */
                const angleRad = (numeral * 30 * Math.PI) / 180;

                // Position for the tick marks
                const x1 = center + radius * Math.sin(angleRad);
                const y1 = center - radius * Math.cos(angleRad);
                const x2 = center + (radius - 5) * Math.sin(angleRad);
                const y2 = center - (radius - 5) * Math.cos(angleRad);

                // Position for the numerals
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

            {/* Prayer Time Markers */}
            {showPrayerTimes &&
                Object.entries(prayerTimes).map(([name, time]) => {
                    const angle = parseTimeToDegrees(time as string);
                    if (time === undefined) return null;

                    return (
                        <g key={name} transform={`rotate(${angle} ${center} ${center})`}>
                            <line
                                x1={center}
                                y1={center - radius + 8}
                                x2={center}
                                y2={center - radius + 14}
                                stroke={themeColors.prayerTimeMarkerColor}
                                strokeWidth="2"
                            />
                            {/* FIX: Simplified and corrected the text rotation to always be upright */}
                            <text
                                x={center}
                                y={center - radius - 8}
                                transform={`rotate(${-angle} ${center} ${center - radius - 8})`}
                                textAnchor="middle"
                                fontSize="7"
                                fill={themeColors.prayerTimeTextColor}
                                fontWeight="bold"
                            >
                                {name.charAt(0).toUpperCase() + name.slice(1)}
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