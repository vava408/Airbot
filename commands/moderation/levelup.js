const db = require('../../connexion.js');
const Discord = require('discord.js');

module.exports = {
	name: 'levelup',
	description: 'Permet de modifier le message, le salon ou le rôle de level up',
	usage: 'levelup <message> [salon] [role]',
	async execute(message, args, client) {
		if (!message.member.permissions.has('ADMINISTRATOR')) {
			return message.reply('Vous devez être administrateur pour utiliser cette commande.');
		}

		if (!args.length) {
			return message.reply(`Veuillez fournir un message de niveau supérieur !\nExemple : \`Bravo {member}, vous avez passé 1 niveau, vous êtes niveau {level} et vous avez {xp} !\``);
		}

		client.getLevel = sql.prepare("SELECT * FROM levels WHERE user = ? AND guild = ?");
		const level = client.getLevel.get(message.author.id, message.guild.id);
		if (!level) {
			let insertLevel = sql.prepare("INSERT OR REPLACE INTO levels (id, user, guild, xp, level, totalXP) VALUES (?,?,?,?,?,?);");
			insertLevel.run(`${message.author.id}-${message.guild.id}`, message.author.id, message.guild.id, 0, 0, 0);
			return;
		}

		let embed = new Discord.EmbedBuilder()
			.setColor("Random")
			.setTimestamp();

		function remplacerVariables(string) {
			return string
				.replace(/{member}/i, `${message.member}`)
				.replace(/{xp}/i, `${level.xp}`)
				.replace(/{level}/i, `${level.level}`);
		}

		// Extraire les arguments pour le message, le salon et le rôle
		const messageContent = args[0];
		const channelMention = message.mentions.channels.first();
		const roleMention = message.mentions.roles.first();

		embed.setDescription(remplacerVariables(messageContent));

		// Vérifier si une configuration existe déjà pour le salon
		let checkChannel = sql.prepare("SELECT * FROM channellguild WHERE guildID = ?").get(message.guild.id);
		if (channelMention) {
			if (checkChannel) {
				sql.prepare("UPDATE channellguild SET channel = ? WHERE guildID = ?")
					.run(channelMention.id, message.guild.id);
			} else {
				sql.prepare("INSERT INTO channellguild (guildID, channel) VALUES (?, ?)")
					.run(message.guild.id, channelMention.id);
			}
		}

		// Vérifier si une configuration existe déjà pour le rôle
		let checkRole = sql.prepare("SELECT * FROM roles WHERE guildID = ? AND level = ?").get(message.guild.id, level.level);
		if (roleMention) {
			if (checkRole) {
				sql.prepare("UPDATE roles SET roleID = ? WHERE guildID = ? AND level = ?")
					.run(roleMention.id, message.guild.id, level.level);
			} else {
				sql.prepare("INSERT INTO roles (guildID, roleID, level) VALUES (?, ?, ?)")
					.run(message.guild.id, roleMention.id, level.level);
			}
		}

		// Envoyer un message de confirmation
		let confirmationMessage = `Le message de level up a été mis à jour : ${remplacerVariables(messageContent)}`;
		if (channelMention) confirmationMessage += `\nSalon défini : ${channelMention}`;
		if (roleMention) confirmationMessage += `\nRôle défini pour le niveau ${level.level} : ${roleMention}`;

		return message.channel.send({ content: confirmationMessage, embeds: [embed] });
	}
};
