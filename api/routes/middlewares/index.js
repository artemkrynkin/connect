import { Router } from 'express';

const middlewares = Router();

if (process.env.NODE_ENV === 'development') {
	const logging = require('shared/middlewares/logging');
	middlewares.use(logging);
}

// Cross origin request support
import cors from 'shared/middlewares/cors';
middlewares.use(cors);
middlewares.options('*', cors);

import cookieParser from 'cookie-parser';
middlewares.use(cookieParser());

import bodyParser from 'body-parser';
middlewares.use(bodyParser.json());

export default middlewares;
