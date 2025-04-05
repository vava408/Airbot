const Discord = require("discord.js");

module.exports = {
	name: "accueil",
	async run(client, interaction) {

		const embed = new Discord.EmbedBuilder()
			.setTitle("Menu Principal")
			.setDescription("Bienvenue dans le menue prinncipal de Airbot ! C est ici que tout les commandes et leur explication se trouve ! \n\nVous trouver aussi le liens vers le dashboard https://www.airbot.adkynet.eu/dashboard/dahboard.php acecible apres vousetes créer un compte et l avoir lier a discord ddans profils!")
			.setAuthor({ name: interaction.client.user.tag })
			.setTimestamp();

		const accueil = new Discord.ButtonBuilder()
			.setCustomId('accueil')
			.setLabel('Accueil')
			.setEmoji('🏠')
			.setStyle(Discord.ButtonStyle.Danger); // Définir le style du bouton

		const row = new Discord.ActionRowBuilder()
			.addComponents(accueil);

		await interaction.update({embeds: [embed], components: [row],});
	},
};