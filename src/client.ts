import { Client, Collection, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Command } from './types';

const clientOptions = {
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
	],
};

const client = new Client(clientOptions);

const eventPath = path.resolve(__dirname, './events');
const commandPath = path.resolve(__dirname, './commands');

const eventFiles = fs
	.readdirSync(eventPath)
	.filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	console.log(`name: ${event.name} once: ${event.once}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.commands = new Collection<string, Command>();
const commandFiles = fs
	.readdirSync(commandPath)
	.filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

export { client };
