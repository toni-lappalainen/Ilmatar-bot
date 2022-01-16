import { Client, Message, GuildMember } from 'discord.js';
import { config } from './../config';
import {
	getProfile,
	getProfiles,
	createProfile,
	updateProfile,
} from '../database/profiles';
import { getGuilds } from '../database/guilds';
import { ProfileModel } from './../database/models/models';

const message = {
	name: 'messageCreate',
	once: false,
	execute: async (client: Client, ...args: Message[]) => {
		const msg = args[0];
		// use this if you don't want to use responds in DMs
		//	if (!msg.guild) return;
		// don't respond to bot messages
		if (msg.author.bot) return;

		const guildSettings = config.guildSettings.find(
			(guild) => guild.id === msg.guildId
		);
		if (!guildSettings) return;
		if (!msg.member) return;
		//if (msg.guild) client.emit('guildCreate', msg.guild);
		//const member = await getProfile(msg.member);
		//console.log(member);
		updateExperience(msg.member);
		if (msg.content.indexOf(guildSettings.prefix) === 0) {
			runCommand(msg, client, guildSettings);
			return;
		}

		//console.log(msg.content);
	},
};

const runCommand = (msg: Message, client: Client, settings: any) => {
	// parse message to get the command and arguments
	const args = msg.content.slice(settings.prefix.length).split(' ');
	const commandArg = args.shift()?.toLowerCase();

	let command = client.commands.get(commandArg);
	if (!command) {
		command = client.commands.get('other');
	}

	command.execute(client, msg, args, settings);
};

export { message };
/*
const fs = require('fs');

module.exports = async (client, msg) => {

	// use this to restrict servers bot is able to respond in
	//if (msg.guild.id == "guildIDhere") return;


	// load server settings from the config.js
	let settings;
	try {
		// this should probably get guild id?
		settings = await client.getGuild(msg.guild);
	} catch (err) {
		console.error(err);
	}

	// if message has correct prefix, run the command
	if (msg.content.indexOf(settings.prefix) === 0) {
		runCommand(msg, client, settings);
		return;
	}

	// give exp to user for every message.
	const expAmount = 1;
	try {
		await updateExperience(client, msg.member, expAmount, msg);
	} catch (err) {
		console.error(err);
	}

	// Check if Ilmatar has something to say.
	if (
		msg.content.toLowerCase().includes('ilmatar')
		// uncomment this if you want to restrict Ilmatar's markov to particular channel(s).
		// && msg.channel.id === "691190671717040150"
	) {
		try {
			await talk(msg);
		} catch (err) {
			console.error(err);
		}
	}

	// Message logging. Log only chosen channels and messages without attachments and embeds.
	if (
		//settings.isLogging
		checkIfLoggedChannel(msg.channel.id) &&
		msg.attachments.size === 0 &&
		msg.embeds.length === 0
	)
		log(msg.content);
};

const checkIfLoggedChannel = (channelID) => {
	if (channelID === 'channel_1_ID' || channelID === 'channel_2_ID') {
		return true;
	} else return false;
};

const runCommand = (msg, client, settings) => {
	// parse message to get the command and arguments
	const args = msg.content.slice(settings.prefix.length).split(' ');
	const commandArg = args.shift().toLowerCase();

	// find command, if not found use other.js
	const command = client.commands.get(commandArg);
	if (!command) {
		command = client.commands.get('other');
	}

	command.run(client, msg, args, settings);
};

// log is saved into a txt file to use in the Markov corpus.
// if you want to have proper message logging for admin purposes,
// a log database would be better.
const log = (content) => {
	const CreateFiles = fs.createWriteStream(process.cwd() + '/logs/log.txt', {
		flags: 'a', //flags: 'a' preserved old data
	});

	CreateFiles.write(content + '\r\n');
};
*/
const updateExperience = async (member: GuildMember, amount: number = 1) => {
	const newProfile = {
		guildID: member.guild.id,
		guildName: member.guild.name,
		userID: member.id,
		username: member.user.tag,
	};
	let profile;
	profile = await getProfile(member);
	console.log(profile[0]);
	if (profile.length === 0) {
		try {
			console.log('no profile');
			await createProfile(newProfile);
		} catch (err) {
			console.log(err);
		}
	}
	const newAmount = profile[0] ? profile[0].exp + amount : amount;
	try {
		await updateProfile(member, { exp: newAmount });
	} catch (err) {
		console.log(err);
	}
};
