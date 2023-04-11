//import { Client, Message, PermissionFlagsBits } from 'discord.js';

import { Command } from '../types';

const command: Command = {
	name: 'ping',
	description: 'Ping!',
	aliases: ['pong'],
	execute: (msg) => {
		msg.channel.send('Pong!').catch(console.error);
	},
	cooldown: 10,
	permissions: ['Administrator'],
};
export default command;

/*
exports.execute = (client: Client, msg: Message, args: any, settings: any) => {
	msg.channel.send('Pong!').catch(console.error);
};

exports.help = {
	name: 'ping',
};
*/
