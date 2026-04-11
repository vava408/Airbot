const { Client, Partials } = require('discord.js');
const loadEvents = require("./loaders/event");
require("dotenv").config();

const express = require('express');
const { exec } = require("child_process");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;

/* =========================
   SECRET GITHUB
========================= */
const GITHUB_SECRET =  process.env.GITHUB_SECRET;

if (!GITHUB_SECRET) {
	console.error("GITHUB_SECRET manquant dans le .env");
	process.exit(1);
}

/* =========================
   VERIFICATION SIGNATURE
========================= */
function verifySignature(req) {
	const signature = req.headers["x-hub-signature-256"];

	if (!signature) return false;

	const hmac = crypto.createHmac("sha256", GITHUB_SECRET);
	const rawBody = req.body ? req.body.toString("utf8") : "";

	const digest =
		"sha256=" + hmac.update(rawBody).digest("hex");

	const signatureBuffer = Buffer.from(signature, "utf8");
	const digestBuffer = Buffer.from(digest, "utf8");

	if (signatureBuffer.length !== digestBuffer.length) {
		return false;
	}

	return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
}

/* =========================
   WEBHOOK GITHUB
========================= */
app.post('/webhook', express.raw({ type: '*/*' }), (req, res) => {

	console.log("Webhook reçu");

	// Vérifie si la requête vient bien de GitHub
	if (!verifySignature(req)) {
		console.log("Signature invalide (accès refusé)");
		return res.sendStatus(401);
	}

	const event = req.headers["x-github-event"];

	// On ne traite que les push
	if (event !== "push") {
		console.log("Événement ignoré :", event);
		return res.sendStatus(200);
	}

	console.log("Push GitHub validé");

	// =========================
	// AUTO UPDATE DU BOT
	// =========================
	exec("git pull origin main && npm install", (error, stdout, stderr) => {

		if (error) {
			console.error("Erreur git pull :", error.message);
			return;
		}

		console.log("Résultat git :");
		console.log(stdout);

		if (stderr) {
			console.error(stderr);
		}

		// Redémarrage du bot
		exec("pm2 restart Airbot", (err) => {
			if (err) {
				console.error("Erreur PM2 :", err.message);
				return;
			}

			console.log("Bot redémarré avec succès");
		});
	});

	res.sendStatus(200);
});

/* =========================
   LANCEMENT SERVEUR EXPRESS
========================= */
app.listen(PORT, () => {
	console.log(`Serveur webhook actif sur http://localhost:${PORT}/webhook`);
});

/* =========================
   BOT DISCORD
========================= */

if (!process.env.token) {
	console.error("Token manquant dans le .env");
	process.exit(1);
}

const client = new Client({
	intents: [3276799],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildMember,
		Partials.Reaction
	]
});

loadEvents(client);

client.login(process.env.token);
