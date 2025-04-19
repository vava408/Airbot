const db = require('../../connexion.js'); // Importez la connexion à la base de données
const Discord = require('discord.js');

module.exports = {
	name: 'mute', // Nom de la commande
	description: 'Mute un utilisateur avec une durée et une raison. Utilisation : "!mute @utilisateur durée [raison]"',

	async execute(message, args) {
		// Vérifiez les permissions de l'utilisateur
		if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
			return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
		}

		// Vérifiez si un utilisateur est mentionné
		const user = message.mentions.members.first();
		if (!user) {
			return message.reply('Veuillez mentionner un utilisateur à mute.');
		}

		// Vérifiez si une durée est fournie
		const duration = args[1];
		if (!duration || isNaN(parseInt(duration))) {
			return message.reply('Veuillez spécifier une durée en minutes.');
		}

		// Récupérez la raison (optionnelle)
		const reason = args.slice(2).join(' ') || 'Aucune raison spécifiée';

		// Vérifiez si le rôle "Muted" existe, sinon créez-le
		let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
		if (!muteRole) {
			try {
				muteRole = await message.guild.roles.create({
					name: 'Muted',
					color: '#808080',
					permissions: []
				});

				// Appliquez les permissions pour chaque canal
				message.guild.channels.cache.forEach(async (channel) => {
					await channel.permissionOverwrites.create(muteRole, {
						SendMessages: false,
						Speak: false,
						AddReactions: false
					});
				});
			} catch (err) {
				console.error('Erreur lors de la création du rôle Muted :', err);
				return message.reply('Une erreur s\'est produite lors de la création du rôle Muted.');
			}
		}

		// Ajoutez le rôle "Muted" à l'utilisateur
		try {
			await user.roles.add(muteRole, reason);
		} catch (err) {
			console.error('Erreur lors de l\'ajout du rôle Muted :', err);
			return message.reply('Je n\'ai pas pu mute cet utilisateur. Vérifiez mes permissions.');
		}

		// Stockez les informations dans la base de données (table temporaire)
		const tempQuery = `INSERT INTO mute (guild, \`user-mute\`, temps) VALUES (?, ?, ?)`;
		const tempValues = [message.guild.id, user.id, duration];
		db.query(tempQuery, tempValues, (err) => {
			if (err) {
				console.error('Erreur lors de l\'enregistrement du mute temporaire :', err);
				return message.reply('Une erreur s\'est produite lors de l\'enregistrement du mute temporaire.');
			}
		});

		// Stockez les informations dans la base de données (table définitive)
		const definitiveQuery = `INSERT INTO info_mute (guild, \`user-mute\`, temps, reason, user) VALUES (?, ?, ?, ?, ?)`;
		const definitiveValues = [
			message.guild.id,
			user.id,
			new Date(),
			reason,
			message.author.id
		];
		db.query(definitiveQuery, definitiveValues, (err) => {
			if (err) {
				console.error('Erreur lors de l\'enregistrement du mute définitif :', err);
				return message.reply('Une erreur s\'est produite lors de l\'enregistrement du mute définitif.');
			}
		});

		// Réponse de confirmation
		message.reply(`${user.user.tag} a été mute pour ${duration} minute(s) avec la raison : "${reason}".`);

		// Retirez le rôle "Muted" après la durée spécifiée
		setTimeout(async () => {
			if (user.roles.cache.has(muteRole.id)) {
				try {
					await user.roles.remove(muteRole, 'Fin du mute');
					message.channel.send(`${user.user.tag} n\'est plus mute.`);
				} catch (err) {
					console.error('Erreur lors de la suppression du rôle Muted :', err);
				}
			}
		}, parseInt(duration) * 60 * 1000); // Convertir les minutes en millisecondes
	}
};