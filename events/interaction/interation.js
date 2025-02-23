const Discord = require("discord.js");
const fs = require("fs");
const path = require('path');

module.exports = {
    name: 'interactionCreate',
    once: false, // L'événement doit être écouté en permanence
    async run(client, interaction) {

        client.commands = new Discord.Collection();
        client.contextCommands = new Discord.Collection();

        // Fonction récursive pour lire les fichiers de commande dans les sous-dossiers
        function readCommandFiles(dir) {
            const files = fs.readdirSync(dir, { withFileTypes: true });
            for (const file of files) {
                const fullPath = path.join(dir, file.name);
                if (file.isDirectory()) {
                    readCommandFiles(fullPath);
                } else if (file.name.endsWith('.js')) {
                    const command = require(fullPath);
                    if (command.data.type === 'CONTEXT_MENU') {
                        client.contextCommands.set(command.data.name, command);
                    } else {
                        client.commands.set(command.data.name, command);
                    }
                }
            }
        }

        // Lire les fichiers de commande dans le dossier slashcommand et ses sous-dossiers
        readCommandFiles(path.join(__dirname, '../../slashcommand'));

        client.on("interactionCreate", async (interaction) => {
            console.log(`${interaction.user.tag} dans #${interaction.channel.name} a déclenché une interaction.`);

            // Vérifier si l'interaction est une commande de menu contextuel
            if (interaction.isContextMenuCommand()) {
                const command = client.contextCommands.get(interaction.commandName);
                if (!command) return;
                try {
                    const target = interaction.isUserContextMenuCommand() ? interaction.targetUser : interaction.targetMessage;
                    console.log(`Exécution de la commande contextuelle : ${command.data.name}`);
                    await command.execute(interaction, target);
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ content: 'Il y a eu une erreur en essayant d\'exécuter cette commande !', ephemeral: true });
                }
            }

            // À ce stade, il ne reste que les commandes slash
            if (!interaction.isCommand()) return;

            // Récupérer la commande enregistrée dans le client
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                // Exécuter la commande
                console.log(`Exécution de la commande slash : ${command.data.name}`);
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Il y a eu une erreur en essayant d\'exécuter cette commande !', ephemeral: true });
            }
        });
    }
};
