import React from 'react';
import { format } from 'date-fns';
import moment from 'moment-hijri';
import { DateInfo, MosqueInfo, PrayerTime } from 'types';
import PrayerTimesPanel from './PrayerTimePanel';
import BottomBar from './BottomBar';
import TopBar from './TopBar';
import NextPrayerInfo from './NextPrayerInfo';

// Assuming you still want a background image, ensure it's high quality and fits the modern theme.
// If you prefer a pure gradient, you can remove this import and the `style` prop.
import MosqueBackgroundImage from 'assets/mosque-bg.jpg'; // Update to a modern background image

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

  const scrollingMessage = "Connect with us | Visit our website for more info | May Allah bless you abundantly | Ensure your phone is on silent inside the mosque.";

  return (
    // Applied a modern gradient background to the entire screen
    <div
      className="w-screen h-screen p-4 md:p-6 lg:p-8 text-text-primary bg-gradient-to-br from-dark-background via-blue-900 to-primary-blue"
      style={{ backgroundImage: `url(${MosqueBackgroundImage})`, backgroundBlendMode: 'overlay' }} // Blend image with gradient
    >
      <div className="relative w-full h-full rounded-2xl shadow-2xl flex flex-col backdrop-brightness-75 backdrop-blur-sm border border-primary-blue/30 overflow-hidden">

        <TopBar mosqueInfo={mosqueInfo} dateInfo={dateInfo} />

        <main className="flex-grow flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start gap-6 xl:gap-12 p-4 md:p-6 lg:p-8">
          <PrayerTimesPanel prayerTimes={prayerTimesData} />
          <NextPrayerInfo prayerTimes={prayerTimesData} />
        </main>
      </div>

      <BottomBar message={scrollingMessage} />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs md:text-sm text-text-light font-light tracking-wider animate-fade-in">
        Design & Developed By Inzeedo
      </div>
    </div>
  );
}

export default App;