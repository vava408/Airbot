const { Client } = require("discord.js");
const loadEvents = require("./loaders/event");
require("dotenv").config();

// Crée une instance du bot
const client = new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent"] // Ajoutez les intents nécessaires
});

// Charge automatiquement les événements
loadEvents(client);

client.login(process.env.token);