const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

// commande de test pour vérifier si le bot est en ligne
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Vérif si le bot est en ligne !'),

	async execute(interaction) {
		const embed = new Discord.EmbedBuilder()
			.setTitle("Menu Principal")
			.setDescription("Voici la liste des commandes disponibles :\n\n**!ping** - Vérifie la latence du bot\n**!help** - Affiche ce message")
			.setAuthor({ name: message.client.user.tag })
			.setTimestamp();

		const accueil = new Discord.ButtonBuilder()
			.setCustomId('accueil')
			.setLabel('Accueil')
			.setEmoji('🏠')
			.setStyle(Discord.ButtonStyle.Danger); // Définir le style du bouton

		const row = new Discord.ActionRowBuilder()
			.addComponents(accueil);

		interaction.channel.send({embeds: [embed],components: [row],});
	},
};