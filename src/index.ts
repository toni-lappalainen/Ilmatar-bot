import 'dotenv-flow';
import { mongoInit } from './database/mongo';
import { config } from './config';
import { client } from './client';

mongoInit();
client.login(config.token);
