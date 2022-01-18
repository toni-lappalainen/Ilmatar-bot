import { Client, Message } from 'discord.js';

exports.execute = (client: Client, msg: Message, args: any, settings: any) => {
	msg.channel.send('Pong!').catch(console.error);
};

exports.help = {
	name: 'ping',
};
