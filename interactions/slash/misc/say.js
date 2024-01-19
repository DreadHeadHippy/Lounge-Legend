const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something in a specific channel')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to be said')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel where the message will be sent')
        .setRequired(true)
    ),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel');

    if (!interaction.member.permissions.has(BigInt(0x00000004))) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    try {
      await channel.send(message);
      await interaction.reply(`Message sent in ${channel}: ${message}`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while trying to send the message.', ephemeral: true });
    }
  },
};
