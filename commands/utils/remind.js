const Discord = require("discord.js");

module.exports = {
	name: 'remind',
	description: 'Créer un rappel personnel ou pour des personnes ayant un rôle spécifique.',
	execute: async (message, args, client) => {

		// Récupérer le premier rôle mentionné
		const role = message.mentions.roles.first().id;
		if (!role) return message.reply("Veuillez mentionner un rôle pour le rappel !");

		// Récupérer le texte du rappel (tout ce qui vient après la mention du rôle)
		const description = args.slice(1).join(" ");
		if (!description) return message.reply("Veuillez entrer le texte du rappel !");


		const embed = new Discord.EmbedBuilder()
			.setColor("Random")
			.setAuthor({
				name: message.author.username,
				iconURL: message.author.displayAvatarURL({ dynamic: true })
			})
			.setDescription(`**Rappel pour <@&${role}>:**\n${description}`)
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		message.channel.send({ embeds: [embed] });
	},
};