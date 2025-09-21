import React from 'react';
import { FaMosque } from 'react-icons/fa';
import { DateInfo, MosqueInfo } from 'types';

interface TopBarProps {
    mosqueInfo: MosqueInfo;
    dateInfo: DateInfo;
}

// Function to convert numerical Hijri date to text-based format
const convertHijriDate = (hijriDate: string): string => {
    // Expected format: "DD/MM/YYYY"
    const [day, month, year] = hijriDate.split('/').map(part => parseInt(part));

    // Hijri month names
    const hijriMonths = [
        'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
        'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];

    // Validate month range
    if (month < 1 || month > 12) {
        return hijriDate; // Return original if invalid
    }

    // Format the date with month name
    return `${day} ${hijriMonths[month - 1]} ${year}`;
};

const TopBar: React.FC<TopBarProps> = ({ mosqueInfo, dateInfo }) => {
    // Convert the Hijri date
    const formattedHijriDate = convertHijriDate(dateInfo.hijri);

    return (
        // Use flex-wrap for smaller screens and responsive padding/gap
        <header className="flex flex-wrap justify-between items-center text-white px-2 md:px-4 pt-4 gap-4">
            <div className="flex items-center gap-3 md:gap-4">
                <FaMosque className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
                <div>
                    {/* Responsive font sizes */}
                    <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold">{mosqueInfo.name}</h1>
                    <p className="text-[10px] sm:text-xs xl:text-lg text-gray-200">{mosqueInfo.address}</p>
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                {/* Responsive font sizes */}
                <p className="font-semibold text-base sm:text-lg xl:text-xl">
                    {dateInfo.gregorian}
                    <p>{formattedHijriDate}</p>
                </p>
            </div>
        </header>
    );
}

export default TopBar;