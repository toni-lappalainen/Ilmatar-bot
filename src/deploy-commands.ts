import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';
import { config } from './config';

const commands = [];
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file: any) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.token);

rest.put(
	Routes.applicationGuildCommands(config.clientId, config.defaultguildId),
	{ body: commands }
)
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
