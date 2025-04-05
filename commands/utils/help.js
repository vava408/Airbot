const Discord = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Affiche les commandes et les explique',
    execute(message, args) {
		const embed = new Discord.EmbedBuilder()
			.setTitle("Menu Principal")
			.setDescription("Bienvenue dans le menue prinncipal de Airbot ! C est ici que tout les commandes et leur explication se trouve ! \n\nVous trouver aussi le liens vers le dashboard https://www.airbot.adkynet.eu/dashboard/dahboard.php acecible apres vousetes créer un compte et l avoir lier a discord ddans profils!")
			.setAuthor({ name: message.client.user.tag })
			.setTimestamp();

		const accueil = new Discord.ButtonBuilder()
			.setCustomId('accueil')
			.setLabel('Accueil')
			.setEmoji('🏠')
			.setStyle(Discord.ButtonStyle.Success); // Définir le style du bouton

		const moderation = new Discord.ButtonBuilder()
			.setCustomId('moderation')
			.setLabel('moderation')
			.setEmoji('⛔')
			.setStyle(Discord.ButtonStyle.Danger); // Définir le style du bouton


		const row = new Discord.ActionRowBuilder()
			.addComponents(accueil)
			.addComponents(moderation);


        message.channel.send({
            embeds: [embed],
            components: [row],
        });
    },
};
