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
    const suggestion = interaction.options.getString('message');
    const suggestionChannel = interaction.guild.channels.cache.find(channel => channel.name === 'suggestions');
    suggestionChannel.send(`New Suggestion from ${interaction.user.tag}:\n${suggestion}`);
    await interaction.reply('Thank you for your suggestion!');
  },
};
