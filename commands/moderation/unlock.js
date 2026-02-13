const db = require('../../connexion.js');
const Discord = require('discord.js');
const { PermissionsBitField } = require('discord.js');


module.exports = {
	name: 'unlock',
	description: 'Déverrouille un salon',
	async execute(message, args) {

		// Vérifie les permissions
		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			return message.reply("❌ Tu n'as pas la permission de déverrouiller ce salon.");
		}

		const channel = message.channel;

		try {
			await channel.permissionOverwrites.edit(
				message.guild.roles.everyone,
				{
					SendMessages: true
				}
			);

			message.channel.send('🔒 Salon déverrouillé avec succès.');
		} catch (error) {
			console.error(error);
			message.reply('❌ Une erreur est survenue lors du déverrouillage du salon.');
		}
	},
};
