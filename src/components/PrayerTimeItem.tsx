import React from 'react';

interface PrayerTimeItemProps {
    icon: React.ReactNode;
    name: string;
    time: string;
    iqamah: string;
    isActive: boolean; // Prop to indicate if this is the current prayer
}

const PrayerTimeItem: React.FC<PrayerTimeItemProps> = ({ icon, name, time, iqamah, isActive }) => {
    // --- Define our visual states ---

    // Style for the currently active prayer time. A vibrant, glowing card.
    const activeClasses = isActive
        ? 'bg-accent-gold/10 shadow-lg shadow-accent-gold/30 border-l-4 border-accent-gold' // A warm and majestic gold highlight
        : 'bg-card-bg border-l-4 border-transparent hover:bg-active-card hover:border-accent-gold/50';
    // Style for the icon. It will be more prominent when active.
    const iconClasses = isActive
        ? 'text-accent-gold'
        : 'text-primary-blue';

    return (
        // We use "display: contents" so this component can fit into a parent CSS Grid layout,
        // which is essential for perfect column alignment.
        <div className="display-contents">

            {/* The main styled container with transitions and a subtle "lift" on hover */}
            <div className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 text-text-primary p-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${activeClasses}`}>

                {/* Cell 1: Icon */}
                <div className={`text-2xl md:text-3xl flex justify-center transition-colors duration-300 ${iconClasses}`}>
                    {icon}
                </div>

                {/* Cell 2: Prayer Name */}
                <p className="text-lg md:text-xl font-semibold text-text-primary">
                    {name}
                </p>

                {/* Cell 3: Adhan Time - Using a monospaced font for clean alignment */}
                <p className="text-xl md:text-2xl font-bold tracking-wider text-right text-text-primary font-mono">
                    {time}
                </p>

                {/* Cell 4: Iqamah Time - Using a distinct, vibrant color */}
                <p className="text-xl md:text-2xl font-bold tracking-wider text-right text-secondary-green font-mono">
                    {iqamah}
                </p>

            </div>
        </div>
    );
}

export default PrayerTimeItem;