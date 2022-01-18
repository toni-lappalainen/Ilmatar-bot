import { Schema, model } from 'mongoose';
import { Guild } from 'discord.js';
//const { defaultSettings: defaults } = require('../config');

interface IGuild {
	guildID: string;
	guildName: string;
	ownerID: string;
}

const guildSchema = new Schema<IGuild>({
	guildID: String,
	guildName: String,
	ownerID: String,
});
const GuildModel = model<IGuild>('Guild', guildSchema);

const getGuild = async (guild: Guild) => {
	const data = await GuildModel.find({ guildID: guild.id });
	return data;
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

const updateGuild = async (guild: Guild, data: any) => {
	try {
		const res = await getGuild(guild);
		const guildOld = res[0];

		Object.keys(data).forEach((key) => {
			if (guildOld[key as keyof IGuild] !== data[key as keyof IGuild])
				guildOld[key as keyof IGuild] = data[key as keyof IGuild];
		});
		guildOld.save();
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

export { GuildModel, IGuild, createGuild, getGuild, getGuilds, updateGuild };
