const Discord = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Affiche les commandes et les explique',
    execute(message, args) {
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

        message.channel.send({
            embeds: [embed],
            components: [row],
        });
    },
};
