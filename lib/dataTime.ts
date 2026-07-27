import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
 
export function getISTDate(): Date {
  return dayjs().tz("Asia/Kolkata").toDate();
}


export function formatteDateTime(item : any){

  return dayjs.utc(item).format("DD-MM-YYYY : hh:mm a");

}
