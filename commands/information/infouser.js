
const db = require('../../connexion.js'); 
const Discord = require('discord.js');

module.exports = {
	name: 'infouser', 
	description: 'Affiche es informations de l utilisateur  !', 
	async execute(message, args) {

		const username = message.mentions.members.first() || message.member;
		const user = message.mentions.users.first() || message.author
		// Obtenir tous les rôles du membre
		const roles = username.roles.cache.map(role => role.name);






		const embed = new Discord.EmbedBuilder()
			.setColor("#0004E1")
			.setTitle('Informations sur ' + user.tag)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
			.addFields(
				{ name: 'Pseudo', value: `${user.username}`, inline: true },
				{ name: 'ID', value: `${user.id}`, inline: true },
				{ name: 'Bot', value: `${user.bot ? '🟢' : '🔴'}`, inline: true },
				{ name: 'Date de création du compte', value: `<t:${parseInt(user.createdTimestamp / 1000)}:f> (<t:${parseInt(user.createdTimestamp / 1000)}:R>)` },
				{ name: 'Roles du membres', value: `${roles.join(', ')}` }
			)


		message.channel.send({ embeds: [embed] });
	}
};
