const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Coin Flip') // Name of the context menu
    .setType(ApplicationCommandType.User), // Context menu for user interactions

  async execute(interaction) {
    // Generate a random result: heads or tails
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

    // Reply to the interaction with the coin flip result
    await interaction.reply({
      content: `Coin landed on: ${result}`,
      ephemeral: false, // Makes the response visible only to the user
    });
  },
};