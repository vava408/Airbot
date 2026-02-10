const Discord = require('discord.js');

module.exports = {
	name: 'morpion',
	description: 'Jouez au morpion avec un autre utilisateur.',
	async execute(message, args) {
		let morpion = [
			['1', '2', '3'],
			['4', '5', '6'],
			['7', '8', '9']
		];

		const joueur1 = message.author;
		const joueur2 = message.mentions.users.first();
		let joueurTour = joueur1;
		const symboleJoueur1 = 'X';
		const symboleJoueur2 = 'O';

		if (!joueur2) return message.channel.send("Vous devez mentionner un utilisateur pour jouer au morpion !");
		if (joueur1.bot || joueur2.bot) return message.channel.send("Les bots ne peuvent pas jouer au morpion !");
		if (joueur1.id === joueur2.id) return message.channel.send("Vous ne pouvez pas jouer contre vous-même !");

		await message.channel.send(`**${joueur1.username}** a défié **${joueur2.username}** au morpion !`);
		await message.channel.send(`**${joueur1.username}** et **${joueur2.username}**, tapez \`accepter\` pour accepter le défi ou \`refuser\` pour le refuser.`);

		const filterAccept = m => [joueur1.id, joueur2.id].includes(m.author.id) && ['accepter', 'refuser'].includes(m.content.toLowerCase());
		const collectorAccept = message.channel.createMessageCollector({ filter: filterAccept, time: 600000 });

		let accepted = false;
		collectorAccept.on('collect', m => {
			if (m.content.toLowerCase() === 'accepter') {
				accepted = true;
				collectorAccept.stop();
			} else if (m.content.toLowerCase() === 'refuser') {
				message.channel.send("Défi refusé.");
				collectorAccept.stop();
			}
		});

		collectorAccept.on('end', async () => {
			if (!accepted) return message.channel.send("Le défi a expiré ou a été refusé.");

			await message.channel.send(`**${joueur1.username}** et **${joueur2.username}** ont accepté le défi !`);
			let gameOver = false;

			let plateauMsg = null;

			const renderPlateau = () => morpion.map(row => row.join(' | ')).join('\n');
			const getPlateauEmbed = () => {
				const symbole = joueurTour.id === joueur1.id ? symboleJoueur1 : symboleJoueur2;
				return new Discord.EmbedBuilder()
					.setColor('#0099ff')
					.setTitle('🎮 Morpion')
					.setDescription("Voici le plateau de jeu :\n\n" + renderPlateau())
					.setFooter({ text: `Tour de ${joueurTour.username} (${symbole})` })
					.setTimestamp();
			};

			plateauMsg = await message.channel.send({ embeds: [getPlateauEmbed()] });

			const filterPlay = m =>
				m.author.id === joueurTour.id &&
				!isNaN(m.content) &&
				+m.content >= 1 &&
				+m.content <= 9;

			while (!gameOver) {
				const promptMsg = await message.channel.send(`C'est au tour de **${joueurTour.username}**. Choisissez une case (1-9) !`);
				const collected = await message.channel.awaitMessages({ filter: filterPlay, max: 1, time: 30000 });
				const m = collected.first();
				if (!m) {
					await promptMsg.delete().catch(() => { });
					await plateauMsg.edit({ embeds: [getPlateauEmbed().setDescription("Temps écoulé ! Fin de la partie.\n\n" + renderPlateau())] });
					break;
				}
				const choix = parseInt(m.content) - 1;
				const ligne = Math.floor(choix / 3);
				const colonne = choix % 3;

				if (morpion[ligne][colonne] === 'X' || morpion[ligne][colonne] === 'O') {
					await message.channel.send("Cette case est déjà occupée !");
					await promptMsg.delete().catch(() => { });
					await m.delete().catch(() => { });
					continue;
				}

				morpion[ligne][colonne] = joueurTour.id === joueur1.id ? symboleJoueur1 : symboleJoueur2;

				await plateauMsg.edit({ embeds: [getPlateauEmbed()] });
				await promptMsg.delete().catch(() => { });
				await m.delete().catch(() => { });

				// Vérification victoire
				const win = (sym) =>
					(morpion[0][0] === sym && morpion[0][1] === sym && morpion[0][2] === sym) ||
					(morpion[1][0] === sym && morpion[1][1] === sym && morpion[1][2] === sym) ||
					(morpion[2][0] === sym && morpion[2][1] === sym && morpion[2][2] === sym) ||
					(morpion[0][0] === sym && morpion[1][0] === sym && morpion[2][0] === sym) ||
					(morpion[0][1] === sym && morpion[1][1] === sym && morpion[2][1] === sym) ||
					(morpion[0][2] === sym && morpion[1][2] === sym && morpion[2][2] === sym) ||
					(morpion[0][0] === sym && morpion[1][1] === sym && morpion[2][2] === sym) ||
					(morpion[0][2] === sym && morpion[1][1] === sym && morpion[2][0] === sym);

				const symboleActuel = joueurTour.id === joueur1.id ? symboleJoueur1 : symboleJoueur2;
				if (win(symboleActuel)) {
					await plateauMsg.edit({ embeds: [getPlateauEmbed().setDescription(`🎉 **${joueurTour.username}** a gagné !\n\n${renderPlateau()}`)] });
					gameOver = true;
					break;
				}

				// Vérification égalité
				if (morpion.flat().every(cell => cell === 'X' || cell === 'O')) {
					await plateauMsg.edit({ embeds: [getPlateauEmbed().setDescription("Match nul !\n\n" + renderPlateau())] });
					gameOver = true;
					break;
				}

				// Changement de joueur
				joueurTour = joueurTour.id === joueur1.id ? joueur2 : joueur1;
			}
		});
	},
};
