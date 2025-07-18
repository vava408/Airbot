const db = require('../../connexion.js');
const Discord = require('discord.js');

module.exports = {
    name: 'devine',
    description: 'Jeu : devine le nombre entre 1 et 100 ! (option pour tout le serveur)',
    async execute(message, args) {
        const nombre = Math.floor(Math.random() * 100) + 1;
        let essais = 0;

        // Demande si tout le serveur peut jouer
        await message.channel.send(`${message.author}, veux-tu que tout le serveur puisse jouer ? (oui/non)`);
        const filterConfirm = m => m.author.id === message.author.id && ['oui', 'non'].includes(m.content.toLowerCase());
        const collectedConfirm = await message.channel.awaitMessages({ filter: filterConfirm, max: 1, time: 30000 });
        const confirmation = collectedConfirm.first();
        if (!confirmation) return message.channel.send("Temps écoulé, jeu annulé.");

        const everyoneCanPlay = confirmation.content.toLowerCase() === 'oui';

        await message.channel.send(`J'ai choisi un nombre entre 1 et 100. Devine-le ! Envoie un nombre dans le chat.`);

        const filter = m =>
            !isNaN(m.content) &&
            (everyoneCanPlay || m.author.id === message.author.id);

        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', m => {
            essais++;
            const guess = parseInt(m.content);
            if (guess === nombre) {
                message.channel.send(`Bravo ${m.author} ! Tu as trouvé le nombre **${nombre}** en ${essais} essais.`);
                collector.stop();
            } else if (guess < nombre) {
                message.channel.send("C'est plus grand !");
            } else if (guess > nombre) {
                message.channel.send("C'est plus petit !");
            }
        });

        collector.on('end', (_, reason) => {
            if (reason !== 'user') {
                message.channel.send(`Temps écoulé ! Le nombre était **${nombre}**.`);
            }
        });
    }
};