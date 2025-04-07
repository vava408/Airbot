const Database = require('better-sqlite3');
const sql = new Database('./database.sqlite');
const talkedRecently = new Map();
const Discord = require("discord.js");

module.exports = {
    name: "messageCreate",
    once: false, // Cet événement est écouté en continu
    run(client, message) {
        if (message.author.bot || !message.guild) return;

        // Vérifiez si l'utilisateur ou le canal est blacklisté
        const blacklistUser = sql.prepare("SELECT id FROM blacklistTable WHERE guild = ? AND id = ?").get(message.guild.id, `${message.guild.id}-${message.author.id}`);
        const blacklistChannel = sql.prepare("SELECT id FROM blacklistTable WHERE guild = ? AND id = ?").get(message.guild.id, `${message.guild.id}-${message.channel.id}`);
        if (blacklistUser || blacklistChannel) return;

        // Récupérez ou initialisez les données de niveau
        let level = sql.prepare("SELECT * FROM levels WHERE user = ? AND guild = ?").get(message.author.id, message.guild.id);
        if (!level) {
            level = {
                id: `${message.author.id}-${message.guild.id}`,
                user: message.author.id,
                guild: message.guild.id,
                xp: 0,
                level: 0,
                totalXP: 0,
            };
            sql.prepare("INSERT INTO levels (id, user, guild, xp, level, totalXP) VALUES (@id, @user, @guild, @xp, @level, @totalXP)").run(level);
        }

        // Récupérez les paramètres personnalisés ou utilisez les valeurs par défaut
        const customSettings = sql.prepare("SELECT * FROM settings WHERE guild = ?").get(message.guild.id);
        const xpGain = customSettings?.customXP || 16; // XP par défaut
        const cooldown = customSettings?.customCooldown || 10000; // Cooldown par défaut (10 secondes)

        // Système de gain d'XP
        if (talkedRecently.has(message.author.id)) return;

        const generatedXp = Math.floor(Math.random() * xpGain);
        const nextXP = level.level * 2 * 100 + 150;

        level.xp += generatedXp;
        level.totalXP += generatedXp;

        // Vérifiez si l'utilisateur monte de niveau
        if (level.xp >= nextXP) {
            level.xp = 0;
            level.level += 1;

            const embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Bravo** ${message.author}! Vous êtes maintenant **niveau ${level.level}** !`)
                .setTimestamp();

            const channelLevel = sql.prepare("SELECT * FROM channel WHERE guild = ?").get(message.guild.id);
            const targetChannel = channelLevel?.channel ? message.guild.channels.cache.get(channelLevel.channel) : message.channel;

            try {
                targetChannel.send({ embeds: [embed] });
            } catch (err) {
                console.error("Erreur lors de l'envoi du message de niveau :", err);
            }
        }

        // Mettez à jour les données de niveau dans la base de données
        sql.prepare("UPDATE levels SET xp = ?, level = ?, totalXP = ? WHERE id = ?").run(level.xp, level.level, level.totalXP, level.id);

        // Ajoutez un cooldown pour éviter les abus
        talkedRecently.set(message.author.id, Date.now() + cooldown);
        setTimeout(() => talkedRecently.delete(message.author.id), cooldown);

        // Gestion des rôles en fonction du niveau
        const roles = sql.prepare("SELECT * FROM roles WHERE guildID = ? AND level = ?").get(message.guild.id, level.level);
        if (roles && !message.member.roles.cache.has(roles.roleID)) {
            if (message.guild.me.permissions.has("ManageRoles")) {
                message.member.roles.add(roles.roleID).catch(err => console.error("Erreur lors de l'ajout du rôle :", err));
            }
        }
    },
};
