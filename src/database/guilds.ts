import { Guild } from 'discord.js';
import { GuildModel } from './models/models';
import { config } from '../config';

const getGuild = async (guild: Guild) => {
	try {
		const data = await GuildModel.find({ guildID: guild.id });
		return data;
	} catch (err) {
		console.log(err);
	}
};

const getGuilds = async () => {
	try {
		const data = await GuildModel.find();
		console.log('asd:' + data);
		return data;
	} catch (err) {
		return 'error occured';
	}
};

const updateGuild = async (guild: Guild, settings: any) => {
	try {
		const guildData = await getGuild(guild);
		if (guildData instanceof GuildModel) guildData.save();
	} catch (err) {
		console.log(err);
	}
};

const createGuild = async (guildParams: Object) => {
	//const merged = Object.assign(defaults, guild);
	const newGuild = new GuildModel(guildParams);
	try {
		await newGuild.save();
		console.log(newGuild);
	} catch (err) {
		console.log(err);
	}
};

export { createGuild, getGuild, getGuilds, updateGuild };
