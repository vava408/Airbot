module.exports = {
	name: "interactionCreate",
	once: false,
	async run(client, interaction) {
		if (!interaction.isButton()) return;

		const button = client.buttons[interaction.customId];
		if (!button) {
			console.error(`[Error] => Bouton ${interaction.customId} non trouvé.`);
			return;
		}

		try {
			await button.run(client, interaction);
		} catch (error) {
			console.error(`[Error] => Erreur lors de l'exécution du bouton ${interaction.customId}:`, error);
		}
	},
};