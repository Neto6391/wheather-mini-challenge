import { parseFromTimeZone } from 'date-fns-timezone';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

export default {
  verifyTimeZone: (timezone) =>
    parseFromTimeZone(timezone, {
      timeZone: 'America/Maceio',
    }),
  dateToDay: (date) =>
    format(date, 'EEEE', {
      locale: pt,
    }),
  isMatchDayInWeek: (daysInWeek, message, day) => {
    const matchDay = daysInWeek.some((item) => message.includes(item));
    return matchDay ? `, ${day}` : day;
  },

  compareDateWithToday: (date) => {
    const today = Number(format(new Date(), 'd'));
    const dataDate = Number(format(date, 'd'));
    return today === dataDate;
  },
  validateCondition: (
    day1,
    isEqual = false,
    day2,
    included = false,
    hour,
    humidity
  ) => {
    return isEqual
      ? day1 === day2 && included && hour <= 18 && humidity > 70
      : day1 !== day2 && hour <= 18 && humidity > 70;
  },
};
