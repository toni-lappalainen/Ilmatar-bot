const { Client, Collection } = require("discord.js");
const fs = require("fs");
require("dotenv-flow").config();

const client = new Client();

require("./utils/functions")(client);

client.commands = new Collection();
client.mongoose = require("./utils/mongoose");
// config has all the individual api tokens/secrets/etc, and other settings
// they can be in the actual config file, or loaded from .env file.
client.config = require("./config");

// read all files in events directory
// Events are everything that can happen in the servers/channels,
// like a user joining for the first time, or someone talking.

fs.readdir("./events/", (err, files) => {
  if (err) return console.error;
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`Loaded event '${eventName}'`);
    client.on(eventName, event.bind(null, client));
  });
});

// read all files in commands directory
// The individual commands the bot can understand.
fs.readdir("./commands/", async (err, files) => {
  if (err) return console.error;
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    // commandName format: jatsi.js -> jatsi js -> cmdName = jatsi
    let commandName = file.split(".")[0];
    console.log(`Loaded command '${commandName}'`);
    client.commands.set(commandName, props);
  });
});

client.mongoose.init();
client.login(client.config.token);
