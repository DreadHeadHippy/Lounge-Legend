const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    if (!interaction.isButton()) return;

    const { customId, message } = interaction;

    try {
      if (customId === "approve_suggestion") {
        console.log("Approve button pressed!");

        // Recreate the original embed and update it
        const originalEmbed = message.embeds[0];
        const updatedEmbed = EmbedBuilder.from(originalEmbed)
          .setColor("#00FF00") // Valid hexadecimal color for green
          .setFooter({ text: "Status: Approved" })
          .setDescription(`${originalEmbed.description}\n\n✅ **This suggestion has been approved.**`);

        // Update the message with the modified embed and disable buttons
        await message.edit({
          embeds: [updatedEmbed],
          components: [], // Disable the buttons
        });

        // Respond to the user who clicked the button
        await interaction.reply({
          content: "You approved this suggestion!",
          ephemeral: true,
        });

        console.log("Suggestion approved and buttons disabled.");
      } else if (customId === "deny_suggestion") {
        console.log("Deny button pressed!");

        // Recreate the original embed and update it
        const originalEmbed = message.embeds[0];
        const updatedEmbed = EmbedBuilder.from(originalEmbed)
          .setColor("#FF0000") // Valid hexadecimal color for red
          .setFooter({ text: "Status: Denied" })
          .setDescription(`${originalEmbed.description}\n\n❌ **This suggestion has been denied.**`);

        // Update the message with the modified embed and disable buttons
        await message.edit({
          embeds: [updatedEmbed],
          components: [], // Disable the buttons
        });

        // Respond to the user who clicked the button
        await interaction.reply({
          content: "You denied this suggestion!",
          ephemeral: true,
        });

        console.log("Suggestion denied and buttons disabled.");
      }

      // Lock the thread tied to the embed if it exists
        if (message.thread) {
          console.log("Attempting to lock the thread...");
          await message.thread.setLocked(true); // Lock the thread
          console.log("Thread locked successfully.");
        }
      } catch (error) {
        console.error("Error handling button interaction:", error);

      // Handle errors gracefully
      await interaction.reply({
        content: "There was an error handling this button interaction.",
        ephemeral: true,
      });
    }
  },
};