const Discord = require('discord.js');

module.exports = {
	name: 'slowmode',
	description: 'Met le salon en mode lent',
	async execute(message, args, client) {

		if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
			return message.channel.send("❌ Vous n'avez pas la permission de gérer les channel.");
		}

		if (isNaN(args[0])) {
			return message.channel.send(" Veuillez entrer un **nombre valide**.");
		}
		
		const duration = parseInt(args[0]);

		if (duration < 0 || duration > 21600) {
			return message.channel.send("Veuillez entrer un nombre de secondes **entre 0 et 21600** (6 heures).");
		}

		try {
			
			await message.channel.setRateLimitPerUser(duration);
			if (duration === 0) {
				message.channel.send(" Mode lent désactivé.");
			} else {
				message.channel.send(` Mode lent activé : **${duration} secondes**.`);
			}
		} catch (error) {
			console.error(error);
			message.channel.send(" Erreur lors du paramétrage du slowmode.");
		}
	},
};
