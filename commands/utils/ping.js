module.exports = {
	name: 'ping',
	description: 'Répond avec Pong et affiche la latence du bot et de l\'API.',
	execute: async (message, args, client) => {
		const startTime = Date.now(); // Temps de départ
		const msg = await message.channel.send('Calcul de la latence...'); // Envoi d'un message temporaire
		const endTime = Date.now(); // Temps après l'envoi du message
		const latency = endTime - startTime; // Calcul de la latence

		// Modification du message avec les résultats
		msg.edit(`🏓 Pong !\nLatence du bot : ${latency}ms\nLatence de l'API : ${client.ws.ping}ms`);
	},
};