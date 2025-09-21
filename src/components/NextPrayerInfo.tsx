import React, { useState, useEffect, useMemo, forwardRef } from 'react';
import { PrayerTime } from '../types';
import { motion } from 'framer-motion';

// --- Interfaces (No changes) ---
interface NextPrayerEvent {
    name: PrayerTime['name'];
    type: 'ADHAN' | 'IQAMAH';
    targetTime: Date;
}
interface NextPrayerInfoProps {
    prayerTimes: PrayerTime[];
}

// --- Helper Function (No changes) ---
const createDateFromTimeString = (timeString: string, date: Date): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

// --- ProgressRing Component (No changes) ---
const ProgressRing: React.FC<{ radius: number; stroke: number; progress: number }> = ({ radius, stroke, progress }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return (
        <svg height={radius * 2} width={radius * 2} className="-rotate-90">
            <circle stroke="rgba(255, 255, 255, 0.1)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
            <motion.circle
                stroke="url(#gradient)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - progress * circumference }}
                transition={{ duration: 1, ease: "linear" }}
            />
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
            </defs>
        </svg>
    );
};


// --- Main NextPrayerInfo Component (Layout Fix) ---
const NextPrayerInfo: React.FC<NextPrayerInfoProps> = ({ prayerTimes }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const prayerData = useMemo(() => {
        const today = new Date(now); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

        const allEvents: NextPrayerEvent[] = prayerTimes.flatMap(prayer => [
            { name: prayer.name, type: 'ADHAN' as const, targetTime: createDateFromTimeString(prayer.time, today) },
            { name: prayer.name, type: 'IQAMAH' as const, targetTime: createDateFromTimeString(prayer.iqamah, today) },
            ...(prayer.name === 'Shubuh' ? [{ name: prayer.name, type: 'ADHAN' as const, targetTime: createDateFromTimeString(prayer.time, tomorrow) }] : [])
        ]).sort((a, b) => a.targetTime.getTime() - b.targetTime.getTime());

        const upcomingEvent = allEvents.find(event => event.targetTime > now);
        const pastEvents = allEvents.filter(event => event.targetTime <= now);
        const previousEvent = pastEvents[pastEvents.length - 1] ?? null;

        if (!upcomingEvent || !previousEvent) {
            return { isLoading: true };
        }

        const timeRemaining = upcomingEvent.targetTime.getTime() - now.getTime();
        const totalDuration = upcomingEvent.targetTime.getTime() - previousEvent.targetTime.getTime();
        const timeElapsed = now.getTime() - previousEvent.targetTime.getTime();
        const progress = totalDuration > 0 ? Math.min(timeElapsed / totalDuration, 1) : 0;

        const timeLeft = {
            hours: Math.floor(timeRemaining / (1000 * 60 * 60)),
            minutes: Math.floor((timeRemaining / 1000 / 60) % 60),
            seconds: Math.floor((timeRemaining / 1000) % 60),
        };

        return { isLoading: false, upcomingEvent, timeLeft, progress };

    }, [now, prayerTimes]);

    const formatTime = (time: number = 0) => String(time).padStart(2, '0');

    if (prayerData.isLoading || !prayerData.upcomingEvent || !prayerData.timeLeft) {
        return <div className="flex-1 bg-black/25 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-lg border border-white/10 flex items-center justify-center text-gray-300 text-sm animate-pulse">Calculating...</div>;
    }

    const { upcomingEvent, timeLeft, progress } = prayerData;
    const subtitle = upcomingEvent.type === 'ADHAN' ? 'Adhan In' : 'Iqamah In';

    return (
        <div className="flex-1 bg-black/25 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-lg border border-white/10 flex flex-col items-center justify-center text-center">
            <p className="text-base text-gray-400 mb-1">{subtitle}</p>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6">{upcomingEvent.name}</h2>

            {/* --- THE FIX IS HERE --- */}
            {/* I've wrapped the ProgressRing in a div and applied the grid placement classes to it. */}
            <div className="grid place-items-center w-36 h-36 lg:w-44 lg:h-44">
                <div className="col-start-1 row-start-1">
                    <ProgressRing radius={window.innerWidth > 1024 ? 85 : 70} stroke={8} progress={progress} />
                </div>
                <div className="col-start-1 row-start-1 flex flex-col items-center justify-center">
                    <div className="text-3xl lg:text-4xl font-mono font-bold text-white">
                        <span>{formatTime(timeLeft.hours)}</span>:<span>{formatTime(timeLeft.minutes)}</span>
                    </div>
                    <div className="text-lg lg:text-xl font-mono text-gray-400 mt-1">:{formatTime(timeLeft.seconds)}</div>
                </div>
            </div>

            <div className="mt-6 flex gap-6">
                <div>
                    <p className="text-xs text-gray-400">{upcomingEvent.type === 'ADHAN' ? 'Adhan at' : 'Iqamah at'}</p>
                    <p className="text-base font-medium text-white">{upcomingEvent.targetTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                </div>
                {upcomingEvent.type === 'ADHAN' && (
                    <div>
                        <p className="text-xs text-gray-400">Iqamah at</p>
                        <p className="text-base font-medium text-emerald-300">
                            {(() => {
                                const prayer = prayerTimes.find(p => p.name === upcomingEvent.name);
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