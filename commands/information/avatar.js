const db = require('../../connexion.js'); 
const Discord = require('discord.js');

module.exports = {
	name: 'avatar', 
	description: 'Affiche l\'avatar de la personne mentioner ou son avatar ! ', 
	async execute(message, args, client) {

		const username = message.mentions.members.first() || message.member;
		const user = message.mentions.users.first() || message.author;
		// Obtenir tous les rôles du membre
		const roles = username.roles.cache.map(role => role.name);

		const embed = new Discord.EmbedBuilder()
			.setTitle(`${user.tag} avatar`)
			.setImage(user.displayAvatarURL({ size: 4096 }))
			.setColor('Fuchsia')
			.setTimestamp();

		const formats = ['png', 'jpg', 'jpeg', 'gif'];
		const components = [];
		formats.forEach(format => {
			let imageOptions = { extension: format, forceStatic: format == 'gif' ? false : true };

			if (user.avatar == null && format !== 'png') return; 
			if (!user.avatar.startsWith('a_') && format === 'gif') return;
			components.push(
				new Discord.ButtonBuilder()
					.setLabel(format.toUpperCase())
					.setStyle('Link')
					.setURL(user.displayAvatarURL(imageOptions))
			);
		});

		const row = new Discord.ActionRowBuilder()
			.addComponents(components);

		return message.reply({ embeds: [embed], components: [row] });

	}
};