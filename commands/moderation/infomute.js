const db = require('../../connexion.js'); // Importez la connexion à la base de données
const Discord = require('discord.js');

module.exports = {
	name: 'infomute',
	description: 'Affiche les mutes d\'un utilisateur ou de tout le serveur. Utilisation : "!infomute [@utilisateur]"',
	execute(message, args) {
		// Vérifiez les permissions
		if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
			return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
		}

		// Si un utilisateur est mentionné, affiche ses mutes
		const user = message.mentions.users.first();
		if (user) {
			const query = `SELECT * FROM info_mute WHERE guild = ? AND \`user-mute\` = ?`;
			const values = [message.guild.id, user.id];

			db.query(query, values, (err, results) => {
				if (err) {
					console.error('Erreur lors de la récupération des mutes :', err.message);
					return message.reply('Une erreur s\'est produite lors de la récupération des mutes.');
				}

				if (results.length === 0) {
					return message.reply(`L'utilisateur ${user.tag} n'a aucun mute enregistré.`);
				}

				const embed = new Discord.EmbedBuilder()
					.setColor('#ffcc00')
					.setTitle(`📋 Mutes de ${user.tag}`)
					.setThumbnail(user.displayAvatarURL())
					.setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
					.setTimestamp();

				results.forEach((mute, index) => {
					embed.addFields({
						name: `Mute #${index + 1}`,
						value: `**Auteur** : <@${mute.user}>\n**Raison** : ${mute.reason}\n**Date** : ${new Date(mute.temps).toLocaleString()}`,
						inline: false,
					});
				});

				message.channel.send({ embeds: [embed] });
			});
		} else {
			// Si aucun utilisateur n'est mentionné, affiche tous les mutes du serveur
			const query = `SELECT \`user-mute\`, COUNT(*) AS muteCount FROM info_mute WHERE guild = ? GROUP BY \`user-mute\``;
			const values = [message.guild.id];

			db.query(query, values, (err, results) => {
				if (err) {
					console.error('Erreur lors de la récupération des mutes :', err.message);
					return message.reply('Une erreur s\'est produite lors de la récupération des mutes.');
				}

				if (results.length === 0) {
					return message.reply('Aucun mute n\'a été enregistré sur ce serveur.');
				}

				const totalMutes = results.reduce((sum, row) => sum + row.muteCount, 0);

				const embed = new Discord.EmbedBuilder()
					.setColor('#ffcc00')
					.setTitle('📋 Mutes du serveur')
					.setDescription(`Nombre total de mutes : **${totalMutes}**`)
					.setFooter({ text: `Demandé par ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
					.setTimestamp();

				results.forEach((row) => {
					embed.addFields({
						name: `Utilisateur : <@${row['user-mute']}>`,
						value: `**Nombre de mutes** : ${row.muteCount}`,
						inline: false,
					});
				});

				message.channel.send({ embeds: [embed] });
			});
		}
	},
};