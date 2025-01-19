const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async run(client, message) {
        // Ignore les messages provenant des bots
        if (message.author.bot) return;

        // Préfixe fixe
        const prefix = '!';

        // Vérifie si le message commence par le préfixe
        if (!message.content.startsWith(prefix)) return;

        // Supprime le préfixe et divise le message en commande et arguments
        const args = message.content.slice(prefix.length).trim().split(/\s+/);
        const commandName = args.shift().toLowerCase();

        // Chemin vers le dossier des commandes
        const commandsDir = path.join(__dirname, '../../commands');

        // Recherche récursive du fichier de commande
        const findCommandFile = (dir, commandName) => {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    // Recherche dans le sous-dossier
                    const result = findCommandFile(fullPath, commandName);
                    if (result) return result;
                } else if (file === `${commandName}.js`) {
                    return fullPath;
                }
            }

            return null;
        };

        const commandFile = findCommandFile(commandsDir, commandName);

        if (!commandFile) {
            message.reply(`La commande \`${commandName}\` n'existe pas.`);
            return;
        }

        try {
            // Importer et exécuter la commande
            const command = require(commandFile);
            command.execute(message, args);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error);
            message.reply('Une erreur s\'est produite lors de l\'exécution de cette commande.');
        }
    },
};
