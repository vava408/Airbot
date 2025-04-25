const Discord = require('discord.js');

module.exports = {
	name: 'morpion', // Nom de la commande
	description: 'Jouez au morpion avec un autre utilisateur.', // Description de la commande
	async execute(message, args) {
		// Plateau de jeu initial
		let morpion = [
			['1', '2', '3'],
			['4', '5', '6'],
			['7', '8', '9']
		];

		// Récupération des joueurs
		const joueur1 = message.author; // L'utilisateur qui a envoyé le message
		const joueur2 = message.mentions.users.first(); // L'utilisateur mentionné
		let joueurtTour = joueur1; // Le joueur qui commence
		let symboleJoueur1 = 'X'; // Symbole du joueur 1
		let symboleJoueur2 = 'O'; // Symbole du joueur 2

		// Vérifications des joueurs
		if (!joueur2) {
			return message.channel.send("Vous devez mentionner un utilisateur pour jouer au morpion !");
		}

		if (joueur1.bot || joueur2.bot) {
			return message.channel.send("Les bots ne peuvent pas jouer au morpion !");
		}

		//if (joueur1.id === joueur2.id) {
		//	return message.channel.send("Vous ne pouvez pas jouer contre vous-même !");
		//}

		// Annonce du défi
		await message.channel.send(`**${joueur1.username}** a défié **${joueur2.username}** au morpion !`);
		await message.channel.send(`**${joueur1.username}** et **${joueur2.username}**, tapez \`accepter\` pour accepter le défi ou \`refuser\` pour le refuser.`);

		// Collecteur de messages pour accepter ou refuser le défi
		const filter = m => m.author.id === joueur1.id || m.author.id === joueur2.id;
		const collector = message.channel.createMessageCollector({ filter, time: 60000 });

		collector.on('collect', m => {
			if (m.content.toLowerCase() === 'accepter') {
				collector.stop(); // Arrête le collecteur
				message.channel.send(`**${joueur1.username}** et **${joueur2.username}** ont accepté le défi !`);

				// Affichage du plateau de jeu dans un embed
				const plateau = morpion.map(row => row.join(' | ')).join('\n');
				const embed = new Discord.EmbedBuilder()
					.setColor('#0099ff')
					.setTitle('🎮 Morpion')
					.setDescription("Voici le plateau de jeu :\n\n" + plateau)
					.setFooter({ text: `Tour de ${joueurtTour}` })
					.setTimestamp();
				message.channel.send({ embeds: [embed] });
				
				if (joueurtTour.id === m.author.id && !isNaN(m.content) && m.content >= 1 && m.content <= 9) {
					// Logique pour jouer au morpion
					const choix = parseInt(m.content) - 1; // Convertit le choix en index (0-8)
					const ligne = Math.floor(choix / 3); // Calcule la ligne
					const colonne = choix % 3; // Calcule la colonne

					if (morpion[ligne][colonne] === 'X' || morpion[ligne][colonne] === 'O') {
						return message.channel.send("Cette case est déjà occupée !");
					}

					// Place le symbole du joueur actuel
					morpion[ligne][colonne] = joueurtTour === joueur1 ? symboleJoueur1 : symboleJoueur2;

					// Change le tour
					joueurtTour = joueurtTour === joueur1 ? joueur2 : joueur1;

					// Met à jour le plateau et l'affiche
					const plateau = morpion.map(row => row.join(' | ')).join('\n');
					const embed = new Discord.EmbedBuilder()
						.setColor('#0099ff')
						.setTitle('🎮 Morpion')
						.setDescription("Voici le plateau de jeu :\n\n" + plateau)
						.setFooter({ text: `Tour de ${joueurtTour.username}` })
						.setTimestamp();
					message.channel.send({ embeds: [embed] });
				}
				
			} else if (m.content.toLowerCase() === 'refuser') {
				collector.stop(); // Arrête le collecteur
				message.channel.send(`**${joueur1.username}** ou **${joueur2.username}** a refusé le défi.`);
			}
		});

		collector.on('end', (collected, reason) => {
			if (reason === 'time') {
				message.channel.send("Le défi a expiré car aucun des joueurs n'a répondu à temps.");
			}
		});
	},
};