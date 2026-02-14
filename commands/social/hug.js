const { Client } = require("nekos-best.js");

module.exports = {
	name: 'hug',
	description: 'Envoie un calin a quelqu\' un.',
	execute: async (message, args, client) => {
	const nekosBest = new Client();
    const response = await nekosBest.fetch("hug", 1);
    const gifUrl = response.results[0].url;
   message.channel.send(gifUrl);
    
    
    },
};