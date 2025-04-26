const { Client, Partials } = require('discord.js');
const loadEvents = require("./loaders/event");
require("dotenv").config();

// Vérifiez si le token est chargé
if (!process.env.token) {
	console.error("Le token n'est pas défini dans le fichier .env !");
	process.exit(1);
}

// Crée uneinstance du bot
const client = new Client({
	intents: [3276799],
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

// Charge automatiquement les événements
loadEvents(client);

client.login(process.env.token);