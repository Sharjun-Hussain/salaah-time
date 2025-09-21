import React, { useState, useEffect } from 'react';
import { FiSunrise, FiSun, FiSunset, FiMoon } from 'react-icons/fi';
import { FaCloudSun } from "react-icons/fa";
import { PrayerTime } from '../types';
import PrayerTimeItem from './PrayerTimeItem';
import IslamicAnalogClock from './Clock/Clock';

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
        const interval = setInterval(updateActivePrayer, 60000);
        return () => clearInterval(interval);
    }, [prayerTimes]);

    return (
        <div className="">
            {/* Main container stacks vertically on small screens, horizontal on large */}
            <div className="flex flex-col lg:flex-row items-center justify-start gap-6 lg:gap-8">
                {/* This container defines the grid for prayer times */}
                <div className="w-full lg:w-auto flex flex-col gap-3">
                    {/* Grid layout for perfect column alignment. Defines 4 columns. */}
                    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 text-xs md:text-sm font-bold text-gray-300 px-3">
                        {/* Headers now align perfectly with the grid columns */}
                        <div /> {/* Empty cell for icon column */}
                        <p>Prayer</p>
                        <p className="text-right">Adhan</p>
                        <p className="text-right">Iqamah</p>
                    </div>

                    {/* The list of prayer times will flow into the grid defined above */}
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

                {/* ADJUSTMENT: Replaced `flex-1` with explicit, responsive size classes to make the clock larger. */}
                <div className="p-4 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                    {/* <IslamicAnalogClock /> */}
                </div>
            </div>
        </div>
    );
}

export default PrayerTimesPanel;