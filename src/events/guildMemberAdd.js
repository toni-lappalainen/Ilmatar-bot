import exampleMessage from "./../strings/example";

module.exports = async (client, member) => {
  // TODO: server and channels and messages from file!

  // set the server(s) where you want to use welcome messages and other functions
  // Here is example with server ID, welcome message that is loaded from strings/example.js,
  // and function to add user into database.

  const exampleID = client.config.EXAMPLE_ID;

  // if the server is not the one defined, return.
  // If you have multiple servers, check for true instead.
  if (member.guild.id != exampleID) return;

  // find the channel that we want to send the welcome message
  // you can also use channel ID here.
  const channel = member.guild.channels.cache.find((c) => c.name === "welcome");

  // send the message using imported string
  channel.send(exampleMessage(member));

  // create new entry to the database
  const newProfile = {
    guildID: member.guild.id,
    guildName: member.guild.name,
    userID: member.id,
    username: member.user.tag,
  };

  try {
    await client.createProfile(newProfile);
  } catch (err) {
    console.error(err);
  }
};
