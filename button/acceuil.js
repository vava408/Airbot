module.exports = {
	name: "accueil",
	async run(client, interaction) {
		console.log(`${client.user.tag} a cliqué sur le bouton accueil !`);
		await interaction.update({ content: 'Vous avez cliqué sur le bouton accueil !', components: [] });
	},
};