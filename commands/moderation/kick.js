const Discord = require('discord.js');
const db = require('../../connexion.js');

module.exports = {
	name: 'kick',
	description: 'Expulse un membre du serveur.',
	permissions: ['KickMembers'],
	async execute(message, args) {
		if (!message.member.permissions.has('KickMembers')) {
			return message.reply("Vous n'avez pas la permission d'expulser des membres.");
		}

		const member = message.mentions.members.first();
		if (!member) return message.reply("Mentionnez un membre à expulser.");
		if (!member.kickable) return message.reply("Je ne peux pas expulser ce membre.");

		const reason = args.slice(1).join(' ') || 'Aucune raison fournie';
		await member.kick(reason);

		// Log dans la base de données
		await db.promise().query(
			"INSERT INTO kicks (guildID, userID, authorID, reason, date) VALUES (?, ?, ?, ?, ?)",
			[
				message.guild.id,
				member.id,
				message.author.id,
				reason,
				new Date().toISOString()
			]
		);

		message.channel.send(`**${member.user.tag}** a été expulsé. Raison : ${reason}`);
	}
};