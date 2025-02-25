const fs = require('fs');
const path = require('path');

module.exports = {
    name: "nom de l'event",
    once: false, // Cet événement est écouté une seule fois si il est true en continue si false
    run(client) {
        const buttonDir = path.join(__dirname, 'button');

        function loadButtons() {
            const buttons = {};

            fs.readdirSync(buttonDir).forEach(subDir => {
                const subDirPath = path.join(buttonDir, subDir);
                if (fs.lstatSync(subDirPath).isDirectory()) {
                    fs.readdirSync(subDirPath).forEach(file => {
                        if (file.endsWith('.js')) {
                            const button = require(path.join(subDirPath, file));
                            buttons[button.name] = button;
                            console.log(`[Button] => ${button.name} bouton chargé depuis ${path.join(subDirPath, file)}`);
                        }
                    });
                }
            });

            return buttons;
        }

        client.buttons = loadButtons();
    },
};
