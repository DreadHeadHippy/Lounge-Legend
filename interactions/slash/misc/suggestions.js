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
    const suggestionChannel = interaction.guild.channels.cache.find(channel => channel.name === 'ᔕᑌggeᔕtioᑎᔕ');
    const suggestionMessage = await suggestionChannel.send(`New Suggestion from ${interaction.user.tag}:\n${suggestion}`);

    // Add reactions for voting
    await suggestionMessage.react('👍'); // Thumbs up
    await suggestionMessage.react('👎'); // Thumbs down

    await interaction.reply('Thank you for your suggestion!');
  },
};
