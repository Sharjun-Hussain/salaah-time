import React, { useState, useEffect } from 'react';
import { FiSunrise, FiSun, FiSunset, FiMoon } from 'react-icons/fi';
import { FaCloudSun } from "react-icons/fa";
import { PrayerTime } from '../types'; // Ensure your types are in './types'
import PrayerTimeItem from './PrayerTimeItem';
import IslamicAnalogClock from './Clock/Clock'; // Ensure your clock is in this path

interface PrayerTimesPanelProps {
    prayerTimes: PrayerTime[];
}

const PrayerTimesPanel: React.FC<PrayerTimesPanelProps> = ({ prayerTimes }) => {
    const [activePrayerIndex, setActivePrayerIndex] = useState<number | null>(null);

    const icons: Record<PrayerTime['name'], React.ReactNode> = {
        Shubuh: <FiSunrise />,
        Luhar: <FiSun />,
        Asr: <FaCloudSun />,
        Maghrib: <FiSunset />,
        Isha: <FiMoon />,
    };

    // This hook efficiently checks for the active prayer once per minute.
    useEffect(() => {
        const updateActivePrayer = () => {
            const now = new Date();
            let currentPrayerIndex = -1;
            const prayerDates = prayerTimes.map(p => {
                const [hours, minutes] = p.time.split(':').map(Number);
                const date = new Date();
                date.setHours(hours, minutes, 0, 0);
                return date;
            });
            for (let i = 0; i < prayerDates.length; i++) {
                if (prayerDates[i] <= now) {
                    currentPrayerIndex = i;
                }
            }
            setActivePrayerIndex(currentPrayerIndex);
        };
        updateActivePrayer();
        const interval = setInterval(updateActivePrayer, 60000); // Check once a minute
        return () => clearInterval(interval);
    }, [prayerTimes]);

    return (
        // Main container with a modern, semi-transparent background
        <div className="bg-black/25 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
            <div className="flex flex-col xl:flex-row items-center justify-center gap-8">

                {/* Prayer Times List */}
                <div className="w-full flex-shrink-0 xl:w-auto flex flex-col gap-2">
                    {/* Headers for the columns */}
                    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 text-sm font-bold text-gray-400 px-3 pb-2 border-b border-white/10">
                        <div /> {/* Empty cell for icon column */}
                        <p>Prayer</p>
                        <p className="text-right">Adhan</p>
                        <p className="text-right">Iqamah</p>
                    </div>

                    {/* The list of prayers */}
                    {prayerTimes.map((prayer, index) => (
                        <PrayerTimeItem
                            key={prayer.name}
                            icon={icons[prayer.name]}
                            name={prayer.name}
                            time={prayer.time}
                            iqamah={prayer.iqamah}
                            isActive={index === activePrayerIndex}
                        />
                    ))}
                </div>

                {/* A well-proportioned container for the clock */}
                <div className="w-64 h-64 md:w-72 md:h-72 flex-shrink-0">
                    <IslamicAnalogClock />
                </div>
            </div>
        </div>
    );
}

export default PrayerTimesPanel;