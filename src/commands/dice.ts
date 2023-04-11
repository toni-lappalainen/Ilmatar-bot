//import { Message } from 'discord.js';
import { Command } from '../types';

const command: Command = {
	name: 'dice',
	description: 'Syntax: !dice 1d6+n',
	aliases: ['roll', 'd', 'n'],
	execute: (msg, args) => {
		if (args.length != 1) return msg.channel.send('Syntax: !dice 1d6+n');

		return getDiceRoll(args);
	},
	cooldown: 1,
	permissions: [],
};

const getDiceRoll = (args: string[]): String => {
	const results = roll(args[0]);
	if (!results) return `Incorrect parameters: ${args[0]}`;

	return `Results of ${args[0]}: ${results.join(', ')}.`;
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
