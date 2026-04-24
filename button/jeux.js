const Discord = require("discord.js");

module.exports = {
	name: "jeux",
	async run(client, interaction) {
		const embed = new Discord.EmbedBuilder()
			.setColor("#f39c12")
			.setTitle("🎮 Commandes de jeux")
			.setDescription("Voici les commandes de jeu disponibles :")
			.addFields(
				{ name: "🎰 `!slot`", value: "Lance la machine à sous." },
				{ name: "🔢 `!devine`", value: "Jeu: devine un nombre entre 1 et 100." },
				{ name: "❌⭕ `!morpion @utilisateur`", value: "Lance une partie de morpion." }
			)
			.setFooter({ text: "Airbot - Jeux" })
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
			.setStyle(Discord.ButtonStyle.Secondary);

		const jeux = new Discord.ButtonBuilder()
			.setCustomId("jeux")
			.setLabel("Jeux")
			.setEmoji("🎮")
			.setStyle(Discord.ButtonStyle.Success);

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
