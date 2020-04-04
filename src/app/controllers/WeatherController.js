import { parseFromTimeZone } from 'date-fns-timezone';
import { format, getHours } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import axios from 'axios';
import weatherConfig from '../../config/weather';

class WeatherController {
  async index(req, res) {
    const { link_api, lat, lon, key } = weatherConfig;

    const request = await axios.get(
      `${link_api}lat=${lat}&lon=${lon}&appid=${key}`
    );

    const { data } = request;
    const { list } = data;
    let days = [];

    list.forEach((weather) => {
      const { dt_txt, main } = weather;
      const { humidity } = main;

      const timestamp = parseFromTimeZone(dt_txt, {
        timeZone: 'America/Maceio',
      });

      const day = format(timestamp, 'EEEE', {
        locale: pt,
      });

      const hour = getHours(timestamp) + 3;
      if (humidity >= 70 && hour <= 15) {
        days.push(day);
      }
    });

    days = Array.from(new Set(days.map(JSON.stringify)), JSON.parse);
    res.json({ message: 'Não vai dar praia nos seguintes dias:', days });
  }
}

export default new WeatherController();
