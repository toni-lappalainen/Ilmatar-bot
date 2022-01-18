import { Client, Message, GuildMember } from 'discord.js';
import { config } from './../config';
import {
	getProfile,
	createProfile,
	updateProfile,
} from '../database/models/profile';

module.exports = {
	name: 'messageCreate',
	once: false,
	execute: async (client: Client, ...args: Message[]) => {
		const msg = args[0];
		// use this if you don't want to use responds in DMs
		//	if (!msg.guild) return;

		if (msg.author.bot) return;

		const guildSettings = config.guildSettings.find(
			(guild) => guild.id === msg.guildId
		);

		if (!msg.member) return;

		if (!guildSettings) return;
		if (msg.content.indexOf(guildSettings.prefix) === 0) {
			runCommand(msg, client, guildSettings);
			return;
		}
		if (guildSettings.exp) updateExperience(msg.member);
	},
};

const runCommand = (msg: Message, client: Client, settings: any) => {
	const args = msg.content.slice(settings.prefix.length).split(' ');
	const commandArg = args.shift()?.toLowerCase();

	let command = client.commands.get(commandArg);
	if (!command) {
		command = client.commands.get('other');
	}

	command.execute(client, msg, args, settings);
};

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
