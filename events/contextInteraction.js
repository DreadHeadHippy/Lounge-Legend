const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,

  // Executes when an interaction is created
  async execute(interaction) {
    const { client } = interaction;

    // Check if the interaction is a context menu interaction
    if (!interaction.isContextMenuCommand()) return;

    // Dynamically handle user context menu commands
    if (interaction.isUserContextMenuCommand()) {
      const command = client.contextCommands.get(
        "USER " + interaction.commandName
      );

      // If the command is not found in the contextCommands collection
      if (!command) {
        return await interaction.reply({
          content: `The context menu command "${interaction.commandName}" is not recognized.`,
          ephemeral: true,
        });
      }

      // Try executing the matched command
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: "There was an issue while executing that context command!",
          ephemeral: true,
        });
      }
    }
  },
};