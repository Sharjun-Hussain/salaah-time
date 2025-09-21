import React from 'react';
import { format } from 'date-fns';
import moment from 'moment-hijri';
import { DateInfo, MosqueInfo, PrayerTime } from 'types';
import PrayerTimesPanel from './PrayerTimePanel';
import BottomBar from './BottomBar';
import TopBar from './TopBar';
import NextPrayerInfo from './NextPrayerInfo';

// Update to a modern background image if you have one
import MosqueBackgroundImage from 'assets/mosque-bg.jpg';
import newimage from 'assets/new.jpg'

function App() {
  const prayerTimesData: PrayerTime[] = [
    { name: 'Shubuh', time: '04:50', iqamah: '05:00' },
    { name: 'Luhar', time: '13:08', iqamah: '13:20' },
    { name: 'Asr', time: '16:01', iqamah: '16:02' },
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

  const scrollingMessage = "Connect with us | Visit our website for more info | May Allah bless you abundantly.";

  return (
    // The background style has been moved from this outer div...
    <div className="w-screen h-screen">

      {/* ...to this inner div, which holds all the content. */}
      <div
        className="relative w-full h-full flex flex-col overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${newimage})` }}
      >

        {/* --- THIS IS THE NEW OVERLAY --- */}
        {/* It's an absolute div that covers its parent (`inset-0`). */}
        {/* `bg-black/60` provides a black background with 60% opacity. */}
        <div className="absolute inset-0 bg-black/60" />

        {/* This new wrapper is needed to place the content ON TOP of the overlay */}
        <div className="relative z-10 w-full h-full flex flex-col">

          {/* All your original components are inside this wrapper, unchanged. */}
          <TopBar mosqueInfo={mosqueInfo} dateInfo={dateInfo} />

          <main className="flex-1 min-h-0 flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start gap-6 xl:gap-12 p-4 md:p-6 lg:p-8 pb-28">
            <PrayerTimesPanel prayerTimes={prayerTimesData} />
            <NextPrayerInfo prayerTimes={prayerTimesData} />
          </main>

          <div className="absolute bottom-0 left-0 w-full px-4 md:px-6 lg:px-8">
            <div className="mb-8">
              {/* <BottomBar message={scrollingMessage} /> */}
            </div>
            <div className="text-center text-xs md:text-sm text-text-light font-light tracking-wider pb-4">
              Design & Developed By Inzeedo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;