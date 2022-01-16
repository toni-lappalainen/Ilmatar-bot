import { GuildMember } from 'discord.js';
import { ProfileModel } from './models/models';

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
		profile.exp = data.exp;
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

export { createProfile, getProfile, getProfiles, updateProfile, clean };
