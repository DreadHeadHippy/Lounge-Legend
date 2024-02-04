const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,

  // Executes when the client is ready (bot initialization).
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Set the bot's initial activity
    updateMemberCountActivity(client);

    // Listen for member join event
    client.on('guildMemberAdd', () => {
      updateMemberCountActivity(client);
    });

    // Listen for member leave event
    client.on('guildMemberRemove', () => {
      updateMemberCountActivity(client);
    });
  },
};

// Function to update bot's activity with current member count
function updateMemberCountActivity(client) {
  const guildId = '750491328688947212'; // Replace 'your_guild_id' with your actual guild ID
  const guild = client.guilds.cache.get(guildId);

  if (guild) {
    const memberCount = guild.memberCount;

    client.user.setActivity(` "The Gamers Lounge" | ${memberCount} members`, { type: 3 });
    console.log(`Activity set to "The Gamers Lounge" | ${memberCount} members`);
  } else {
    console.error('Guild not found.');
  }
}
