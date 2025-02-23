const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

// commande de test pour vérifier si le bot est en ligne
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Vérif si le bot est en ligne !'),

    async execute(interaction) {
        const embedt = new Discord.EmbedBuilder()
            .setColor("#00F5FF")
            .setTitle("🏓 pong !");

        console.log('Commande ping exécutée'); // Ajout d'un log pour le débogage
        await interaction.reply({ embeds: [embedt] });
    },
};