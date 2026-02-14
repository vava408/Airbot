const { Client } = require("nekos-best.js");

module.exports = {
    name: 'kiss',
    description: 'Envoie un calin a quelqu\' un.',
    execute: async (message, args, client) => {
    const nekosBest = new Client();
    const response = await nekosBest.fetch("kiss", 1);
    const gifUrl = response.results[0].url;
   message.channel.send(gifUrl);
    
    
    },
};