import { Schema, model } from 'mongoose';
import { GuildMember } from 'discord.js';

interface IProfile {
	[key: string]: any;
	guildID: string;
	guildName: string;
	userID: string;
	username: string;
	joined: Date;
	exp: number;
	level: number;
	//	boosters: [{ name: String; time: String }];
}

const profileSchema = new Schema<IProfile>(
	{
		guildID: String,
		guildName: String,
		userID: String,
		username: String,
		joined: { type: Date, default: Date.now },
		exp: {
			type: Number,
			default: 0,
		},
		level: {
			type: Number,
			default: 0,
		},
		//boosters: [{ name: String, time: String }],
	},
	{
		timestamps: true,
	}
);
const ProfileModel = model<IProfile>('Profile', profileSchema);

const createProfile = async (profile: any) => {
	console.log('adsasd' + profile);
	const newProfile = new ProfileModel(profile);
	try {
		await newProfile.save();
		console.log('asda' + newProfile);
	} catch (err) {
		console.log(err);
	}
};

const getProfiles = async () => {
	try {
		const data = await ProfileModel.find({});
		return data;
	} catch (err) {
		return 'error occured';
	}
};

const getProfile = async (user: GuildMember) => {
	//console.log("userID: " + user.id);
	//const data = await Guild.findOne({ userID: user.id });
	//	console.log(user);
	const data = await ProfileModel.find({ userID: user.id });
	return data;
};

const updateProfile = async (user: GuildMember, data: any) => {
	try {
		const res = await getProfile(user);
		const profile = res[0];

		Object.keys(data).forEach((key) => {
			if (profile[key as keyof IProfile] !== data[key as keyof IProfile])
				profile[key as keyof IProfile] = data[key as keyof IProfile];
		});
		profile.save();
		console.log(profile);
	} catch (err) {
		console.log(err);
	}
};

const clean = (text: any) => {
	if (typeof text === 'string') {
		return text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));
	} else {
		return text;
	}
};

export {
	ProfileModel,
	IProfile,
	createProfile,
	getProfile,
	getProfiles,
	updateProfile,
};
