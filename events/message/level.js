const db = require('../../connexion.js');
const talkedRecently = new Map();
const Discord = require("discord.js");

module.exports = {
	name: "messageCreate",
	once: false, // Cet événement est écouté en continu
	async run(client, message) {
		if (message.author.bot || !message.guild) return;

		// Vérifiez si l'utilisateur ou le canal est blacklisté
		const [blacklistUser] = await db.promise().query(
			"SELECT id FROM blacklistTable WHERE guild = ? AND id = ?",
			[message.guild.id, `${message.guild.id}-${message.author.id}`]
		);
		const [blacklistChannel] = await db.promise().query(
			"SELECT id FROM blacklistTable WHERE guild = ? AND id = ?",
			[message.guild.id, `${message.guild.id}-${message.channel.id}`]
		);
		if (blacklistUser.length > 0 || blacklistChannel.length > 0) return;

		// Récupérez ou initialisez les données de niveau
		const [levels] = await db.promise().query(
			"SELECT * FROM levels WHERE user = ? AND guild = ?",
			[message.author.id, message.guild.id]
		);
		let level = levels[0];
		if (!level) {
			level = {
				id: `${message.author.id}-${message.guild.id}`,
				user: message.author.id,
				guild: message.guild.id,
				xp: 0,
				level: 0,
				totalXP: 0,
			};
			await db.promise().query(
				"INSERT INTO levels (id, user, guild, xp, level, totalXP) VALUES (?, ?, ?, ?, ?, ?)",
				[level.id, level.user, level.guild, level.xp, level.level, level.totalXP]
			);
		}

		// Récupérez les paramètres personnalisés ou utilisez les valeurs par défaut
		const [settingsRows] = await db.promise().query(
			"SELECT * FROM settings WHERE guild = ?",
			[message.guild.id]
		);
		const customSettings = settingsRows[0];
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

			const [channelRows] = await db.promise().query(
				"SELECT * FROM channel WHERE guild = ?",
				[message.guild.id]
			);
			const channelLevel = channelRows[0];
			const targetChannel = channelLevel?.channel ? message.guild.channels.cache.get(channelLevel.channel) : message.channel;

			try {
				targetChannel.send({ embeds: [embed] });
			} catch (err) {
				console.error("Erreur lors de l'envoi du message de niveau :", err);
			}
		}

		// Mettez à jour les données de niveau dans la base de données
		await db.promise().query(
			"UPDATE levels SET xp = ?, level = ?, totalXP = ? WHERE id = ?",
			[level.xp, level.level, level.totalXP, level.id]
		);

		// Ajoutez un cooldown pour éviter les abus
		talkedRecently.set(message.author.id, Date.now() + cooldown);
		setTimeout(() => talkedRecently.delete(message.author.id), cooldown);

		// Gestion des rôles en fonction du niveau
		const [rolesRows] = await db.promise().query(
			"SELECT * FROM roles WHERE guildID = ? AND level = ?",
			[message.guild.id, level.level]
		);
		const roles = rolesRows[0];
		if (roles && !message.member.roles.cache.has(roles.roleID)) {
			const botMember = message.guild.members.me;
			const roleToAdd = message.guild.roles.cache.get(roles.roleID);
			if (
				botMember.permissions.has("ManageRoles") &&
				roleToAdd &&
				roleToAdd.position < botMember.roles.highest.position
			) {
				message.member.roles.add(roles.roleID).catch(err => console.error("Erreur lors de l'ajout du rôle :", err));
			} else {
				console.error("Impossible d'ajouter le rôle : permissions ou hiérarchie insuffisantes.");
			}
		}
	},
};
