const Discord = require("discord.js");
const pm2 = require("pm2");

module.exports = {
    name: 'remind',
    description: 'Créer un rappel personnel ou pour des personnes ayant un rôle spécifique.',
    execute: async (message, args, client) => {

        const totalSeconds = Math.floor(process.uptime());
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const uptime = `${days}j ${hours}h ${minutes}m ${seconds}s`;

        const embed = new Discord.EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('🕐 Uptime du bot')
            .setDescription(`Le bot est actif depuis **${uptime}**`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        
    },
};