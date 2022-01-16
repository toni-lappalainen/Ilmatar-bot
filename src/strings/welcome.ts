// strings are template strings, add needed parameters.
// in this example we only need the user whom the message is directed at.

import { GuildMember } from 'discord.js';

export default (member: GuildMember) => {
	return `Welcome, ${member}!
    Hope you enjoy your stay. Please read the server rules carefully.`;
};
