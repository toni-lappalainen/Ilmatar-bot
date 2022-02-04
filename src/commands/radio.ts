import {
	Client,
	Message,
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	VoiceChannel,
	ColorResolvable,
} from 'discord.js';
import fetch from 'cross-fetch';
import { config } from './../config';
import {
	createAudioPlayer,
	createAudioResource,
	StreamType,
	joinVoiceChannel,
	AudioPlayerStatus,
	VoiceConnection,
	VoiceConnectionStatus,
	entersState,
	getVoiceConnection,
} from '@discordjs/voice';
import { getMainColor } from '../utils/images';

// Implementation for playing audio stream from internet radio
// This version is made to use with AzuraCast-based stream,
//should be easy enough to change for others as well.

const player = createAudioPlayer();
const { URL, API, streamTitle, iconURL, siteURL, footer } =
	config.radioSettings;
const APICallInterval = 20000;
let connection: VoiceConnection;
let apiCall: any = null;
let lastSong: string = '';
// 0 = no info, 1 = basic, 2 = full, 3 = embed
let infoLevel = 4;
let songInfo: any = {};

exports.execute = async (
	client: Client,
	msg: Message,
	args: string[],
	settings: any
) => {
	const channel: any = msg.member?.voice.channel!;

	if (args[0] === 'init' && player.state.status === 'idle') {
		try {
			await initiatePlay();
			console.log('Stream is ready to play!');
			tryConnectVoiceChannel(channel, msg);
			getMetadata(client, msg);
			apiCall = setInterval(() => {
				getMetadata(client, msg);
			}, APICallInterval);
		} catch (error) {
			console.error(error);
		}
	}
	if (player.state.status === 'idle') {
		msg.reply('No audio playing. Use !radio init to start.');
		return;
	}

	if (args.length === 0) sendSongInfo(msg, 1);

	if (args[0] === 'stop') {
		clearInterval(apiCall);
		const connection = getVoiceConnection(channel.guild.id);
		if (connection) connection.destroy();
		player.stop();
	}
	if (args[0] === 'no') {
		infoLevel = 0;
	}
	if (args[0] === 'basic') {
		infoLevel = 1;
	}
	if (args[0] === 'full') {
		infoLevel = 2;
	}
	if (args[0] === 'embed') {
		infoLevel = 3;
	}
	if (args[0] === 'embed_big') {
		infoLevel = 4;
	}
};

player.on('error', (error) => {
	console.error(error);
});

exports.help = {
	name: 'radio',
};

const initiatePlay = () => {
	const resource = createAudioResource(URL, {
		inputType: StreamType.Arbitrary,
	});

	player.play(resource);

	/**
	 * Here we are using a helper function. It will resolve if the player enters the Playing
	 * state within 5 seconds, otherwise it will reject with an error.
	 */
	return entersState(player, AudioPlayerStatus.Playing, 5e3);
};

const tryConnectVoiceChannel = async (channel: VoiceChannel, msg: Message) => {
	if (channel && !connection) {
		try {
			connection = await connectToVoice(channel);

			connection.subscribe(player);
		} catch (error) {
			console.error(error);
		}
	} else {
		void msg.reply('Join a voice channel then try again!');
	}
};

const connectToVoice = async (channel: VoiceChannel) => {
	const voiceConnection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});

	try {
		await entersState(voiceConnection, VoiceConnectionStatus.Ready, 30e3);
		return voiceConnection;
	} catch (error) {
		voiceConnection.destroy();
		throw error;
	}
};

const changeStatus = (client: Client, text: string) => {
	client.user?.setPresence({
		activities: [{ name: text, type: 'LISTENING' }],
	});
};

const getMetadata = async (client: Client, msg: Message) => {
	try {
		const res = await fetch(API);

		if (res.status >= 400) {
			throw new Error('Bad response from server');
		}

		const data = await res.json();
		const newSong = data.now_playing.song.text;
		if (lastSong === newSong) return;

		changeStatus(client, data.now_playing.song.text);
		lastSong = newSong;
		const link = data.now_playing.song.custom_fields?.link || siteURL;

		songInfo = {
			text: data.now_playing.song.text,
			artist: data.now_playing.song.artist,
			song: data.now_playing.song.title,
			album: data.now_playing.song.album,
			link: link.split(' ').pop(),
			art: data.now_playing.song.art,
		};

		console.log(songInfo);
		sendSongInfo(msg, infoLevel);
	} catch (err) {
		console.error(err);
	}
};

const sendSongInfo = async (msg: Message, level: number) => {
	if (level === 0) return;
	else if (level === 1) {
		msg.channel.send(`now playing: **${songInfo.text}** `);
	} else if (level === 2) {
		msg.channel.send(
			`now playing: **${songInfo.text}** from **${songInfo.album}**. Bandcamp: <${songInfo.link}>`
		);
	} else if (level === 3 || level === 4) {
		const embed = await createEmbed(songInfo);
		msg.channel.send(embed);
	}
};

const createEmbed = async (info: any) => {
	let color: ColorResolvable = 'AQUA';
	await getMainColor(info.art).then((hexValue) => {
		color = `#${hexValue}`;
	});

	//	getMainColor(color);
	const songInfoEmbed = new MessageEmbed()
		.setColor(color)
		.setTitle(info.text)
		.setURL(info.link)
		.setAuthor({
			name: streamTitle,
			iconURL: iconURL,
			url: siteURL,
		})
		.setDescription(`from the album **${info.album}**`)
		//.setThumbnail('https://i.imgur.com/AfFp7pu.png')
		//.addFields()
		//	.setImage(info.art)
		.setFooter({
			text: footer,
			//	iconURL: iconURL,
		});
	/*const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setLabel('Bandcamp')
			.setURL(info.link)
			//.setEmoji('♫')
			.setStyle('LINK')
	); */
	const artURL = info.art.substring(info.art.lastIndexOf('/') + 1);
	if (artURL !== 'generic_song.jpg') {
		if (infoLevel === 4) songInfoEmbed.setImage(info.art);
		if (infoLevel === 3) songInfoEmbed.setThumbnail(info.art);
	}

	return { embeds: [songInfoEmbed] };
};
