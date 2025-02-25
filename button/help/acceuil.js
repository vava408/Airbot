module.exports = {
	name: "accueil",
	run(client, interaction) {
		console.log(`${client.user.tag} a cliqué sur le bouton exampleButton !`);
		interaction.uptade('Vous avez cliqué sur le bouton exampleButton !');
	},
};