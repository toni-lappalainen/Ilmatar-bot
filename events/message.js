const fs = require("fs");
const MarkovIlmatar = require("../utils/markov.js");
const roll = require("../utils/math");

let build = false;
let markov;

module.exports = async (client, msg) => {
	//TODO: create importable corpus so no need to build everytime.
	if (msg.content.split(" ")[0] === "build" && !build) {
		build = true;
		console.log("building...");
		markov = new MarkovIlmatar().markov;
	}

	if (!msg.guild) return;
	if (msg.guild.id == "199464277021556738") return;

	let settings;
	try {
		settings = await client.getGuild(msg.guild);
	} catch (err) {
		console.error(err);
	}

	if (msg.author.bot) return;

	if (msg.content.indexOf(settings.prefix) === 0) {
		runCommand(msg, client, settings);
		return;
	}

	// if guild is not psiloinfo, return.
	if (msg.guild.id != "688655491827630121") return;
	// give exp to user for every message. =========================
	const expAmount = 1;
	//console.log('messageCheck', messageCheck, 'expCheck', expAmount);
	try {
		await updateExp(client, msg.member, expAmount, msg);
	} catch (err) {
		console.error(err);
	}

	// Check if Ilmatar has something to say ==========================
	if (
		msg.content.toLowerCase().includes("ilmatar") &&
		msg.channel.id === "691190671717040150"
	) {
		try {
			await talk(msg);
		} catch (err) {
			console.error(err);
		}
	}

	if (
		roll("1d100") === 23 &&
		msg.channel.id != "691190671717040150" &&
		(checkIfProperChannel(msg.channel.id) ||
			msg.channel.id === "782607440037806100" ||
			msg.channel.id === "597391786226483200")
	) {
		try {
			await talk(msg);
		} catch (err) {
			console.error(err);
		}
	}

	// Logs messages =================================================

	if (
		checkIfProperChannel(msg.channel.id) &&
		msg.attachments.size === 0 &&
		msg.embeds.length === 0
	)
		log(msg.content);
};

function checkIfProperChannel(channelID) {
	if (
		channelID === "688655492293328928" || //yleinen
		channelID === "781054211098017814" || // politiikka
		channelID === "692067594038935682"
	) {
		//harrastukset ja ruoka
		return true;
	} else return false;
}

function runCommand(msg, client, settings) {
	//const args = msg.content.slice(prefix.length).trim().split(/ +/g);
	const args = msg.content.slice(settings.prefix.length).split(" ");
	const command = args.shift().toLowerCase();

	let cmd = client.commands.get(command);
	if (!cmd) {
		cmd = client.commands.get("other");
	}

	cmd.run(client, msg, args, settings);
}

function log(content) {
	const CreateFiles = fs.createWriteStream(process.cwd() + "/logs/log.txt", {
		flags: "a", //flags: 'a' preserved old data
	});

	CreateFiles.write(content + "\r\n");
}

async function updateExp(client, member, amount, msg) {
	const newProfile = {
		guildID: member.guild.id,
		guildName: member.guild.name,
		userID: member.id,
		username: member.user.tag,
	};
	const profile = await client.getProfile(member);
	//console.log("M: " + member);

	if (!profile) await client.createProfile(newProfile);
	const newAmount = profile ? profile.exp + amount : amount;

	if (
		newAmount > 50 &&
		!member.roles.cache.find((r) => r.name === "Aktiiviset")
	) {
		const role = msg.guild.roles.cache.find((r) => r.name == "Aktiiviset");
		member.roles.add(role);
	}

	await client.updateProfile(member, { exp: newAmount });
}

async function talk(msg) {
	let result;
	let args = msg.content.split(" ");
	if (args.length > 1) {
		let randomArg = args[Math.floor(Math.random() * args.length)];
		const options = {
			maxTries: 60, // Give up if I don't have a sentence after 20 tries (default is 10)
			prng: Math.random, // An external Pseudo Random Number Generator if you want to get seeded results
			filter: (result) => {
				return (
					result.string.split(" ").length >= 3 && // At least 5 words
					result.string.includes(randomArg) && // Include argument 0
					result.score > 0 &&
					!result.string.includes("/[@]/g")
				);
			},
		};

		console.log("1: " + randomArg);
		try {
			result = await markov.generate(options);
			msg.channel.send(result.string);
			console.log(result);
		} catch (err) {
			defaultTalk();
			console.error(err);
		}
	} else {
		defaultTalk();
	}

	async function defaultTalk() {
		const options = {
			maxTries: 60, // Give up if I don't have a sentence after 20 tries (default is 10)
			prng: Math.random, // An external Pseudo Random Number Generator if you want to get seeded results
			filter: (result) => {
				return (
					result.string.split(" ").length >= 4 && // At least 5 words
					result.string.endsWith(".") && // End sentences with a dot.
					result.score > 10 &&
					!result.string.includes("/[@]/g")
				);
			},
		};
		try {
			result = await markov.generate(options);
			msg.channel.send(result.string);
			console.log(result);
		} catch (err) {
			console.log(options);
			console.error(err);
		}
	}
}
