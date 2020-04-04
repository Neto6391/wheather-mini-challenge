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
  transformObjArrayTimestamp: (array, value, ob) => {
    return array[value] && Array.isArray(array[value])
      ? array[value].concat(ob)
      : [].concat(ob);
  },
};
