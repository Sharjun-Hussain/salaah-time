export interface MosqueInfo {
    name: string;
    address: string;
}

export interface DateInfo {
    gregorian: string;
    hijri: string;
}

export interface PrayerTime {
    name: 'Shubuh' | 'Luhar' | 'Asr' | 'Maghrib' | 'Isha';
    time: string;   // e.g., "04:50" (Adhan time)
    iqamah: string; // e.g., "05:00" (Iqamah time)
}