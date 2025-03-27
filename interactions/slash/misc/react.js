const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('react')
    .setDescription('React to a message in any channel with an emoji')
    .addStringOption(option =>
      option.setName('message_id')
        .setDescription('The ID of the message you want to react to')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel where the message is located')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('The emoji to react with')
        .setRequired(true)
    ),

  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const emoji = interaction.options.getString('emoji');
    const channel = interaction.options.getChannel('channel'); // Fetches the specified channel.

    if (!interaction.member.permissions.has(BigInt(0x00000008))) { // MANAGE_MESSAGES permission.
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    try {
      const message = await channel.messages.fetch(messageId); // Fetch message from specified channel.
      await message.react(emoji);
      await interaction.reply({ content: `Reacted to message ID ${messageId} in ${channel.name} with ${emoji}.`, ephemeral: true });
    } catch (error) {
      console.error(`An error occurred while reacting to the message:`, error); // Logs detailed error.
      await interaction.reply({
        content: `There was an error trying to react to the message. Ensure the message ID (${messageId}) and channel (${channel.name}) are correct, and that I have the required permissions.\nError Details: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};