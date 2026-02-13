const db = require('../../connexion.js');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'lock',
	description: 'verrouille un salon',
	async execute(message, args) {

		if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			return message.reply("❌ Tu n'as pas la permission de verrouiller ce salon.");
		}

		try {
			await message.channel.permissionOverwrites.edit(
				message.guild.roles.everyone,
				{
					SendMessages: false
				}
			);

			message.channel.send('🔒 Salon verrouillé avec succès.');
		} catch (err) {
			console.error(err);
			message.reply('❌ Erreur lors du verrouillage du salon.');
		}
	},
};
