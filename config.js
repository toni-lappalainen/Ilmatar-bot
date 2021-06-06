require("dotenv-flow").config();

module.exports = {
  owner: process.env.owner,
  token: process.env.CLIENT_TOKEN,
  cattoken: process.env.cattoken,
  dogtoken: process.env.dogtoken,
  youtubetoken: process.env.youtubetoken,
  trelloapi: process.env.trelloapi,
  trellotoken: process.env.trellotoken,
  lasttoken: process.env.lasttoken,
  lastsecret: process.env.lastsecret,
  CAT_API_URL: process.env.CAT_API_URL,
  DOG_API_URL: process.env.DOG_API_URL,
  defaultSettings: {
    prefix: process.env.prefix,
    welcomeChannel: "welcome",
    welcomeMsg: "Welcome **{{user}}** to **{{guild}}**!",
    modRole: "Moderator",
    adminRole: "Administrator",
  },
};
