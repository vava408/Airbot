const db = require('../../connexion.js'); // Importez la connexion à la base de données
const Discord = require('discord.js');

module.exports = {
	name: 'infowarn',
	description: 'Affiche les avertissements d\'un utilisateur ou de tout le serveur. Utilisation : "!infowarn [@utilisateur] " "!infowarn [@utilisateur] ".',
	execute(message, args) {
		// Vérifiez les permissions
		if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
			return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
		}

		// Si un utilisateur est mentionné, affiche ses avertissements
		const user = message.mentions.users.first();
		if (user) {
			const query = `SELECT * FROM warn WHERE guildID = ? AND userID = ?`;
			const values = [message.guild.id, user.id];

			db.query(query, values, (err, results) => {
				if (err) {
					console.error('Erreur lors de la récupération des avertissements :', err.message);
					return message.reply('Une erreur s\'est produite lors de la récupération des avertissements.');
				}

				if (results.length === 0) {
					return message.reply(`L'utilisateur ${user.tag} n'a aucun avertissement.`);
				}

				const embed = new Discord.EmbedBuilder()
					.setColor('#ffcc00')
					.setTitle(`📋 Avertissements de ${user.tag}`)
					.setThumbnail(user.displayAvatarURL())
					.setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
					.setTimestamp();

				results.forEach((warn, index) => {
					embed.addFields({
						name: `Avertissement #${index + 1}`,
						value: `**Auteur** : <@${warn.authorID}>\n**Raison** : ${warn.reason}\n**Date** : ${new Date(warn.date).toLocaleString()}`,
						inline: false,
					});
				});

				message.channel.send({ embeds: [embed] });
			});
		} else {
			// Si aucun utilisateur n'est mentionné, affiche tous les avertissements du serveur
			const query = `SELECT userID, COUNT(*) AS warnCount FROM warn WHERE guildID = ? GROUP BY userID`;
			const values = [message.guild.id];

			db.query(query, values, (err, results) => {
				if (err) {
					console.error('Erreur lors de la récupération des avertissements :', err.message);
					return message.reply('Une erreur s\'est produite lors de la récupération des avertissements.');
				}

				if (results.length === 0) {
					return message.reply('Aucun avertissement n\'a été enregistré sur ce serveur.');
				}

				const totalWarns = results.reduce((sum, row) => sum + row.warnCount, 0);

				const embed = new Discord.EmbedBuilder()
					.setColor('#ffcc00')
					.setTitle('📋 Avertissements du serveur')
					.setDescription(`Nombre total d'avertissements : **${totalWarns}**`)
					.setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
					.setTimestamp();

				results.forEach((row) => {
					embed.addFields({
						name: `Utilisateur : <@${row.userID}>`,
						value: `**Nombre d'avertissements** : ${row.warnCount}`,
						inline: false,
					});
				});

				message.channel.send({ embeds: [embed] });
			});
		}
	},
};