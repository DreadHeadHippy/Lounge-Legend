const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('showvotedbutton')
    .setDescription('Show a button for users to mark their vote'),

  async execute(interaction) {
    // Create the "voted" button
    const votedButton = new ButtonBuilder()
      .setCustomId('voted') // Matches the ID defined in your "voted.js" file
      .setLabel('I Voted!') // Text displayed on the button
      .setStyle(ButtonStyle.Primary); // Button style

    // Create an action row to hold the button
    const row = new ActionRowBuilder().addComponents(votedButton);

    // Send the message with the button
    await interaction.reply({
      content: 'Click the button below once you\'ve voted!',
      components: [row], // Attach the button to the message
    });
  },
};