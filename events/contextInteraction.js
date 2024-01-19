const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,

  //Executes when an interaction is created and handle it.
execute: async (interaction) => {
    // Deconstructed client from interaction object.
    const { client } = interaction;

    // Checks if the interaction is a context interaction (to prevent weird bugs)
    if (!interaction.isContextMenuCommand()) return;

    /**********************************************************************/

    // Checks if the interaction target was a user
    if (interaction.isUserContextMenuCommand()) {
      const command = client.contextCommands.get(
        "USER " + interaction.commandName
      );

      // A try to execute the interaction.
      try {
        // Handle the specific user context menu command
        if (interaction.commandName === "userinfo") {
          return await command.execute(interaction);
        }
        // Handle other user context menu commands
        // Add more conditions if there are multiple user context menus
        // else if (interaction.commandName === "otherCommandName") {
        //   return await otherCommand.execute(interaction);
        // }

        // If the command doesn't match any known user context menus, do nothing
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: "There was an issue while executing that context command!",
          ephemeral: true,
        });
      }
    }
    // Other conditions for handling different types of context menus can remain unchanged
    // ...
  },
};
