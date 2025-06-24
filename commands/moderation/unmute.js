const db = require('../../connexion.js'); // Importez la connexion à la base de données
const Discord = require('discord.js');

module.exports = {
	name: 'unmute', // Correction du nom de la commande
	description: 'Démute un utilisateur',
	async execute(message, args, client) {
		const user = message.mentions.members.first();
		if (!user) {
			return message.channel.send("Veuillez mentionner un utilisateur");
		}

		// Cherche le rôle "Muted"
		const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
		if (!muteRole) {
			return message.channel.send("Le rôle Muted n'existe pas sur ce serveur.");
		}

		// Vérifie si la personne est mute
		if (!user.roles.cache.has(muteRole.id)) {
			return message.channel.send("Cet utilisateur n'est pas mute.");
		}

		// Si mute, retire le rôle
		try {
			await user.roles.remove(muteRole, "Unmute par commande");
			message.channel.send(`${user.user.tag} a été démute.`);
		} catch (err) {
			console.error(err);
			message.channel.send("Erreur lors du démute.");
		}
	},
};