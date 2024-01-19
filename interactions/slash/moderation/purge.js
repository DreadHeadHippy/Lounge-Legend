const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete a specified number of messages.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The number of messages to delete.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    // Check permissions using BigInt(0x00000004) for MANAGE_MESSAGES
    if (!interaction.member.permissions.has(BigInt(0x00000004))) {
      return interaction.reply({
        content: 'You do not have permission to manage messages.',
        ephemeral: true,
      });
    }

    try {
      // Fetch messages and delete them
      const messages = await interaction.channel.messages.fetch({ limit: amount });
      const deletedCount = messages.size;

      if (deletedCount > 0) {
        // Send a reply indicating purging
        await interaction.reply("Purging...");

        // Delete messages
        await interaction.channel.bulkDelete(messages);

        // Create an embed confirming the deletion
        const embed = {
          color: 0x00ff00, // Green color
          title: "✅️ Purge Complete",
          description: `This channel got ${deletedCount} messages lighter!`,
        };

        // Send the embed as a new message in the same channel
        await interaction.channel.send({ embeds: [embed] });
      } else {
        await interaction.reply("No messages found to delete.");
      }
    } catch (error) {
      console.error("Error deleting messages:", error);
      await interaction.reply({ content: "There was an error deleting messages.", ephemeral: true });
    }
  },
};
