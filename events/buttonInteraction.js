const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    if (!interaction.isButton()) return;

    const { customId, message } = interaction;

    try {
      // Hardcoded adminRoleId for role validation
      const adminRoleId = "1204091424686215180"; // Replace this with your actual admin role ID

      // Fetch the member object for the user interacting with the button
      const member = await interaction.guild.members.fetch(interaction.user.id);

      // Validate user permissions or roles
      const hasAdminPermission = member.permissions.has(PermissionFlagsBits.Administrator);
      const hasAdminRole = member.roles.cache.has(adminRoleId);

      console.log(`User: ${interaction.user.tag}, Admin Permission: ${hasAdminPermission}, Admin Role: ${hasAdminRole}`); // Debugging

      // Deny access if the user lacks both Admin permissions and the Admin role
      if (!hasAdminPermission && !hasAdminRole) {
        return interaction.reply({
          content: "You do not have permission to perform this action.",
          ephemeral: true, // Message only visible to the user
        });
      }

      // Handle approve button logic
      if (customId === "approve_suggestion") {
        console.log("Approve button pressed!");

        // Recreate the original embed and update it
        const originalEmbed = message.embeds[0];
        const updatedEmbed = EmbedBuilder.from(originalEmbed)
          .setColor("#00FF00") // Green for approved
          .setFooter({ text: "Status: Approved" });

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
      }

      // Handle deny button logic
      else if (customId === "deny_suggestion") {
        console.log("Deny button pressed!");

        // Recreate the original embed and update it
        const originalEmbed = message.embeds[0];
        const updatedEmbed = EmbedBuilder.from(originalEmbed)
          .setColor("#FF0000") // Red for denied
          .setFooter({ text: "Status: Denied" });

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
        content: "An error occurred while processing this interaction.",
        ephemeral: true,
      });
    }
  },
};