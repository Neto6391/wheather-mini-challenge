import { getHours } from 'date-fns';

import axios from 'axios';
import weatherConfig from '../../config/weather';
import utils from '../../utils/date';

class WeatherController {
  async index(req, res) {
    const {
      verifyTimeZone,
      dateToDay,
      isMatchDayInWeek,
      compareDateWithToday,
      transformObjArrayTimestamp,
    } = utils;
    const { link_api, lat, lon, key } = weatherConfig;

    const requestOpenWeatherApi = await axios.get(
      `${link_api}lat=${lat}&lon=${lon}&appid=${key}`
    );

    const { data } = requestOpenWeatherApi;
    const { list: listWeatherDays } = data;

    const daysInWeek = [
      'domingo',
      'segunda',
      'terça',
      'quarta',
      'quinta',
      'sexta',
      'sábado',
    ];

    let message = 'Não vai dar ir a praia nos seguintes dias: ';
    const days = {};

    listWeatherDays.forEach((weather) => {
      const { dt_txt: dateString, main } = weather;
      const timestamp = verifyTimeZone(dateString);
      const { humidity } = main;

      const { day, hour } = {
        day: dateToDay(timestamp),
        hour: getHours(timestamp) + 3,
      };

      if (!compareDateWithToday(timestamp)) {
        days[day] = transformObjArrayTimestamp(days, day, {
          timestamp,
          hour,
          humidity,
        });
      }
    });
    Object.keys(days).forEach((day) => {
      const itemDays = days[day];
      const matchDayNoGoBeach = itemDays.some(
        (item) => item.hour >= 6 && item.hour <= 18 && item.humidity > 70
      );
      if (matchDayNoGoBeach) {
        message += isMatchDayInWeek(daysInWeek, message, day);
      }
    });

    res.json({ message });
  }
}

export default new WeatherController();
