const db = require('../../connexion.js');
const Discord = require('discord.js');

module.exports = {
	name: 'levelupchan',
	description: 'Permet de modifier le salon où le passage de niveau est envoyé',
	usage: 'levelupchan <channel>',
	async execute(message, args, client) {
		if (!message.member.permissions.has('ADMINISTRATOR')) {
			return message.reply('Vous devez être administrateur pour utiliser cette commande.');
		}

		const channel = message.mentions.channels.first();
		const guild = message.guild.id;

		if(channel == undefined)
		{
			const embed = new Discord.EmbedBuilder()
				.setColor("Red")
				.setTimestamp()
				.setDescription(`Veuillez entré un channel`);

			return message.channel.send({ embeds: [embed] });
		}

		await db.promise().query(
			"INSERT INTO channel (guild, channel) VALUES (?, ?) ON DUPLICATE KEY UPDATE channel = ?",
			[guild, channel.id, channel.id]
		);

		const embed = new Discord.EmbedBuilder()
			.setColor("Random")
			.setTimestamp()
			.setDescription(`Le passage de niveaux se fera dans le salon ${channel}`);

		return message.channel.send({ embeds: [embed] });
	}
};
