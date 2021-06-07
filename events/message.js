const fs = require("fs");

// here is defined what happens when user sends a message to a channel.

module.exports = async (client, msg) => {
  // use this if you don't want to use responds in DMs
  //if (!msg.guild) return;

  // use this to restrict servers bot is able to respond in
  //if (msg.guild.id == "guildIDhere") return;

  // don't respond to bot messages
  if (msg.author.bot) return;

  // load server settings from the config.js
  let settings;
  try {
    settings = await client.getGuild(msg.guild);
  } catch (err) {
    console.error(err);
  }

  // if message has correct prefix, run the command
  if (msg.content.indexOf(settings.prefix) === 0) {
    runCommand(msg, client, settings);
    return;
  }

  // give exp to user for every message.
  const expAmount = 1;
  try {
    await updateExperience(client, msg.member, expAmount, msg);
  } catch (err) {
    console.error(err);
  }

  // Check if Ilmatar has something to say.
  if (
    msg.content.toLowerCase().includes("ilmatar")
    // uncomment this if you want to restrict Ilmatar's markov to particular channel(s).
    // && msg.channel.id === "691190671717040150"
  ) {
    try {
      await talk(msg);
    } catch (err) {
      console.error(err);
    }
  }

  // Message logging. Log only chosen channels and messages without attachments and embeds.
  if (
    checkIfLoggedChannel(msg.channel.id) &&
    msg.attachments.size === 0 &&
    msg.embeds.length === 0
  )
    log(msg.content);
};

const checkIfLoggedChannel = (channelID) => {
  if (channelID === "channel_1_ID" || channelID === "channel_2_ID") {
    return true;
  } else return false;
};

const runCommand = (msg, client, settings) => {
  // parse message to get the command and arguments
  const args = msg.content.slice(settings.prefix.length).split(" ");
  const commandArg = args.shift().toLowerCase();

  // find command, if not found use other.js
  const command = client.commands.get(commandArg);
  if (!command) {
    command = client.commands.get("other");
  }

  command.run(client, msg, args, settings);
};

// log is saved into a txt file to use in the Markov corpus.
// if you want to have proper message logging for admin purposes,
// a log database would be better.
const log = (content) => {
  const CreateFiles = fs.createWriteStream(process.cwd() + "/logs/log.txt", {
    flags: "a", //flags: 'a' preserved old data
  });

  CreateFiles.write(content + "\r\n");
};

const updateExperience = async (client, member, amount, msg) => {
  const newProfile = {
    guildID: member.guild.id,
    guildName: member.guild.name,
    userID: member.id,
    username: member.user.tag,
  };
  const profile = await client.getProfile(member);

  if (!profile) await client.createProfile(newProfile);
  const newAmount = profile ? profile.exp + amount : amount;

  await client.updateProfile(member, { exp: newAmount });
};
