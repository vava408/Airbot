const Discord = require("discord.js");

module.exports = {
	name: "moderation",
	async run(client, interaction) {
		const embed = new Discord.EmbedBuilder()
			.setColor('#0099ff') // Couleur de l'embed
			.setTitle('📋 Liste des commandes de modération')
			.setDescription('Voici les commandes disponibles pour gérer votre serveur :')
			.addFields(
				{
					name: '🔨 `!ban @utilisateur [raison]`',
					value: 'Bannit un utilisateur mentionné avec une raison facultative.',
				},
				{
					name: '⚠️ `!warn @utilisateur [raison]`',
					value: 'Avertit un utilisateur mentionné avec une raison facultative.',
				},
				{
					name: '🔇 `!mute @utilisateur durée [raison]`',
					value: 'Mute un utilisateur mentionné pour une durée donnée avec une raison facultative.',
				},
				{
					name: '📋 `!infowarn [@utilisateur]`',
					value: 'Affiche les avertissements d\'un utilisateur ou de tout le serveur.',
				},
				{
					name: '📋 `!infomute [@utilisateur]`',
					value: 'Affiche les mutes d\'un utilisateur ou de tout le serveur.',
				}
			)
			.setFooter({
				text: 'AirBot - Modération',
			})
			.setTimestamp();

		const accueil = new Discord.ButtonBuilder()
			.setCustomId('accueil')
			.setLabel('Accueil')
			.setEmoji('🏠')
			.setStyle(Discord.ButtonStyle.Success); // Définir le style du bouton

		const moderation = new Discord.ButtonBuilder()
			.setCustomId('moderation')
			.setLabel('Modération')
			.setEmoji('⛔')
			.setStyle(Discord.ButtonStyle.Danger); // Définir le style du bouton

		const row = new Discord.ActionRowBuilder()
			.addComponents(accueil)
			.addComponents(moderation);

		await interaction.update({ embeds: [embed], components: [row] });
	},
};