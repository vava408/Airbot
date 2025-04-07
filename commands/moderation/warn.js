const db = require('../../connexion.js'); // Importez la connexion à la base de données
const Discord = require('discord.js');

module.exports = {
    name: 'warn',
    description: 'Avertit un utilisateur.',
    execute(message, args) {
        // Vérifiez les permissions
        if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
        }

        // Vérifiez si un utilisateur est mentionné
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Veuillez mentionner un utilisateur à avertir.');
        }

        // Vérifiez si une raison est fournie
        const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';

        // Enregistrez l'avertissement dans la base de données
        const query = `INSERT INTO warn (guildID, userID, authorID, reason, date) VALUES (?, ?, ?, ?, ?)`;
        const values = [
            message.guild.id,
            user.id,
            message.author.id,
            reason,
            new Date()
        ];

        db.query(query, values, (err) => {
            if (err) {
                console.error('Erreur lors de l\'enregistrement de l\'avertissement :', err.message);
                return message.reply('Une erreur s\'est produite lors de l\'enregistrement de l\'avertissement.');
            }

            // Réponse de confirmation
            message.reply(`L'utilisateur ${user.tag} a été averti pour la raison suivante : "${reason}".`);
        });
    },
};