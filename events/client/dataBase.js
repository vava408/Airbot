const Database = require('better-sqlite3');
const sql = new Database('./database.sqlite'); 

module.exports = {
	name: "ready",
	once: true, // Cet événement est écouté une seule fois  
	run(client) {
		console.log(`La base de donné ${client.user.tag} est prêt !`);
		const level = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'levels';").get();
		if (!level['count(*)']){
			sql.prepare("CREATE TABLE levels (id TEXT PRIMARY KEY, user TEXT, guild TEXT, xp INTEGER, level INTEGER, totalXP INTEGER);").run();
		};
			
			
		client.getLevel = sql.prepare("SELECT * FROM levels WHERE user = ? AND guild = ?");
		client.setLevel = sql.prepare("INSERT OR REPLACE INTO levels (id, user, guild, xp, level, totalXP) VALUES (@id, @user, @guild, @xp, @level, @totalXP);");
		// Role table for levels
		const roleTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roles';").get();
		if (!roleTable['count(*)']) {
			sql.prepare("CREATE TABLE roles (guildID TEXT, roleID TEXT, level INTEGER);").run();
		};
         // Blacklist table // Blacklist table
		const blacklistTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'blacklistTable';").get();
		if (!blacklistTable['count(*)']) {
			sql.prepare("CREATE TABLE blacklistTable (guild TEXT, typeId TEXT, type TEXT, id TEXT PRIMARY KEY);").run();
		};

		// Settings table
		const settingsTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'settings';").get();
		if (!settingsTable['count(*)']) {
			sql.prepare("CREATE TABLE settings (guild TEXT PRIMARY KEY, levelUpMessage TEXT, customXP INTEGER, customCooldown INTEGER);").run();
		};
		//channel
        const channelTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'channel';").get();
        if (!channelTable['count(*)']) {
       		sql.prepare("CREATE TABLE channel (guild TEXT PRIMARY KEY, channel TEXT);").run();
        };
	},
};
