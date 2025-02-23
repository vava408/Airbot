const { readdirSync } = require("fs");

module.exports = function loadEvents(client) {

	let count = 0;
	const dirsEvent = readdirSync("./events/");

	for (const dir of dirsEvent) {
		const filesDir = readdirSync(`./events/${dir}/`).filter(f => f.endsWith(".js"));
		for (const file of filesDir) {
			const event = require(`../events/${dir}/${file}`);
			client[event.once ? "once" : "on"](event.name, (...eventArgs) => event.run(client, ...eventArgs));
			count++;
			const eventName = file.slice(0, -3); // Supprimer l'extension .js
			console.log(`[Events] => ${eventName} événement chargé`);
		}
	}

	console.log(`[Events] => ${count} événements chargés au total`);
};