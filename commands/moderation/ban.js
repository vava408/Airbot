const db = require('../../connexion.js'); // Importez la connexion à la base de données
const Discord = require('discord.js');

module.exports = {
	name: 'ban', // Nom de la commande
	description: 'Ban un utilisateur ajouter une reason si vous le voulez apres la mention. "!ban @utilisateur + reason" ', // Description de la commande
	async execute(message, args) {
		// Vérifiez les permissions de l'utilisateur qui exécute la commande
		if (!message.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
			return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
		}

		// Vérifiez si un utilisateur est mentionné
		const user = message.mentions.members.first(); // Utilisez `message.mentions.members` pour obtenir un membre
		if (!user) {
			return message.reply('Veuillez mentionner un utilisateur à bannir.');
		}

		// Vérifiez si l'utilisateur essaie de se bannir lui-même
		if (user.id === message.author.id) {
			return message.reply('Vous ne pouvez pas vous bannir vous-même.');
		}

		// Vérifiez si l'utilisateur mentionné est le propriétaire du serveur
		if (user.id === message.guild.ownerId) {
			return message.reply('Vous ne pouvez pas bannir le propriétaire du serveur.');
		}

		// Vérifiez si une raison est fournie
		const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';

		// Vérifiez si le bot a les permissions nécessaires pour bannir l'utilisateur
		if (!message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
			return message.reply('Je n\'ai pas la permission de bannir des membres.');
		}

		// Vérifiez si l'utilisateur peut être banni
		if (!user.bannable) {
			return message.reply('Je ne peux pas bannir cet utilisateur. Vérifiez mes permissions ou le rôle de l\'utilisateur.');
		}

		try {
			// Bannir l'utilisateur
			await user.ban({ reason });
			message.channel.send(`${user.user.tag} a bien été banni pour la raison : "${reason}".`);

			// Tentez d'envoyer un message privé à l'utilisateur banni
			try {
				await user.send(`Vous avez été banni du serveur **${message.guild.name}** par **${message.author.tag}** pour la raison : "${reason}".`);
			} catch (err) {
				console.warn('Impossible d\'envoyer un message privé à l\'utilisateur banni.');
				message.reply('L\'utilisateur a bloqué les messages privés ou n\'accepte pas les messages.');
			}

			// Enregistrez l'action dans la base de données
			const query = `INSERT INTO ban (guildID, userID, authorID, reason, date) VALUES (?, ?, ?, ?, ?)`;
			const values = [
				message.guild.id,
				user.id,
				message.author.id,
				reason,
				new Date()
			];

			db.query(query, values, (err) => {
				if (err) {
					console.error('Erreur lors de l\'enregistrement du bannissement dans la base de données :', err.message);
					return message.reply('Une erreur s\'est produite lors de l\'enregistrement du bannissement.');
				}

				// Confirmation de l'enregistrement
				console.log(`Bannissement de ${user.user.tag} enregistré dans la base de données.`);
			});
		} catch (err) {
			console.error('Erreur lors du bannissement de l\'utilisateur :', err);
			message.reply('Une erreur s\'est produite lors du bannissement de l\'utilisateur.');
		}
	},
};