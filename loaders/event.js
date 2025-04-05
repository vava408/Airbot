const { readdirSync } = require("fs");
const path = require("path");

module.exports = function loadEvents(client) {
    let count = 0;
    const dirsEvent = readdirSync(path.join(__dirname, "../events"));

    for (const dir of dirsEvent) {
        const filesDir = readdirSync(path.join(__dirname, `../events/${dir}`)).filter(f => f.endsWith(".js"));
        for (const file of filesDir) {
            const event = require(path.join(__dirname, `../events/${dir}/${file}`));
            client[event.once ? "once" : "on"](event.name, (...eventArgs) => event.run(client, ...eventArgs));
            count++;
            const eventName = file.slice(0, -3); // Supprimer l'extension .js
            console.log(`[Events] => ${eventName} événement chargé`);
        }
    }

    console.log(`[Events] => ${count} événements chargés au total`);
};