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
    // Find the suggestion channel by ID instead of name
    const suggestionChannel = interaction.guild.channels.cache.get('1199865837339824280');
    if (!suggestionChannel) {
      return interaction.reply("Couldn't find the suggestion channel.");
    }

    const suggestionMessage = await suggestionChannel.send(`New Suggestion from ${interaction.user.tag}:\n${suggestion}`);

    // Get custom emojis from the guild and filter by name
    const upVoteEmoji = interaction.guild.emojis.cache.find(emoji => emoji.name === 'UpVote');
    const downVoteEmoji = interaction.guild.emojis.cache.find(emoji => emoji.name === 'DownVote');

    // Add reactions for voting using custom emojis
    if (upVoteEmoji && downVoteEmoji) {
      await suggestionMessage.react(upVoteEmoji);
      await suggestionMessage.react(downVoteEmoji);
    } else {
      await interaction.reply("Couldn't find custom emojis. Please make sure they're set up correctly.");
    }

    await interaction.reply('Thank you for your suggestion!');
  },
};
