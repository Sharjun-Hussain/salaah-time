import React from 'react';

interface PrayerTimeItemProps {
    icon: React.ReactNode;
    name: string;
    time: string;
    iqamah: string;
    isActive: boolean;
}

const PrayerTimeItem: React.FC<PrayerTimeItemProps> = ({ icon, name, time, iqamah, isActive }) => {
    // A unified, professional style for the active prayer highlight.
    // It uses a single accent color for the border and a subtle background tint.
    const activeClasses = isActive
        ? 'bg-emerald-500/10 border-emerald-400' // Active state: subtle tint and a clear border
        : 'border-transparent hover:bg-white/10'; // Default state: transparent border with a hover effect

    return (
        // "display: contents" allows this component's children to align to the parent's grid
        <div className="display-contents">

            <div className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 p-3 border-l-4 rounded-lg transition-all duration-300 ${activeClasses}`}>

                {/* Cell 1: Icon */}
                <div className={`text-2xl flex justify-center ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {icon}
                </div>

                {/* Cell 2: Prayer Name */}
                <p className={`text-lg font-semibold ${isActive ? 'text-white' : 'text-gray-200'}`}>
                    {name}
                </p>

                {/* Cell 3: Adhan Time */}
                <p className={`text-xl font-mono font-bold text-right ${isActive ? 'text-white' : 'text-gray-200'}`}>
                    {time}
                </p>

                {/* Cell 4: Iqamah Time */}
                <p className="text-xl font-mono font-bold text-right text-emerald-400">
                    {iqamah}
                </p>

            </div>
        </div>
    );
}

export default PrayerTimeItem;