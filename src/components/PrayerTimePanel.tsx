import React, { useState, useEffect, useRef, forwardRef } from 'react';
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

// --- ProgressRing (with simple CSS transition for animation) ---
const ProgressRing = forwardRef<SVGCircleElement, { radius: number; stroke: number }>(
    ({ radius, stroke }, ref) => {
        const normalizedRadius = radius - stroke * 2;
        const circumference = normalizedRadius * 2 * Math.PI;

        return (
            <svg height={radius * 2} width={radius * 2} className="-rotate-90">
                <style>
                    {/* This is the simple CSS animation. It tells the browser to smoothly
                    transition any changes to the `stroke-dashoffset` over 0.5 seconds. */}
                    {`.progress-ring-circle { transition: stroke-dashoffset 0.5s linear; }`}
                </style>
                <circle stroke="rgba(255, 255, 255, 0.1)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
                <circle
                    ref={ref}
                    className="progress-ring-circle"
                    stroke="url(#gradient)"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference} // Start with a full offset (empty ring)
                    strokeLinecap="round"
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
    });

// --- Main NextPrayerInfo Component (Optimized) ---
const NextPrayerInfo: React.FC<NextPrayerInfoProps> = ({ prayerTimes }) => {
    const [displayEvent, setDisplayEvent] = useState<NextPrayerEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const hoursRef = useRef<HTMLSpanElement>(null);
    const minutesRef = useRef<HTMLSpanElement>(null);
    const secondsRef = useRef<HTMLSpanElement>(null);
    const progressRingRef = useRef<SVGCircleElement>(null);
    const animationFrameId = useRef<number>();
    const lastUpdateTime = useRef<number>(0);
    const eventData = useRef<{ allEvents: NextPrayerEvent[], previousEvent: NextPrayerEvent | null }>({ allEvents: [], previousEvent: null });
    const displayEventRef = useRef(displayEvent);
    displayEventRef.current = displayEvent;

    const formatTime = (time: number = 0) => String(time).padStart(2, '0');

    useEffect(() => {
        const allEvents = prayerTimes.flatMap(prayer => {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
            return [
                { name: prayer.name, type: 'ADHAN' as const, targetTime: createDateFromTimeString(prayer.time, today) },
                { name: prayer.name, type: 'IQAMAH' as const, targetTime: createDateFromTimeString(prayer.iqamah, today) },
                ...(prayer.name === 'Shubuh' ? [{ name: prayer.name, type: 'ADHAN' as const, targetTime: createDateFromTimeString(prayer.time, tomorrow) }] : [])
            ];
        }).sort((a, b) => a.targetTime.getTime() - b.targetTime.getTime());
        eventData.current.allEvents = allEvents;

        const tick = (now: number) => {
            animationFrameId.current = requestAnimationFrame(tick);
            if (now - lastUpdateTime.current < 1000) return;
            lastUpdateTime.current = now;

            const currentDate = new Date(now);
            const upcomingEvent = eventData.current.allEvents.find(event => event.targetTime > currentDate);
            const pastEvents = eventData.current.allEvents.filter(event => event.targetTime <= currentDate);
            const currentEvent = pastEvents.length > 0 ? pastEvents[pastEvents.length - 1] : null;

            if (upcomingEvent) {
                if (displayEventRef.current?.targetTime !== upcomingEvent.targetTime) {
                    setDisplayEvent(upcomingEvent);
                    eventData.current.previousEvent = currentEvent;
                    if (isLoading) setIsLoading(false);
                }

                const { previousEvent } = eventData.current;
                const timeRemaining = upcomingEvent.targetTime.getTime() - currentDate.getTime();

                if (timeRemaining >= 0) {
                    if (hoursRef.current) hoursRef.current.innerText = formatTime(Math.floor(timeRemaining / (1000 * 60 * 60)));
                    if (minutesRef.current) minutesRef.current.innerText = formatTime(Math.floor((timeRemaining / 1000 / 60) % 60));
                    if (secondsRef.current) secondsRef.current.innerText = formatTime(Math.floor((timeRemaining / 1000) % 60));
                }

                if (previousEvent && progressRingRef.current) {
                    const totalDuration = upcomingEvent.targetTime.getTime() - previousEvent.targetTime.getTime();
                    if (totalDuration > 0) {
                        const timeElapsed = currentDate.getTime() - previousEvent.targetTime.getTime();
                        const progress = Math.min(timeElapsed / totalDuration, 1);
                        const ring = progressRingRef.current;
                        const radius = parseFloat(ring.getAttribute('r') || '0');
                        const circumference = 2 * Math.PI * radius;
                        ring.style.strokeDashoffset = (circumference - progress * circumference).toString();
                    }
                }
            }
        };

        animationFrameId.current = requestAnimationFrame(tick);
        return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
    }, [prayerTimes, isLoading]);

    if (isLoading) {
        return <div className="flex-1 bg-black/25 p-4 rounded-2xl shadow-lg border border-white/10 flex items-center justify-center text-gray-300 text-sm animate-pulse">Calculating...</div>;
    }

    const subtitle = displayEvent?.type === 'ADHAN' ? 'Adhan In' : 'Iqamah In';
    return (
        <div className="flex-1 bg-black/25 p-4 md:p-5 rounded-2xl shadow-lg border border-white/10 flex flex-col items-center justify-center text-center backdrop-blur-md">
            <p className="text-base text-gray-400 mb-1">{subtitle}</p>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6">{displayEvent?.name}</h2>
            <div className="grid place-items-center w-36 h-36 lg:w-44 lg:h-44">
                <div className="col-start-1 row-start-1">
                    <ProgressRing ref={progressRingRef} radius={window.innerWidth > 1024 ? 85 : 70} stroke={8} />
                </div>
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