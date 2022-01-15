require('dotenv-flow').config();

const config = {
	prefix: process.env.PREFIX ?? '',
	owner: process.env.OWNER ?? '',
	clientId: process.env.CLIENT_ID ?? '',
	token: process.env.CLIENT_TOKEN ?? '',
	cattoken: process.env.CATTOKEN ?? '',
	dogtoken: process.env.DOGTOKEN ?? '',
	youtubetoken: process.env.YOUTUBETOKEN ?? '',
	trelloapi: process.env.TRELLOAPI ?? '',
	trellotoken: process.env.TRELLOTOKEN ?? '',
	lasttoken: process.env.LASTTOKEN ?? '',
	lastsecret: process.env.LASTSECRET ?? '',
	CAT_API_URL: process.env.CAT_API_URL ?? '',
	DOG_API_URL: process.env.DOG_API_URL ?? '',
	defaultguildId: process.env.DEFAULTGUILD_ID ?? '',
	defaultSettings: {
		name: 'default',
		prefix: process.env.PREFIX ?? '',
		welcomeChannel: 'welcome',
		welcomeMsg: 'Welcome **{{user}}** to **{{guild}}**!',
		modRole: 'Moderator',
		adminRole: 'Administrator',
	},
	guildSettings: [
		{
			name: process.env.GUILDNAME ?? '',
			id: process.env.DEFAULTGUILD_ID ?? '',
			prefix: process.env.PREFIX ?? '',
		},
	],
};

export { config };
