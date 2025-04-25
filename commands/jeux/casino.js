const db = require('../../connexion.js'); // Importez la connexion à la base de données
const Discord = require('discord.js');

module.exports = {
	name: 'slot', // Nom de la commande
	description: 'Joue à la machine à sous ! ', // Description de la commande
	async execute(message, args) {
		const slots = ['🍒', '🍋', '🍉', '🍇', '🔔', '⭐', '💎'];
		const slot1 = slots[Math.floor(Math.random() * slots.length)];
		const slot2 = slots[Math.floor(Math.random() * slots.length)];
		const slot3 = slots[Math.floor(Math.random() * slots.length)];

		const result = `${slot1} | ${slot2} | ${slot3}`;
		let messages = '';

		if (slot1 === slot2 && slot2 === slot3) {
			messages = '🎉 JACKPOT ! T’as gagné 🎉';
		} else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
			messages = '✨ Pas mal ! Deux symboles identiques. Petit gain !';
		} else {
			messages = '💀 Perdu... Retente ta chance !';
		}

		const embed = new EmbedBuilder()
			.setColor('#FFD700')
			.setTitle('🎰 Machine à sous 🎰')
			.setDescription(`🎲 Résultat :\n**${result}**\n\n${messages}`);

		await interaction.reply({ embeds: [embed] });
	},
};