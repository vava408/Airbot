const fs = require('fs');
const path = require('path');

module.exports = {
	name: "ready", // L'événement doit être lié à "ready" pour charger les boutons au démarrage
	once: true, // Charger les boutons une seule fois
	run(client) {
		const buttonDir = path.join(__dirname, '../../button');

		function loadButtons() {
			const buttons = {};

			fs.readdirSync(buttonDir).forEach(file => {
				if (file.endsWith('.js')) {
					const button = require(path.join(buttonDir, file));
					buttons[button.name] = button;
					console.log(`[Button] => ${button.name} bouton chargé `);
				}
			});

			return buttons;
		}

		client.buttons = loadButtons();
	},
};
