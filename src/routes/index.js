import { Router } from 'express';

import WeatherController from '../app/controllers/WeatherController';

const routes = new Router();

routes.get('/', WeatherController.index);

export default routes;
