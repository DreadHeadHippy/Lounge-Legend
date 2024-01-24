const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Submit a suggestion')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Your suggestion')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Extract suggestion from the interaction
    const suggestion = interaction.options.getString('message');

    // Get the channel where you want to receive suggestions (replace 'suggestions' with your channel name)
    const suggestionChannel = interaction.guild.channels.cache.find(channel => channel.name === 'suggestions');

    // Send the suggestion to the designated channel
    suggestionChannel.send(`New Suggestion from ${interaction.user.tag}:\n${suggestion}`);

    // Respond to the user
    await interaction.reply('Thank you for your suggestion!');

    // You can add additional logging or error handling as needed
  },
};
