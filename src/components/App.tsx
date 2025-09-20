import React from 'react';
import { format } from 'date-fns';
import moment from 'moment-hijri';
import { DateInfo, MosqueInfo, PrayerTime } from 'types';
import PrayerTimesPanel from './PrayerTimePanel';
import BottomBar from './BottomBar';
import TopBar from './TopBar';
import MosqueBackgroundImage from 'assets/mosque-bg.jpg';

function App() {
  const prayerTimesData: PrayerTime[] = [
    { name: 'Shubuh', time: '04:50', iqamah: '05:00' },
    { name: 'Luhar', time: '13:08', iqamah: '13:20' },
    { name: 'Asr', time: '16:35', iqamah: '16:45' },
    { name: 'Maghrib', time: '19:41', iqamah: '19:45' },
    { name: 'Isha', time: '21:05', iqamah: '21:15' },
  ];

  const today = new Date();
  const hijriDate = moment().format("iYYYY/iM/iD");

  const mosqueInfo: MosqueInfo = {
    name: 'Masjidhul Haadhi',
    address: 'Alhilal South Road, Sainthamaruthu -15 | info@masjidhulhaadhi.com | +94 7573 40 891',
  };

  const dateInfo: DateInfo = {
    gregorian: format(today, 'EEEE, MMMM do, yyyy'),
    hijri: hijriDate,
  };

  const scrollingMessage = "Change this on the Masjid Dashboard • Please follow health protocols • Keep the mosque clean";

  return (
    <div
      className="w-screen h-screen bg-cover bg-center p-4 md:p-6 lg:p-8" // Responsive padding
      style={{ backgroundImage: `url(${MosqueBackgroundImage})` }}
    >
      <div className="relative w-full h-full rounded-lg shadow-2xl flex flex-col text-white">
        <TopBar mosqueInfo={mosqueInfo} dateInfo={dateInfo} />

        {/* Use items-start to keep panel at the top, and add responsive margin */}
        <main className="flex-grow flex items-start mt-4 lg:mt-8">
          <PrayerTimesPanel prayerTimes={prayerTimesData} />
        </main>
      </div>

      <BottomBar message={scrollingMessage} />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs md:text-sm text-gray-300 font-semibold tracking-widest">
        Design & Developed By Inzeedo
      </div>
    </div>
  );
}

export default App;