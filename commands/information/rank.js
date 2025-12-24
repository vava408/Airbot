const { AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const db = require('../../connexion.js');

module.exports = {
	name: 'rank',
	description: 'Affiche ton niveau et XP sous forme de carte.',
	async execute(message, args, client) {
		const user = message.mentions.users.first() || message.author; // Récupère l'utilisateur mentionné ou l'auteur du message

		// Récupère le niveau et l'XP de l'utilisateur depuis la base de données
		db.query('SELECT level, xp FROM levels WHERE user = ?', [user.id], async (err, results) => {
			if (err) {
				console.error(err);
				return message.reply('Erreur lors de la récupération des données.');
			}

			// Valeurs par défaut si aucune donnée trouvée
			let level = 0;
			let xp = 0;
			if (results && results.length > 0) {
				level = results[0].level;
				xp = results[0].xp;
			}

			// Calcul des informations de progression
			const nextXP = level * 2 * 100 + 150; // même formule que le système de level
			const progress = Math.max(0, Math.min(1, nextXP > 0 ? xp / nextXP : 0));

			// Création d'un canvas
			const width = 700;
			const height = 240;
			const canvas = Canvas.createCanvas(width, height);
			const ctx = canvas.getContext('2d');

			// Fond en dégradé vibrant
			const bgGradient = ctx.createLinearGradient(0, 0, width, height);
			bgGradient.addColorStop(0, '#1f1c2c');
			bgGradient.addColorStop(0.5, '#3a1c71');
			bgGradient.addColorStop(1, '#1e90ff');
			ctx.fillStyle = bgGradient;
			ctx.fillRect(0, 0, width, height);

			// Carte semi-transparente (boîte) avec coins arrondis
			const cardX = 20;
			const cardY = 20;
			const cardW = width - 40;
			const cardH = height - 40;
			const radius = 22;

			function roundRect(ctx, x, y, w, h, r) {
				ctx.beginPath();
				ctx.moveTo(x + r, y);
				ctx.lineTo(x + w - r, y);
				ctx.quadraticCurveTo(x + w, y, x + w, y + r);
				ctx.lineTo(x + w, y + h - r);
				ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
				ctx.lineTo(x + r, y + h);
				ctx.quadraticCurveTo(x, y + h, x, y + h - r);
				ctx.lineTo(x, y + r);
				ctx.quadraticCurveTo(x, y, x + r, y);
				ctx.closePath();
			}

			ctx.save();
			roundRect(ctx, cardX, cardY, cardW, cardH, radius);
			ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
			ctx.fill();
			ctx.strokeStyle = 'rgba(255,255,255,0.15)';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.restore();

			// Avatar rond avec anneau lumineux
			const avatar = await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 256 }));
			const avatarSize = 128;
			const avatarX = cardX + 26;
			const avatarY = cardY + 26;
			ctx.save();
			ctx.beginPath();
			ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 6, 0, Math.PI * 2);
			ctx.strokeStyle = '#00ffd5';
			ctx.lineWidth = 6;
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
			ctx.clip();
			ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
			ctx.restore();

			// Texte principal (tag + niveau)
			ctx.font = 'bold 30px sans-serif';
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = 'left';
			ctx.fillText(user.tag, avatarX + avatarSize + 30, avatarY + 40);

			// Badges et niveau mis en avant
			ctx.font = 'bold 26px sans-serif';
			ctx.fillStyle = '#ffd700';
			ctx.fillText(`Niveau ${level}`, avatarX + avatarSize + 30, avatarY + 80);

			// Barre de progression XP (track + fill)
			const barX = avatarX + avatarSize + 30;
			const barY = avatarY + 110;
			const barW = cardW - (barX - cardX) - 30;
			const barH = 28;

			// Track
			ctx.save();
			roundRect(ctx, barX, barY, barW, barH, 14);
			ctx.fillStyle = 'rgba(255,255,255,0.15)';
			ctx.fill();
			ctx.restore();

			// Fill
			const fillW = Math.max(10, Math.floor(barW * progress));
			const fillGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
			fillGrad.addColorStop(0, '#ff6a88');
			fillGrad.addColorStop(0.5, '#ff99ac');
			fillGrad.addColorStop(1, '#00d4ff');
			ctx.save();
			roundRect(ctx, barX, barY, fillW, barH, 14);
			ctx.fillStyle = fillGrad;
			ctx.fill();
			ctx.restore();

			// Texte XP au-dessus de la barre
			ctx.font = 'bold 18px sans-serif';
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = 'left';
			ctx.fillText(`XP: ${xp} / ${nextXP}`, barX, barY - 8);

			// Pourcentage à droite
			ctx.textAlign = 'right';
			ctx.fillStyle = '#e0f7ff';
			ctx.fillText(`${Math.round(progress * 100)}%`, barX + barW, barY - 8);

			// Infos secondaires sous la barre
			ctx.textAlign = 'left';
			ctx.fillStyle = '#aee7ff';
			ctx.font = '16px sans-serif';
			ctx.fillText('Continue à parler pour gagner de l\'XP !', barX, barY + barH + 24);

			// Envoi
			const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'rank-card.png' });
			message.reply({ files: [attachment] });
		}); 
	}
};