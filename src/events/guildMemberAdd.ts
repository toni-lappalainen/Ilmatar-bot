import exampleMessage from './../strings/welcome';
import { Client, GuildMember } from 'discord.js';
import { config } from './../config';
import { createProfile } from '../database/profiles';

const guildMemberAdd = {
	name: 'guildMemberAdd',
	once: false,
	execute: async (client: Client, ...args: GuildMember[]) => {
		const member = args[0];
		// TODO: server and channels and messages from file!

		// set the server(s) where you want to use welcome messages and other functions
		// Here is example with server ID, welcome message that is loaded
		// from strings/example.js,
		// and function to add user into database.
		const guildSettings = config.guildSettings.find(
			(guild) => guild.id === member.guild.id
		);
		if (guildSettings && guildSettings.welcome) {
			const channel = member.guild.channels.resolve(
				guildSettings.welcomeChannel
			);
			if (!channel) return;
			if (channel.isText()) {
				channel.send(exampleMessage(member));
			}
		}

		const newProfile = {
			guildID: member.guild.id,
			guildName: member.guild.name,
			userID: member.id,
			username: member.user.tag,
		};
		console.log(newProfile);
		try {
			await createProfile(newProfile);
		} catch (err) {
			console.error(err);
		}
	},
};
export { guildMemberAdd };
