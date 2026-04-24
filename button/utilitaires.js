const Discord = require("discord.js");

module.exports = {
	name: "utilitaires",
	async run(client, interaction) {
		const embed = new Discord.EmbedBuilder()
			.setColor("#3498db")
			.setTitle("🧰 Commandes utilitaires")
			.setDescription("Voici les commandes utilitaires disponibles :")
			.addFields(
				{ name: "📡 `!ping`", value: "Affiche la latence du bot et de l'API." },
				{ name: "📖 `!help`", value: "Affiche le menu d'aide interactif." },
				{ name: "⏰ `!remind`", value: "Crée un rappel personnel (ou par rôle)." }
			)
			.setFooter({ text: "Airbot - Utilitaires" })
			.setTimestamp();

		const accueil = new Discord.ButtonBuilder()
			.setCustomId("accueil")
			.setLabel("Accueil")
			.setEmoji("🏠")
			.setStyle(Discord.ButtonStyle.Secondary);

		const informations = new Discord.ButtonBuilder()
			.setCustomId("informations")
			.setLabel("Informations")
			.setEmoji("ℹ️")
			.setStyle(Discord.ButtonStyle.Secondary);

		const utilitaires = new Discord.ButtonBuilder()
			.setCustomId("utilitaires")
			.setLabel("Utilitaires")
			.setEmoji("🧰")
			.setStyle(Discord.ButtonStyle.Success);

		const jeux = new Discord.ButtonBuilder()
			.setCustomId("jeux")
			.setLabel("Jeux")
			.setEmoji("🎮")
			.setStyle(Discord.ButtonStyle.Secondary);

		const social = new Discord.ButtonBuilder()
			.setCustomId("social")
			.setLabel("Social")
			.setEmoji("💬")
			.setStyle(Discord.ButtonStyle.Secondary);

		const moderation = new Discord.ButtonBuilder()
			.setCustomId("moderation")
			.setLabel("Modération")
			.setEmoji("⛔")
			.setStyle(Discord.ButtonStyle.Danger);

		const row1 = new Discord.ActionRowBuilder().addComponents(accueil, informations, utilitaires, jeux, social);
		const row2 = new Discord.ActionRowBuilder().addComponents(moderation);

		await interaction.update({ embeds: [embed], components: [row1, row2] });
	},
};
