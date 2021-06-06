module.exports = (client) => {
	console.log(`Logged in as ${client.user.tag}!`);
	/*
	const welcome = client.channels.cache.find((c) => c.name === "tervetuloa");
	//	const verify = client.channels.find((c) => c.name === "verify");

	const fetchedMessages = [welcome];
	fetchedMessages.forEach((c) => {
		c.fetchMessages({ limit: 10 })
			.then((collected) =>
				console.log(`Fetched ${collected.size} messages in ${c.name}.`)
			)
			.catch(console.error);
	});
	*/
};
