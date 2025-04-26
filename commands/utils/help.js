const Discord = require("discord.js");

module.exports = {
	name: 'help',
	description: 'Affiche les commandes et les explique',
	execute(message, args) {
		const embed = new Discord.EmbedBuilder()
			.setColor('#0099ff') // Couleur principale de l'embed
			.setTitle("📖 Menu Principal")
			.setDescription(
				"Bienvenue dans le menu principal de **Airbot** ! 🎉\n\n" +
				"Ici, vous trouverez toutes les commandes disponibles ainsi que leurs explications détaillées.\n\n" +
				"🔗 **Dashboard** : [Accédez au tableau de bord](https://www.airbot.adkynet.eu/dashboard/dashboard.php)\n" +
				"*(Disponible après avoir créé un compte sur le site et lié votre profil Discord dans les paramètres profils.)*\n\n" +
				"Utilisez les boutons ci-dessous pour naviguer entre les différentes catégories de commandes."
			)
			.setAuthor({ name: message.client.user.tag, iconURL: message.client.user.displayAvatarURL() })
			.setThumbnail(message.client.user.displayAvatarURL()) // Ajout d'une miniature
			.setFooter({ text: "Airbot - Votre assistant Discord", })
			.setTimestamp();

		const accueil = new Discord.ButtonBuilder()
			.setCustomId('accueil')
			.setLabel('Accueil')
			.setEmoji('🏠')
			.setStyle(Discord.ButtonStyle.Success);

		const moderation = new Discord.ButtonBuilder()
			.setCustomId('moderation')
			.setLabel('Modération')
			.setEmoji('⛔')
			.setStyle(Discord.ButtonStyle.Danger);

		const informations = new Discord.ButtonBuilder()
			.setCustomId('informations')
			.setLabel('Informations')
			.setEmoji('ℹ️')
			.setStyle(Discord.ButtonStyle.Secondary);

		const row = new Discord.ActionRowBuilder()
			.addComponents(accueil, moderation, informations);

		message.channel.send({
			embeds: [embed],
			components: [row],
		});
	},
};
