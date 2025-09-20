import React, { useState, useEffect } from 'react';

const IslamicAnalogClock = ({
    prayerTimes = {},
    colors = {},
    showPrayerTimes = true,
    borderDesign = 'simple',
    showArabicNumerals = false,
}) => {
    const [time, setTime] = useState(new Date());

    // Define default colors
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

    // Merge user-provided colors with defaults
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
        const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

        return { secondDeg, minuteDeg, hourDeg };
    };

    const parseTimeToDegrees = (timeStr: string) => {
        if (!timeStr) return 0;
        const [timePart, modifier] = timeStr.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return (hours / 12) * 360 + (minutes / 60) * 30;
    };

    const { secondDeg, minuteDeg, hourDeg } = getRotationDegrees();
    const arabicNumerals = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢'];
    const center = 100; // SVG coordinate system center
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
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = center + radius * Math.sin(angle);
                const y1 = center - radius * Math.cos(angle);
                const x2 = center + (radius - 5) * Math.sin(angle);
                const y2 = center - (radius - 5) * Math.cos(angle);
                const numeralX = center + (radius - 15) * Math.sin(angle);
                const numeralY = center - (radius - 15) * Math.cos(angle);
                const numeral = showArabicNumerals ? arabicNumerals[i] : i + 1;

                return (
                    <g key={`marker-${i}`}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={themeColors.numeralsColor} strokeWidth="2" />
                        <text
                            x={numeralX}
                            y={numeralY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={themeColors.numeralsColor}
                            fontSize="12"
                            fontFamily="Arial, sans-serif"
                        >
                            {numeral}
                        </text>
                    </g>
                );
            })}

            {/* Prayer Time Markers */}
            {showPrayerTimes &&
                Object.entries(prayerTimes).map(([name, time]) => {
                    if (!time) return null;
                    const angle = parseTimeToDegrees(time as string);
                    const textAngle = angle + 90; // for proper text orientation
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
                            <text
                                x={center}
                                y={center - radius - 6}
                                transform={`rotate(${-textAngle} ${center} ${center - radius - 6})`}
                                textAnchor="middle"
                                fontSize="6"
                                fill={themeColors.prayerTimeTextColor}
                                fontWeight="bold"
                            >
                                {name}
                            </text>
                        </g>
                    );
                })}

            {/* Clock Hands */}
            <g>
                <line
                    x1={center}
                    y1={center}
                    x2={center}
                    y2={center - 50}
                    stroke={themeColors.hourHandColor}
                    strokeWidth="5"
                    strokeLinecap="round"
                    transform={`rotate(${hourDeg} ${center} ${center})`}
                />
                <line
                    x1={center}
                    y1={center}
                    x2={center}
                    y2={center - 75}
                    stroke={themeColors.minuteHandColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform={`rotate(${minuteDeg} ${center} ${center})`}
                />
                <line
                    x1={center}
                    y1={center + 20}
                    x2={center}
                    y2={center - 80}
                    stroke={themeColors.secondHandColor}
                    strokeWidth="1.5"
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