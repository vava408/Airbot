module.exports = {
    name: "ready",
    once: true, // Cet événement est écouté une seule fois  
    run(client) {
        console.log(`${client.user.tag} est prêt !`);
    },
};
