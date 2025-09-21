import React, { useState, useEffect } from 'react';
import { PrayerTime } from '../types';

// Interfaces for our data structures
interface NextPrayerEvent {
    name: PrayerTime['name'];
    type: 'ADHAN' | 'IQAMAH';
    targetTime: Date;
}

interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
}

interface NextPrayerInfoProps {
    prayerTimes: PrayerTime[];
}

// Helper function to create a Date object from a "HH:mm" time string
const createDateFromTimeString = (timeString: string, date: Date): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

// The ProgressRing component
const ProgressRing: React.FC<{ radius: number; stroke: number; progress: number }> = ({
    radius, stroke, progress
}) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const validProgress = Math.max(0, Math.min(1, progress || 0));
    const strokeDashoffset = circumference - validProgress * circumference;

    return (
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <circle stroke="rgba(255, 255, 255, 0.1)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
            <circle stroke="url(#gradient)" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} className="transition-[stroke-dashoffset] duration-1000 ease-linear" />
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
            </defs>
        </svg>
    );
};


const NextPrayerInfo: React.FC<NextPrayerInfoProps> = ({ prayerTimes }) => {
    // FIX 1: Add a dedicated `isLoading` state.
    // This will be `true` only on the initial load.
    const [isLoading, setIsLoading] = useState(true);
    const [nextEvent, setNextEvent] = useState<NextPrayerEvent | null>(null);
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const allEvents: NextPrayerEvent[] = [];
            prayerTimes.forEach(prayer => {
                allEvents.push({ name: prayer.name, type: 'ADHAN', targetTime: createDateFromTimeString(prayer.time, today) });
                allEvents.push({ name: prayer.name, type: 'IQAMAH', targetTime: createDateFromTimeString(prayer.iqamah, today) });
                if (prayer.name === 'Shubuh') {
                    allEvents.push({ name: prayer.name, type: 'ADHAN', targetTime: createDateFromTimeString(prayer.time, tomorrow) });
                }
            });

            allEvents.sort((a, b) => a.targetTime.getTime() - b.targetTime.getTime());

            const upcomingEvent = allEvents.find(event => event.targetTime > now);
            const pastEvents = allEvents.filter(event => event.targetTime <= now);
            const previousEvent = pastEvents.length > 0 ? pastEvents[pastEvents.length - 1] : null;

            // FIX 2: Only update state if we found a valid upcoming event.
            // This prevents the state from being set to `null` and causing a flicker.
            if (upcomingEvent) {
                setNextEvent(upcomingEvent);

                if (previousEvent) {
                    const totalDuration = upcomingEvent.targetTime.getTime() - previousEvent.targetTime.getTime();
                    const timeRemaining = upcomingEvent.targetTime.getTime() - now.getTime();

                    if (totalDuration > 0 && timeRemaining > 0) {
                        const timeElapsed = now.getTime() - previousEvent.targetTime.getTime();
                        setProgress(Math.min(timeElapsed / totalDuration, 1));

                        setTimeLeft({
                            hours: Math.floor(timeRemaining / (1000 * 60 * 60)),
                            minutes: Math.floor((timeRemaining / 1000 / 60) % 60),
                            seconds: Math.floor((timeRemaining / 1000) % 60),
                        });
                    } else {
                        setProgress(0);
                    }
                }
                // Once we have data, we are no longer in the initial loading state.
                if (isLoading) setIsLoading(false);
            }
        };

        // Run once immediately to prevent showing the loading state if possible
        updateCountdown();

        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, [prayerTimes, isLoading]); // Added isLoading to dependency array

    const formatTime = (time: number = 0) => String(time).padStart(2, '0');

    // FIX 3: The loading state is now only shown if `isLoading` is true.
    if (isLoading) {
        return (
            <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-lg border border-gray-700 flex items-center justify-center text-gray-300 text-sm animate-pulse">
                Calculating next prayer...
            </div>
        );
    }

    // This prevents a crash if nextEvent somehow becomes null after the initial load
    if (!nextEvent || !timeLeft) {
        return null; // Render nothing briefly instead of a flickering loading box
    }

    const subtitle = nextEvent.type === 'ADHAN' ? 'Adhan In' : 'Iqamah In';
    return (
        <div className="flex-1 bg-black/25 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-lg border border-white/10 flex flex-col items-center justify-center text-center">
            <p className="text-base text-gray-400 mb-1">{subtitle}</p>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6">{nextEvent.name}</h2>
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
                    <p className="text-xs text-gray-400">{nextEvent.type === 'ADHAN' ? 'Adhan at' : 'Iqamah at'}</p>
                    <p className="text-base font-medium text-white">{nextEvent.targetTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                </div>
                {nextEvent.type === 'ADHAN' && (
                    <div>
                        <p className="text-xs text-gray-400">Iqamah at</p>
                        <p className="text-base font-medium text-emerald-300">
                            {(() => {
                                const prayer = prayerTimes.find(p => p.name === nextEvent.name);
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