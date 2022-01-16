import { Schema, model } from 'mongoose';
//const { defaultSettings: defaults } = require('../config');

interface Guild {
	guildID: string;
	guildName: string;
	ownerID: string;
}

const guildSchema = new Schema<Guild>({
	guildID: String,
	guildName: String,
	ownerID: String,
});
const GuildModel = model<Guild>('Guild', guildSchema);
export { GuildModel };
