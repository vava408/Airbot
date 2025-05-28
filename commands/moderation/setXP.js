const db = require('../../connexion.js');

module.exports = {
    name: 'setxp',
    description: 'Modifie customXP (gain d\'XP) et customCooldown (cooldown en ms) pour le serveur.',
    usage: 'setxp <xp> <cooldown>',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply("Vous devez être administrateur pour utiliser cette commande.");
        }

        const xp = parseInt(args[0]);
        const cooldown = parseInt(args[1]);

        if (isNaN(xp) || isNaN(cooldown) || xp < 0 || cooldown < 0) {
            return message.reply("Utilisation : `setxp <xp> <cooldown (ms)>` (exemple : `setxp 20 10000`)");
        }

        // Vérifie si une ligne existe déjà pour ce serveur
        const [rows] = await db.promise().query(
            "SELECT * FROM settings WHERE guild = ?",
            [message.guild.id]
        );

        if (rows.length > 0) {
            // Mise à jour
            await db.promise().query(
                "UPDATE settings SET customXP = ?, customCooldown = ? WHERE guild = ?",
                [xp, cooldown, message.guild.id]
            );
        } else {
            // Insertion
            await db.promise().query(
                "INSERT INTO settings (guild, customXP, customCooldown) VALUES (?, ?, ?)",
                [message.guild.id, xp, cooldown]
            );
        }

        return message.channel.send(`Paramètres mis à jour :\n- **customXP** = \`${xp}\`\n- **customCooldown** = \`${cooldown}\` ms`);
    }
};