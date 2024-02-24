const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cleandms')
    .setDescription('Clean up DMs with a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose DMs you want to clean')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Check if the user has the required permission (MANAGE_MESSAGES)
    const MANAGE_MESSAGES_PERMISSION = BigInt("0x00002000");
    if (!interaction.member.permissions.has(MANAGE_MESSAGES_PERMISSION)) {
      return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    // Get the user selected in the interaction
    const user = interaction.options.getUser('user');

    try {
      // Fetch the DM channel between your bot and the selected user
      const dmChannel = await user.createDM();

      // Fetch messages in the DM channel
      const messages = await dmChannel.messages.fetch({ limit: 100 }); // Fetch up to 100 messages

      // Delete each message
      for (const message of messages.values()) {
        await message.delete().catch(error => {
          // Handle the error, if needed
          console.error('Error deleting message:', error);
        });
      }

      await interaction.reply(`DMs with ${user.tag} cleaned up successfully.`);
    } catch (error) {
      console.error('Error cleaning up DMs:', error);
      await interaction.reply('An error occurred while cleaning up DMs.');
    }
  },
};
