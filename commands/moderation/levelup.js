const db = require('../../connexion.js');
const Discord = require('discord.js');

module.exports = {
	name: 'levelup',
	description: 'Permet de modifier le message de level up',
	usage: 'levelup <message>',
	async execute(message, args, client) {
		if (!message.member.permissions.has('ADMINISTRATOR')) {
			return message.reply('Vous devez être administrateur pour utiliser cette commande.');
		}

		if (!args.length) {
			return message.reply(`Veuillez fournir un message de niveau supérieur !\nExemple : \`Bravo {member}, vous avez passé 1 niveau, vous êtes niveau {level} et vous avez {xp} !\``);
		}

		// Récupère le niveau de l'utilisateur
		const [levels] = await db.promise().query(
			"SELECT * FROM levels WHERE user = ? AND guild = ?",
			[message.author.id, message.guild.id]
		);
		
		const level = levels[0];
		if (!level) {
			await db.promise().query(
				"INSERT or UPDATE INTO settings (guild, levelUpMessage, customXP, customCooldown) VALUES (?, ?, ?, ?, ?, ?)",
				[message.guild.id, message.author.id, message.guild.id, 0, 0, 0]
			);
			return message.reply("Niveau initialisé, veuillez réessayer la commande.");
		}

		function remplacerVariables(string) {
			return string
				.replace(/{member}/gi, `${message.member}`)
				.replace(/{xp}/gi, `${level.xp}`)
				.replace(/{level}/gi, `${level.level}`);
		}

		const messageContent = args.join(" ");

		// Enregistre le message personnalisé dans la base de données
		await db.promise().query(
			"INSERT INTO settings (guild, levelUpMessage) VALUES (?, ?) ON DUPLICATE KEY UPDATE levelUpMessage = ?",
			[message.guild.id, messageContent, messageContent]
		);

		const embed = new Discord.EmbedBuilder()
			.setColor("Random")
			.setTimestamp()
			.setDescription(remplacerVariables(messageContent));

		return message.channel.send({ content: `Le message de level up a été mis à jour : ${remplacerVariables(messageContent)}`, embeds: [embed] });
	}
};
