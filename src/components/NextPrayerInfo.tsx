import React, { useState, useEffect } from 'react';
import { PrayerTime } from '../types';

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

const createDateFromTimeString = (timeString: string, date: Date): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

const ProgressRing: React.FC<{ radius: number; stroke: number; progress: number }> = ({
    radius, stroke, progress
}) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <circle
                stroke="url(#gradient)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
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

const NextPrayerInfo: React.FC<NextPrayerInfoProps> = ({ prayerTimes }) => {
    const [nextEvent, setNextEvent] = useState<NextPrayerEvent | null>(null);
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const today = new Date(now);
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);

            // Create a comprehensive list of all possible events for today and tomorrow
            const allEvents: NextPrayerEvent[] = [];
            prayerTimes.forEach(prayer => {
                allEvents.push({
                    name: prayer.name,
                    type: 'ADHAN',
                    targetTime: createDateFromTimeString(prayer.time, today)
                });
                allEvents.push({
                    name: prayer.name,
                    type: 'IQAMAH',
                    targetTime: createDateFromTimeString(prayer.iqamah, today)
                });
                // Add tomorrow's Fajr to handle the overnight case seamlessly
                if (prayer.name === 'Shubuh') {
                    allEvents.push({
                        name: prayer.name,
                        type: 'ADHAN',
                        targetTime: createDateFromTimeString(prayer.time, tomorrow)
                    });
                }
            });

            allEvents.sort((a, b) => a.targetTime.getTime() - b.targetTime.getTime());

            const upcomingEvent = allEvents.find(event => event.targetTime > now);
            const pastEvents = allEvents.filter(event => event.targetTime <= now);
            const previousEvent = pastEvents.length > 0 ? pastEvents[pastEvents.length - 1] : null;

            setNextEvent(upcomingEvent || null);

            if (upcomingEvent) {
                const totalDuration = previousEvent ?
                    upcomingEvent.targetTime.getTime() - previousEvent.targetTime.getTime() : 0;
                const timeRemaining = upcomingEvent.targetTime.getTime() - now.getTime();

                // Calculate progress
                if (totalDuration > 0) {
                    const timeElapsed = totalDuration - timeRemaining;
                    setProgress(Math.min(timeElapsed / totalDuration, 1));
                }

                // Calculate time left display
                if (timeRemaining > 0) {
                    setTimeLeft({
                        hours: Math.floor(timeRemaining / (1000 * 60 * 60)),
                        minutes: Math.floor((timeRemaining / 1000 / 60) % 60),
                        seconds: Math.floor((timeRemaining / 1000) % 60),
                    });
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [prayerTimes]);

    const formatTime = (time: number = 0) => String(time).padStart(2, '0');

    if (!nextEvent || !timeLeft) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-lg border border-gray-700 flex items-center justify-center text-gray-300 text-sm animate-pulse">
                Calculating next prayer...
            </div>
        );
    }

    const subtitle = nextEvent.type === 'ADHAN' ? 'Adhan In' : 'Iqamah In';
    const isIqamahNext = nextEvent.type === 'IQAMAH';

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl w-xl shadow-lg border border-gray-700">
            <div className="flex items-center justify-between">
                {/* Prayer Info */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        {nextEvent.name}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {subtitle}
                    </p>

                    {/* Target Time */}
                    <div className="mt-2">
                        <p className="text-xs text-gray-400">
                            {nextEvent.type === 'ADHAN' ? 'Adhan at' : 'Iqamah at'}
                        </p>
                        <p className="text-sm font-semibold text-white">
                            {nextEvent.targetTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </p>
                    </div>

                    {/* Show Iqamah time if next is Adhan */}
                    {nextEvent.type === 'ADHAN' && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-400">Iqamah at</p>
                            <p className="text-sm font-semibold text-emerald-300">
                                {prayerTimes
                                    .find(p => p.name === nextEvent.name)
                                    ?.iqamah}
                            </p>
                        </div>
                    )}
                </div>

                {/* Progress Ring and Countdown */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute">
                        <ProgressRing radius={40} stroke={4} progress={progress} />
                    </div>
                    <div className="flex flex-col items-center justify-center w-20 h-20">
                        <div className="text-lg font-mono font-bold text-white">
                            <span>{formatTime(timeLeft.hours)}</span>:
                            <span>{formatTime(timeLeft.minutes)}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            :{formatTime(timeLeft.seconds)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NextPrayerInfo;