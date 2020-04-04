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
      validateCondition,
    } = utils;
    const { link_api, lat, lon, key } = weatherConfig;

    const request = await axios.get(
      `${link_api}lat=${lat}&lon=${lon}&appid=${key}`
    );

    const { data } = request;
    const { list } = data;
    list.shift();

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
    const dayLoop = dateToDay(verifyTimeZone(list[0].dt_txt));
    const dayIncludeInMessage = { day: dayLoop, included: false };

    list.forEach((weather) => {
      const { dt_txt, main } = weather;
      const { humidity } = main;

      const timestamp = verifyTimeZone(dt_txt);
      const day = dateToDay(timestamp);
      const hour = getHours(timestamp) + 3;
      if (!compareDateWithToday(timestamp)) {
        if (
          validateCondition(
            dayIncludeInMessage.day,
            true,
            day,
            !dayIncludeInMessage.included,
            hour,
            humidity
          )
        ) {
          message += isMatchDayInWeek(daysInWeek, message, day);
          dayIncludeInMessage.included = true;
        } else if (
          validateCondition(
            dayIncludeInMessage.day,
            false,
            day,
            null,
            hour,
            humidity
          )
        ) {
          message += isMatchDayInWeek(daysInWeek, message, day);
          dayIncludeInMessage.day = day;
          dayIncludeInMessage.included = true;
        }
      }
    });

    res.json({ message });
  }
}

export default new WeatherController();
