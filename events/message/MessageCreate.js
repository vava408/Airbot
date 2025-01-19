module.exports = {
    name: "messageCreate",
    once: false,
    run(client, message) {
        // Ignore les messages envoyés par des bots
        if (message.author.bot) return;

        console.log(`Message de ${message.author.tag} : ${message.content}`);  
    },
};
