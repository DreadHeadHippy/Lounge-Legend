const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,

  /**
   * @description Executes when the client is ready (bot initialization).
   * @param {import('../typings').Client} client Main Application Client.
   */
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Set the bot's activity to "WATCHING" with server member count
    const guild = client.guilds.cache.get('750491328688947212'); // Replace 'your_guild_id' with your actual guild ID

    if (guild) {
      const memberCount = guild.memberCount;

      client.user.setActivity(` "The Gamers Lounge" | ${memberCount} members`, { type: 3 });
    } else {
      console.error('Guild not found.');
    }
  },
};
