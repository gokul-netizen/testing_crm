import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

 
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const timeSince = (dbDateString : string) => {
  
    const nowInIndia = dayjs().tz("Asia/Kolkata");
    const pastInIndia = dayjs.tz(dbDateString, "Asia/Kolkata");
    const diffInHours = nowInIndia.diff(pastInIndia, 'hour');
    
    if (diffInHours >= 24) {
        return pastInIndia.format("DD MMM YYYY, hh:mm A");
    }
    
    return pastInIndia.from(nowInIndia);
    
};