import React from 'react';
import { FaMosque } from 'react-icons/fa';
import { DateInfo, MosqueInfo } from 'types';

interface TopBarProps {
    mosqueInfo: MosqueInfo;
    dateInfo: DateInfo;
}

const TopBar: React.FC<TopBarProps> = ({ mosqueInfo, dateInfo }) => {
    return (
        // Use flex-wrap for smaller screens and responsive padding/gap
        <header className="flex flex-wrap justify-between items-center text-white px-2 md:px-4 pt-2 gap-4">
            <div className="flex items-center gap-3 md:gap-4">
                <FaMosque className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
                <div>
                    {/* Responsive font sizes */}
                    <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold">{mosqueInfo.name}</h1>
                    <p className="text-[10px] sm:text-xs xl:text-sm text-gray-200">{mosqueInfo.address}</p>
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                {/* Responsive font sizes */}
                <p className="font-semibold text-base sm:text-lg xl:text-xl">{dateInfo.gregorian} / {dateInfo.hijri}</p>
            </div>
        </header>
    );
}

export default TopBar;