const Discord = require('discord.js');

module.exports = {
	name: 'clear',
	description: 'Supprime un nombre spécifique de messages dans le salon actuel',
	async execute(message, args, client) {

		if (!message.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
			return message.channel.send("❌ Vous n'avez pas la permission de gérer les messages.");
		}

		if (isNaN(args[0])) {
			return message.channel.send("❌ Veuillez entrer un **nombre valide**.");
		}
		
		const number = parseInt(args[0]);

		if (number < 1 || number > 100) {
			return message.channel.send("❌ Veuillez entrer un **nombre entre 1 et 100**.");
		}

		try {
			const deletedMessages = await message.channel.bulkDelete(number, true);
			const confirmation = await message.channel.send(`✅ ${deletedMessages.size} messages supprimés.`);
			setTimeout(() => confirmation.delete().catch(() => { }), 3000);
		} catch (error) {
			console.error(error);
			message.channel.send("❌ Une erreur est survenue lors de la suppression des messages.");
		}
	},
};
