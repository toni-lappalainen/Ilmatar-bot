// Create new server entry into the database
import { Guild, Client } from 'discord.js';
import { config } from './../config';
import { createGuild } from './../database/guilds';

const guildCreate = {
	name: 'guildCreate',
	once: false,
	execute: async (client: Client, ...args: Guild[]) => {
		const guild = args[0];
		const guildSettings = config.guildSettings.find(
			(settingsGuild) => settingsGuild.id === guild.id
		);

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
export { guildCreate };
