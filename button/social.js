const Discord = require("discord.js");

module.exports = {
	name: "social",
	async run(client, interaction) {
		const embed = new Discord.EmbedBuilder()
			.setColor("#e67e22")
			.setTitle("💬 Commandes sociales")
			.setDescription("Voici les commandes sociales disponibles :")
			.addFields(
				{ name: "🤗 `!hug @utilisateur`", value: "Envoie un calin." },
				{ name: "😘 `!kiss @utilisateur`", value: "Envoie un bisou." },
				{ name: "👋 `!slap @utilisateur`", value: "Envoie une gifle amicale." }
			)
			.setFooter({ text: "Airbot - Social" })
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
			.setStyle(Discord.ButtonStyle.Secondary);

		const social = new Discord.ButtonBuilder()
			.setCustomId("social")
			.setLabel("Social")
			.setEmoji("💬")
			.setStyle(Discord.ButtonStyle.Success);

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
