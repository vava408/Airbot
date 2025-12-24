const { EmbedBuilder } = require('discord.js');
const packageJson = require('../../package.json');

module.exports = {
	name: 'botinfo',
	description: '🤖 Donne les infos du bot (latence, version, etc.)',
	async execute(message, args, client) {
		const embed = new EmbedBuilder()
			.setTitle('🤖 Infos du bot')
			.setColor('Blue')
			.addFields(
				{ name: 'Latence API', value: `${Math.round(client.ws.ping)}ms`, inline: true },
				{ name: 'Version du bot', value: packageJson.version || 'N/A', inline: true },
				{ name: 'Node.js', value: process.version, inline: true },
				{ name: 'Serveurs', value: `${client.guilds.cache.size}`, inline: true },
				{ name: 'Utilisateurs', value: `${client.users.cache.size}`, inline: true },
				{ name: 'Créateur', value: 'vava4858', inline: true }
			)
			.setTimestamp();

		return message.reply({ embeds: [embed] });
	}
};