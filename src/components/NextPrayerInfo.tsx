import React, { useState, useEffect, useRef } from 'react';
import { PrayerTime } from '../types';

// Interfaces for our data structures
interface NextPrayerEvent {
    name: PrayerTime['name'];
    type: 'ADHAN' | 'IQAMAH';
    targetTime: Date;
}
interface NextPrayerInfoProps {
    prayerTimes: PrayerTime[];
}

// Helper function to create a Date object from a "HH:mm" time string
const createDateFromTimeString = (timeString: string, date: Date): Date => {
    if (!timeString) return new Date(0);
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};


const NextPrayerInfo: React.FC<NextPrayerInfoProps> = ({ prayerTimes }) => {
    const [displayEvent, setDisplayEvent] = useState<NextPrayerEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const hoursRef = useRef<HTMLSpanElement>(null);
    const minutesRef = useRef<HTMLSpanElement>(null);
    const secondsRef = useRef<HTMLSpanElement>(null);

    const displayEventRef = useRef(displayEvent);
    displayEventRef.current = displayEvent;

    const formatTime = (time: number = 0) => String(time).padStart(2, '0');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

            const allEvents: NextPrayerEvent[] = prayerTimes.flatMap(prayer => [
                { name: prayer.name, type: 'ADHAN' as const, targetTime: createDateFromTimeString(prayer.time, today) },
                { name: prayer.name, type: 'IQAMAH' as const, targetTime: createDateFromTimeString(prayer.iqamah, today) },
                ...(prayer.name === 'Shubuh' ? [{ name: prayer.name, type: 'ADHAN' as const, targetTime: createDateFromTimeString(prayer.time, tomorrow) }] : [])
            ]).sort((a, b) => a.targetTime.getTime() - b.targetTime.getTime());

            const upcomingEvent = allEvents.find(event => event.targetTime > now);

            if (upcomingEvent && upcomingEvent.targetTime !== displayEventRef.current?.targetTime) {
                setDisplayEvent(upcomingEvent);
                if (isLoading) setIsLoading(false);
            }

            if (upcomingEvent) {
                const timeRemaining = upcomingEvent.targetTime.getTime() - now.getTime();
                if (timeRemaining >= 0) {
                    if (hoursRef.current) hoursRef.current.innerText = formatTime(Math.floor(timeRemaining / (1000 * 60 * 60)));
                    if (minutesRef.current) minutesRef.current.innerText = formatTime(Math.floor((timeRemaining / 1000 / 60) % 60));
                    if (secondsRef.current) secondsRef.current.innerText = formatTime(Math.floor((timeRemaining / 1000) % 60));
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [prayerTimes, isLoading]);

    if (isLoading) {
        return <div className="flex-1 bg-black/25 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-lg border border-white/10 flex items-center justify-center text-gray-300 text-sm animate-pulse">Calculating...</div>;
    }

    const subtitle = displayEvent?.type === 'ADHAN' ? 'Adhan In' : 'Iqamah In';
    return (
        <div className="flex-1 bg-black/25 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-lg border border-white/10 flex flex-col items-center justify-center text-center">
            <p className="text-base text-gray-400 mb-1">{subtitle}</p>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6">{displayEvent?.name}</h2>

            <div className="grid place-items-center w-36 h-36 lg:w-44 lg:h-44">

                {/* --- THE FIX IS HERE --- */}
                {/* Added `col-start-1 row-start-1` to the SVG to place it in the same cell as the text div. */}
                <svg viewBox="0 0 100 100" className="w-full h-full col-start-1 row-start-1">
                    <circle cx="50" cy="50" r="45" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="4" fill="transparent" />
                    <circle cx="50" cy="50" r="45" stroke="rgba(0, 255, 255, 0.8)" strokeWidth="4" fill="transparent" className="animate-pulse" />
                </svg>

                <div className="col-start-1 row-start-1 flex flex-col items-center justify-center">
                    <div className="text-3xl lg:text-4xl font-mono font-bold text-white">
                        <span ref={hoursRef}>00</span>:<span ref={minutesRef}>00</span>
                    </div>
                    <div className="text-lg lg:text-xl font-mono text-gray-400 mt-1">:<span ref={secondsRef}>00</span></div>
                </div>
            </div>

            <div className="mt-6 flex gap-6">
                <div>
                    <p className="text-xs text-gray-400">{displayEvent?.type === 'ADHAN' ? 'Adhan at' : 'Iqamah at'}</p>
                    <p className="text-base font-medium text-white">{displayEvent?.targetTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                </div>
                {displayEvent?.type === 'ADHAN' && (
                    <div>
                        <p className="text-xs text-gray-400">Iqamah at</p>
                        <p className="text-base font-medium text-emerald-300">
                            {(() => {
                                const prayer = prayerTimes.find(p => p.name === displayEvent?.name);
                                if (!prayer) return '';
                                const iqamahDate = createDateFromTimeString(prayer.iqamah, new Date());
                                return iqamahDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                            })()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NextPrayerInfo;