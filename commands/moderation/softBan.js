const Discord = require('discord.js');

module.exports = {
	name: 'softban',
	description: 'Ban puis unban un utilisateur pour nettoyer ses messages.',
	async execute(message, args) {
		// Vérifiez les permissions de l'utilisateur qui exécute la commande
		if (!message.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
			return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
		}

		// Vérifiez si un utilisateur est mentionné
		const user = message.mentions.members.first();
		if (!user) {
			return message.reply('Veuillez mentionner un utilisateur à softban.');
		}

		// Vérifiez si l'utilisateur essaie de se softban lui-même
		if (user.id === message.author.id) {
			return message.reply('Vous ne pouvez pas vous softban vous-même.');
		}

		// Vérifiez si l'utilisateur mentionné est le propriétaire du serveur
		if (user.id === message.guild.ownerId) {
			return message.reply('Vous ne pouvez pas softban le propriétaire du serveur.');
		}

		// Vérifiez si une raison est fournie
		const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';

		// Vérifiez si le bot a les permissions nécessaires
		if (!message.guild.members.me.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
			return message.reply('Je n\'ai pas la permission de bannir des membres.');
		}

		// Vérifiez si l'utilisateur peut être banni
		if (!user.bannable) {
			return message.reply('Je ne peux pas softban cet utilisateur. Vérifiez mes permissions ou le rôle de l\'utilisateur.');
		}

		try {
			// Bannir l'utilisateur (avec suppression des messages des 7 derniers jours)
			await user.ban({ 
				reason: `[SOFTBAN] ${reason}`,
				deleteMessageSeconds: 7 * 24 * 60 * 60 // 7 jours
			});

			// Attendre un court instant avant de débannir
			await new Promise(resolve => setTimeout(resolve, 1000));

			// Débannir l'utilisateur
			await message.guild.members.unban(user.id, 'Softban - Déban automatique');

			message.channel.send(`${user.user.tag} a été softban avec succès. Ses messages ont été supprimés. Raison : "${reason}".`);

			// Tentez d'envoyer un message privé à l'utilisateur
			try {
				await user.send(`Vous avez été softban du serveur **${message.guild.name}** par **${message.author.tag}** pour la raison : "${reason}". Vos messages ont été supprimés mais vous pouvez rejoindre le serveur de nouveau.`);
			} catch (err) {
				console.warn('Impossible d\'envoyer un message privé à l\'utilisateur softban.');
			}
		} catch (err) {
			console.error('Erreur lors du softban de l\'utilisateur :', err);
			message.reply('Une erreur s\'est produite lors du softban de l\'utilisateur.');
		}
	},
};