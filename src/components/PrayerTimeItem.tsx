import React from 'react';

interface PrayerTimeItemProps {
    icon: React.ReactNode;
    name: string;
    time: string;
    iqamah: string;
    isActive: boolean; // Prop to indicate if this is the current prayer
}

const PrayerTimeItem: React.FC<PrayerTimeItemProps> = ({ icon, name, time, iqamah, isActive }) => {
    // Use conditional classes to change style for the active prayer
    const activeClasses = isActive
        ? 'bg-teal-500/80 shadow-lg' // Highlight style
        : 'bg-black/20';                      // Default style

    return (
        <div
            className={`flex items-center gap-4 text-white p-3 rounded-lg transition-all duration-300 ${activeClasses}`}
        >
            <div className="text-2xl">{icon}</div>
            <p className="text-xl font-medium w-24">{name}</p>
            <div className="flex-grow flex justify-end gap-6 text-right">
                <p className="w-20 text-2xl font-bold tracking-wider">{time}</p>
                <p className="w-20 text-2xl font-bold tracking-wider text-teal-300">{iqamah}</p>
            </div>
        </div>
    );
}

export default PrayerTimeItem;