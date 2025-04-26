const Discord = require("discord.js");

module.exports = {
	name: "informations",
	async run(client, interaction) {
		// Création de l'embed explicatif
		const embed = new Discord.EmbedBuilder()
			.setColor("#3498db")
			.setTitle("📘 Informations sur les commandes")
			.setDescription("Voici les commandes disponibles et leurs descriptions :")
			.addFields(
				{ name: "📡 Ping", value: "`!ping` - Affiche la latence du bot et de l'API.", inline: false },
				{ name: "👤 Info Utilisateur", value: "`!infouser` - Affiche les informations d'un utilisateur.", inline: false },
				{ name: "🏠 Info Serveur", value: "`!infoserv` - Affiche les informations du serveur.", inline: false }
			)
			.setFooter({ text: "Utilisez ces commandes avec le préfixe `!`." });

		// Création des boutons
		const accueil = new Discord.ButtonBuilder()
			.setCustomId("accueil")
			.setLabel("Accueil")
			.setStyle(Discord.ButtonStyle.Primary);

		const informations = new Discord.ButtonBuilder()
			.setCustomId("informations")
			.setLabel("Informations")
			.setStyle(Discord.ButtonStyle.Secondary);

		// Ajout des boutons dans une rangée
		const row = new Discord.ActionRowBuilder()
			.addComponents(accueil)
			.addComponents(informations);

		// Mise à jour de l'interaction avec l'embed et les boutons
		await interaction.update({ embeds: [embed], components: [row] });
	},
};