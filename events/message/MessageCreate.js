const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Chemin vers le dossier des commandes
const commandsDir = path.join(__dirname, '../../commands');

// Collection pour stocker les commandes
const commands = new Map();

// Fonction pour charger toutes les commandes
const loadCommands = (dir) => {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			// Recherche dans les sous-dossiers
			loadCommands(fullPath);
		} else if (file.endsWith('.js')) {
			const command = require(fullPath);
			if (command.name) {
				commands.set(command.name.toLowerCase(), command); // Utilise le champ `name` comme clé
			} else {
				console.warn(`Le fichier ${file} n'a pas de champ "name" et ne sera pas chargé.`);
			}
		}
	}
};

// Charger toutes les commandes
loadCommands(commandsDir);

// Afficher les commandes dans la console
console.log('Commandes enregistrées :');
commands.forEach((_, name) => console.log(`- ${name}`));
console.log(`Nombre total de commandes : ${commands.size}`);

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async run(client, message) {
		// Ignore les messages provenant des bots
		if (message.author.bot) return;

		// Préfixe fixe
		const prefix = '!';

		// Vérifie si le message commence par le préfixe
		if (!message.content.startsWith(prefix)) return;

		// Supprime le préfixe et divise le message en commande et arguments
		const args = message.content.slice(prefix.length).trim().split(/\s+/);
		const commandName = args.shift().toLowerCase();

		// Recherche de la commande dans la collection
		const command = commands.get(commandName);

		if (!command) {
			message.reply(`La commande \`${commandName}\` n'existe pas.`);
			return;
		}

		try {
			// Exécuter la commande en passant `client`
			command.execute(message, args, client);
		} catch (error) {
			console.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error);
			message.reply('Une erreur s\'est produite lors de l\'exécution de cette commande.');
		}
	},
};
