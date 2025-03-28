const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify yourself by selecting your identity.'),

  async execute(interaction) {
    try {
      // Create the buttons
      const humanButton = new ButtonBuilder()
        .setCustomId('i_am_human') // Button ID for human identity
        .setLabel('I am Human')
        .setStyle(ButtonStyle.Primary); // Primary style for positive actions

      const robotButton = new ButtonBuilder()
        .setCustomId('i_am_robot') // Button ID for robot identity
        .setLabel('I am Robot')
        .setStyle(ButtonStyle.Danger); // Danger style for destructive actions

      // Create an action row to hold the buttons
      const row = new ActionRowBuilder().addComponents(humanButton, robotButton);

      // Send the message with the buttons
      await interaction.reply({
        content: 'Please verify yourself by selecting your identity:',
        components: [row],
        ephemeral: false, // Change to true if the interaction should be private
      });
    } catch (error) {
      console.error('Error during identity check:', error);
      await interaction.reply({
        content: 'An error occurred while presenting identity options.',
        ephemeral: true, // Notify only the user about the error
      });
    }
  },
};