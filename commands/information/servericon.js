const { EmbedBuilder } = require('discord.js');
const db = require('../../connexion.js');
const Discord = require('discord.js');

module.exports = {
    name: 'servericon',
    description: 'Affiche l\'image du serveur',
    async execute(message, args) {


        const iconURL = message.guild.iconURL({
            dynamic: true,
            size: 1024
        });

        const embed = new EmbedBuilder()
            .setColor('#5865F2') // couleur Discord
            .setTitle(`🏰 ${message.guild.name}`)
            .setDescription('Voici l’icône officielle de ce serveur')
            .setImage(iconURL)
            .setFooter({
                text: `ID du serveur : ${message.guild.id}`,
                iconURL: iconURL
            })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
