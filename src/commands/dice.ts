import { Client, Message } from 'discord.js';

exports.execute = (client: Client, msg: Message, args: any, settings: any) => {
	if (args.length != 1) return msg.channel.send('Syntax: !dice 1d6+n');

	getDiceRoll(client, msg, args);
};

exports.help = {
	name: 'dice',
};

const getDiceRoll = (client: Client, msg: Message, args: string[]) => {
	const results = roll(args[0]);
	if (!results) return msg.channel.send(`Incorrect parameters: ${args[0]}`);
	msg.channel.send(`Results of ${args[0]}: ${results.join(', ')}.`);
};
const roll = (args: string) => {
	const match = /^(\d+)?d(\d+)([+-]\d+)?$/.exec(args);
	if (!match) {
		return false;
	}

	const howMany = typeof match[1] == 'undefined' ? 1 : parseInt(match[1]);
	const diceSize = parseInt(match[2]);
	const modifier = typeof match[3] == 'undefined' ? 0 : parseInt(match[3]);
	let results = [];
	let total;
	for (let x = 0; x < howMany; x++) {
		results.push(Math.floor(Math.random() * diceSize + 1));
	}
	total = results.reduce((a, b) => a + b, 0) + modifier;

	return results;
};
