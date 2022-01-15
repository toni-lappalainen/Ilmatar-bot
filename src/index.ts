require('dotenv-flow').config();
import { Client, Collection, Intents } from 'discord.js';
import fs from 'fs';
import { config } from './config';
import path from 'path';

const clientOptions = {
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
};

const client = new Client(clientOptions);
const eventPath = path.resolve(__dirname, './events');
const commandPath = path.resolve(__dirname, './commands');

//require('./utils/functions')(client);

//client.mongoose = require('./utils/mongoose');
// config has all the individual api tokens/secrets/etc, and other settings
// they can be in the actual config file, or loaded from .env file.
//client.config = config;

// read all files in events directory
// Events are everything that can happen in the servers/channels,
// like a user joining for the first time, or someone talking.
/*
const eventfiles = fs
	.readdirSync(eventPath)
	.filter((file) => file.endsWith('.ts'));

fs.readdir(eventPath, (err, files) => {
	if (err) return console.error;
	files.forEach((file) => {
		if (!file.endsWith('.ts')) return;
		const event = require(`./events/${file}`);

		console.log(`Loaded event '${file}'`);
		console.log(`Loaded event '${event.name}'`);
		//const eventName = file.split('.')[0];
		client.on(event.name, event.bind(null, client));
	});
});*/

// read all files in commands directory
// The individual commands the bot can understand.

const eventFiles = fs
	.readdirSync(eventPath)
	.filter((file) => file.endsWith('.ts'));

for (const file of eventFiles) {
	const eventFile = require(`./events/${file}`);
	const eventName = file.split('.')[0];
	const event = eventFile[eventName];
	console.log(`name: ${eventName} once: ${event.once}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.commands = new Collection();
const commandFiles = fs
	.readdirSync(commandPath)
	.filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	let props = require(`./commands/${file}`);
	let cmdName = file.split('.')[0]; // jatsi.js -> jatsi js -> cmdName = jatsi
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(cmdName, props);
}

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}
});

//client.mongoose.init();
client.login(config.token);
