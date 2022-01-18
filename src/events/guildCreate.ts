// Create new server entry into the database
import { Guild, Client } from 'discord.js';
import { createGuild } from './../database/models/guild';

module.exports = {
	name: 'guildCreate',
	once: false,
	execute: async (client: Client, ...args: Guild[]) => {
		const guild = args[0];

		const newGuild = {
			guildID: guild.id,
			guildName: guild.name,
			ownerID: guild.ownerId,
		};

		try {
			await createGuild(newGuild);
		} catch (error) {
			console.error(error);
		}
	},
};
