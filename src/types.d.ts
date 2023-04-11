import { Collection, Message, PermissionResolvable } from 'discord.js';

export interface Command {
	name: string;
	description: string;
	aliases: string[];
	execute: (message: Message, args: Array<string>) => void;
	cooldown?: number;
	permissions: Array<PermissionResolvable>;
}

declare module 'discord.js' {
	export interface Client {
		commands: Collection<string, Command>;
	}
}
