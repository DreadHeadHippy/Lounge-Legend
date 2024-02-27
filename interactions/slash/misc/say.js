const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something in a specific channel or to a user')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to be said')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel where the message will be sent')
    )
    .addStringOption(option =>
      option.setName('user')
        .setDescription('The ID of the user to whom the message will be sent')
    ),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel');
    const userId = interaction.options.getString('user');

    if (!interaction.member.permissions.has(BigInt(0x00002000))) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    try {
      if (channel) {
        await channel.send(message);
        await interaction.reply(`Message sent in ${channel}: ${message}`);
      } else if (userId) {
        const user = await interaction.client.users.fetch(userId);
        await user.send(message);
        await interaction.reply(`Message sent to ${user.tag}: ${message}`);
      } else {
        await interaction.reply({ content: 'Please specify either a channel or a user ID.', ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while trying to send the message.', ephemeral: true });
    }
  },
};
