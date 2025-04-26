const db = require('../../connexion.js'); 
const Discord = require('discord.js');

module.exports = {
	name: 'infoserv', 
	description: 'Affiche es informations du sevrveur ! ', 
	async execute(message, args) {

		const embed = new Discord.EmbedBuilder()
			.setColor("#ff0000")
			.setTitle('Informations sur le serveur ' + message.guild.name)
			.setImage(message.guild.iconURL())
			.addFields(
				{ name: 'Nom du serveur', value: `${message.guild.name}`, inline: true },
				{ name: 'ID du serveur', value: `${message.guild.id}`, inline: true },
				{ name: 'Proprietaire du serveur ', value: ` <@${message.guild.ownerId}>`, inline: true },
				{ name: 'Membres', value: `${message.guild.memberCount}`, inline: true },
				{ name: 'Nombre de role', value: `${message.guild.roles.cache.size}`, inline: true },
				{ name: 'Régions', value: `${message.guild.region}`, inline: true },
				{ name: 'Niveau de securiter', value: `${message.guild.verificationLevel}`, inline: true },
				{ name: 'Date de création du serveur', value: `${message.guild.createdAt.toDateString()}` },
			)


		message.channel.send({ embeds: [embed] });
	}
};