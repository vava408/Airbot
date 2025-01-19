module.exports = {
    name: 'ping',
    description: 'Répond avec Pong!',
    execute(message, args) {
        message.reply('Pong!');
    },
};
