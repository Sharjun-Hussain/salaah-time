import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PrayerTime } from 'types'; // Ensure your types are in './types'

// --- Interfaces ---
interface NextPrayerEvent {
    name: PrayerTime['name'];
    type: 'ADHAN' | 'IQAMAH';
    targetTime: Date;
}
interface NextPrayerInfoProps {
    prayerTimes: PrayerTime[];
}

// --- Helper Function ---
const createDateFromTimeString = (timeString: string, date: Date): Date => {
    if (!timeString) return new Date(0);
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

const NextPrayerInfo: React.FC<NextPrayerInfoProps> = ({ prayerTimes }) => {
    // A single state for the current time.
    // It updates much less frequently now.
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        // We only need to check for the next prayer every minute, not every second.
        const timer = setInterval(() => setNow(new Date()), 60000); // Update once per minute
        return () => clearInterval(timer);
    }, []);

    // useMemo still efficiently calculates which prayer is next.
    const prayerData = useMemo(() => {
        const today = new Date(now); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

        const allEvents: NextPrayerEvent[] = prayerTimes.flatMap(prayer => [
            { name: prayer.name, type: 'ADHAN' as const, targetTime: createDateFromTimeString(prayer.time, today) },
            { name: prayer.name, type: 'IQAMAH' as const, targetTime: createDateFromTimeString(prayer.iqamah, today) },
            ...(prayer.name === 'Shubuh' ? [{ name: prayer.name, type: 'ADHAN' as const, targetTime: createDateFromTimeString(prayer.time, tomorrow) }] : [])
        ]).sort((a, b) => a.targetTime.getTime() - b.targetTime.getTime());

        const upcomingEvent = allEvents.find(event => event.targetTime > now);

        if (!upcomingEvent) return { isLoading: true };

        return { isLoading: false, upcomingEvent };

    }, [now, prayerTimes]);


    if (prayerData.isLoading || !prayerData.upcomingEvent) {
        return <div className="flex-1 bg-black/25 p-4 md:p-5 rounded-2xl shadow-lg border border-white/10 flex items-center justify-center text-gray-300 text-sm animate-pulse">Calculating...</div>;
    }

    const { upcomingEvent } = prayerData;

    return (
        <div className="flex-1 bg-black/25 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 flex flex-col items-center justify-center text-center">

            {/* A clean title */}
            <p className="text-lg font-medium text-gray-300">UPCOMING PRAYER</p>

            {/* The name of the prayer is now the main focus */}
            <h2 className="text-7xl lg:text-8xl font-bold text-emerald-400 my-4">
                {upcomingEvent.name}
            </h2>

            {/* The Adhan and Iqamah times are displayed clearly below */}
            <div className="flex gap-8">
                <div>
                    <p className="text-sm text-gray-400">Adhan at</p>
                    <p className="text-2xl font-semibold text-white">
                        {/* We find the Adhan time from the original prayer data */}
                        {(() => {
                            const prayer = prayerTimes.find(p => p.name === upcomingEvent.name);
                            if (!prayer) return '';
                            const adhanDate = createDateFromTimeString(prayer.time, new Date());
                            return adhanDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                        })()}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Iqamah at</p>
                    <p className="text-2xl font-semibold text-emerald-300">
                        {(() => {
                            const prayer = prayerTimes.find(p => p.name === upcomingEvent.name);
                            if (!prayer) return '';
                            const iqamahDate = createDateFromTimeString(prayer.iqamah, new Date());
                            return iqamahDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                        })()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NextPrayerInfo;