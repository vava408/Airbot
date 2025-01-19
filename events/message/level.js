const Database = require('better-sqlite3');
const sql = new Database('./database.sqlite');
const talkedRecently = new Map();
const Discord = require("discord.js")

module.exports = {
    name: "messageCreate",
    once: false, // Cet événement est écouté en continu
    run(client, message) {
        if (message.author.bot) return;
        if (!message.guild) return;
        let blacklistUser = sql.prepare("SELECT id FROM blacklistTable WHERE guild = ? AND id = ?").get(message.guild.id, `${message.guild.id}-${message.author.id}`);
        let blacklistChannel = sql.prepare("SELECT id FROM blacklistTable WHERE guild = ? AND id = ?").get(message.guild.id, `${message.guild.id}-${message.channel.id}`);
        if (blacklistUser || blacklistChannel) return;
      
      
      
              // get level and set level
              const level = client.getLevel.get(message.author.id, message.guild.id) 
              if(!level) {
                let insertLevel = sql.prepare("INSERT OR REPLACE INTO levels (id, user, guild, xp, level, totalXP) VALUES (?,?,?,?,?,?);");
                insertLevel.run(`${message.author.id}-${message.guild.id}`, message.author.id, message.guild.id, 0, 0, 0)
                return;
              }
      
              let customSettings = sql.prepare("SELECT * FROM settings WHERE guild = ?").get(message.guild.id);
              let channelLevel = sql.prepare("SELECT * FROM channel WHERE guild = ?").get(message.guild.id);
      
              const lvl = level.level;
      
              let getXpfromDB;
              let getCooldownfromDB;
      
              if(!customSettings)
              {
                getXpfromDB = 16; // Default
                getCooldownfromDB = 1000;
              } else {
                getXpfromDB = customSettings.customXP;
                getCooldownfromDB = customSettings.customCooldown;
              }
      
            // xp system
              const generatedXp = Math.floor(Math.random() * getXpfromDB);
              const nextXP = level.level * 2 * 100 + 150
              // message content or characters length has to be more than 4 characters also cooldown
            if(talkedRecently.get(message.author.id)) {
              return;
            } else { // cooldown is 10 seconds
                  level.xp += generatedXp;
                  level.totalXP += generatedXp;
                  
      
            // level up!
              if(level.xp >= nextXP) {
                      level.xp = 0;
                      level.level += 1;
      
              let levelUpMsg;
              let embed = new Discord.EmbedBuilder()
                    .setColor("Random")
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
      
                    if(!customSettings)
                    {
                      embed.setDescription(`**Bravo** ${message.author}! Vous etes maintenant  **level ${level.level}**`);
                      levelUpMsg = `**Bravo** ${message.author}!  Vous etes maintenant  passer au  **level ${level.level}**`;
                    } else {
                      function antonymsLevelUp(string) {
                        return string
                          .replace(/{member}/i, `${message.member}`)
                          .replace(/{xp}/i, `${level.xp}`)
                          .replace(/{level}/i, `${level.level}`)
                      }
                      embed.setDescription(antonymsLevelUp(customSettings.levelUpMessage.toString()));
                      levelUpMsg = antonymsLevelUp(customSettings.levelUpMessage.toString());
                    }
              // using try catch if bot have perms to send EMBED_LINKS      
              try {
                if(!channelLevel || channelLevel.channel == "Default")
                {
                  message.channel.send({ embeds: [embed] });
                } else {
                  let channel = message.guild.channels.cache.get(channelLevel.channel)
                  const permissionFlags = channel.permissionsFor(message.guild.me);
                  if(!permissionFlags.has("SEND_MESSAGES") || !permissionFlags.has("VIEW_CHANNEL")) return;
                  channel.send({ embeds: [embed] });
                }
              } catch (err) {
                if(!channelLevel || channelLevel.channel == "Default")
                {
                  message.channel.send({ embeds: [embed] });
                } else {
                  let channel = message.guild.channels.cache.get(channelLevel.channel)
                  channel.send({ embeds: [embed] })
                }
              }
            };
            client.setLevel.run(level);
            // add cooldown to user
          talkedRecently.set(message.author.id, Date.now() + getCooldownfromDB);
          setTimeout(() => talkedRecently.delete(message.author.id, Date.now() + getCooldownfromDB))    
            }
                  // level up, time to add level roles
                  const member = message.member;
                  let Roles = sql.prepare("SELECT * FROM roles WHERE guildID = ? AND level = ?")
                  
                  let roles = Roles.get(message.guild.id, lvl)
                  if(!roles) return;
                  if(lvl >= roles.level) {
                  if(roles) {
                  if (member.roles.cache.get(roles.roleID)) {
                    return;
                  }
                     if(!message.guild.me.hasPermission("MANAGE_ROLES")) {
                       return
                     }
                   member.roles.add(roles.roleID);
                  }}
      },
};
