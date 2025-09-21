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

  const scrollingMessage = "Connect with us | Visit our website for more info | May Allah bless you abundantly.";

  return (
    <div
      className="w-screen h-screen "
      style={{ backgroundImage: `url(${MosqueBackgroundImage})` }}
    >
      {/* KEY CHANGE 1:
        - `relative`: Establishes a positioning context for the absolute footer.
        - `overflow-hidden`: This is the crucial class that PREVENTS scrolling on the entire component.
      */}
      <div className="relative w-full h-full  flex flex-col  overflow-hidden">

        <TopBar mosqueInfo={mosqueInfo} dateInfo={dateInfo} />

        {/* KEY CHANGE 2:
          - `flex-1` and `min-h-0`: These classes make the main content area grow to fill available space without overflowing.
          - `pb-28`: This adds padding to the BOTTOM of the main content area, ensuring content never gets hidden behind the footer.
                     (28 = 16 for BottomBar height + 8 for margin + 4 for "Designed by" text)
        */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start gap-6 xl:gap-12 p-4 md:p-6 lg:p-8 pb-28">
          <PrayerTimesPanel prayerTimes={prayerTimesData} />
          <NextPrayerInfo prayerTimes={prayerTimesData} />
        </main>

        {/* KEY CHANGE 3:
          - The footer elements are now grouped and positioned absolutely at the bottom of the main container.
        */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-6 lg:px-8">
          <div className="mb-8"> {/* This div provides the required margin from the BottomBar */}
            {/* <BottomBar message={scrollingMessage} /> */}
          </div>
          <div className="text-center text-xs md:text-sm text-text-light font-light tracking-wider pb-4">
            Design & Developed By Inzeedo
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;