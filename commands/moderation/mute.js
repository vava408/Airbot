const db = require('../../connexion.js');
const Discord = require('discord.js');

module.exports = {
	name: 'mute',
	description: 'Mute un utilisateur avec une raison. Utilisation : "!mute @utilisateur [raison]"',

	async execute(message, args) {
		if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
			return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
		}

		// Récupérer l'utilisateur mentionné
		const user = message.mentions.members.first();
		if (!user) {
			return message.reply('Veuillez mentionner un utilisateur à mute.');
		}

		// Récupérer la raison (optionnelle)
		const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';

		// Vérifie si le rôle "Muted" existe, sinon crée-le
		let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
		if (!muteRole) {
			try {
				muteRole = await message.guild.roles.create({
					name: 'Muted',
					color: '#808080',
					permissions: []
				});

				// Place le rôle Muted juste sous le rôle le plus haut du bot
				const botRole = message.guild.members.me.roles.highest;
				await muteRole.setPosition(botRole.position - 1);

				// Applique les permissions pour chaque salon
				for (const channel of message.guild.channels.cache.values()) {
					await channel.permissionOverwrites.edit(muteRole, {
						SendMessages: false,
						Speak: false,
						AddReactions: false
					});
				}
			} catch (err) {
				console.error('Erreur lors de la création du rôle Muted :', err);
				return message.reply('Une erreur est survenue lors de la création du rôle Muted.');
			}
		}

		// Ajoute le rôle Muted à l'utilisateur
		try {
			await user.roles.add(muteRole, reason);
		} catch (err) {
			console.error('Erreur lors de l\'ajout du rôle Muted :', err);
			return message.reply('Je n\'ai pas pu mute cet utilisateur. Vérifiez mes permissions.');
		}

		// Sauvegarde dans la base (si tu veux garder un historique)
		const query = `INSERT INTO info_mute (guild, \`user-mute\`, temps, reason, user) VALUES (?, ?, ?, ?, ?)`;
		const values = [
			message.guild.id,
			user.id,
			new Date(),
			reason,
			message.author.id
		];
		db.query(query, values, (err) => {
			if (err) {
				console.error('Erreur lors de l\'enregistrement du mute :', err);
			}
		});

		message.reply(`${user.user.tag} a été mute. Raison : "${reason}"`);
	}
};
