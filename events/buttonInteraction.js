const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const votedCommand = require("../interactions/buttons/category/voted.js"); // Import the entire object from voted.js

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    if (!interaction.isButton()) return;

    const { customId, message } = interaction;

    try {
      // Hardcoded adminRoleId for role validation
      const adminRoleId = "1204091424686215180"; // Replace with your actual admin role ID

      // Fetch the member object for the user interacting with the button
      const member = await interaction.guild.members.fetch(interaction.user.id);

      // Validate user permissions or roles for admin actions
      const hasAdminPermission = member.permissions.has(PermissionFlagsBits.Administrator);
      const hasAdminRole = member.roles.cache.has(adminRoleId);

      // Debugging admin permissions
      console.log(`User: ${interaction.user.tag}, Admin Permission: ${hasAdminPermission}, Admin Role: ${hasAdminRole}`);

      // Logic for the 'voted' button (accessible to everyone)
      if (customId === "voted") {
        console.log(`'I Voted!' button pressed by ${interaction.user.tag}`);
        await votedCommand.execute(interaction); // Call the execute method in voted.js
        return;
      }

      // Logic for admin-only buttons
      if (!hasAdminPermission && !hasAdminRole && (customId === "approve_suggestion" || customId === "deny_suggestion")) {
        return interaction.reply({
          content: "You do not have permission to perform this action.",
          ephemeral: true,
        });
      }

      // Handle approve button logic
      if (customId === "approve_suggestion") {
        const originalEmbed = message.embeds[0];
        const updatedEmbed = EmbedBuilder.from(originalEmbed)
          .setColor("#00FF00")
          .setFooter({ text: "Status: Approved" });

        await message.edit({
          embeds: [updatedEmbed],
          components: [],
        });

        await interaction.reply({
          content: "You approved this suggestion!",
          ephemeral: true,
        });

        console.log("Suggestion approved and buttons disabled.");
      } 

      // Handle deny button logic
      else if (customId === "deny_suggestion") {
        const originalEmbed = message.embeds[0];
        const updatedEmbed = EmbedBuilder.from(originalEmbed)
          .setColor("#FF0000")
          .setFooter({ text: "Status: Denied" });

        await message.edit({
          embeds: [updatedEmbed],
          components: [],
        });

        await interaction.reply({
          content: "You denied this suggestion!",
          ephemeral: true,
        });

        console.log("Suggestion denied and buttons disabled.");
      }

      // Logic for the 'i_am_human' button
      else if (customId === "i_am_human") {
        console.log(`'I Am Human' button pressed by ${interaction.user.tag}`);
        const role = interaction.guild.roles.cache.find(role => role.name === "Silver Member"); // Replace with the appropriate role name

        if (!role) {
          return await interaction.reply({
            content: "The 'Silver Member' role does not exist in this server.",
            ephemeral: true, // Notify only the user
          });
        }

        try {
          // Assign the role to the user
          await interaction.member.roles.add(role);
          await interaction.reply({
            content: "You have been assigned the 'Silver Member' role!",
            ephemeral: true,
          });
        } catch (error) {
          console.error("Failed to assign role:", error);
          await interaction.reply({
            content: "There was an error assigning the role.",
            ephemeral: true,
          });
        }
        return;
      }

      // Logic for the 'i_am_robot' button
      else if (customId === "i_am_robot") {
        console.log(`'I Am Robot' button pressed by ${interaction.user.tag}`);

        try {
          // Notify the user before kicking them
          await interaction.reply({
            content: "You have been identified as a robot and will be removed from the server in 5 seconds.",
            ephemeral: true, // Notify only the user
          });

          // Introduce a short delay (5 seconds) before kicking the user
          setTimeout(async () => {
            try {
              await interaction.member.kick("User identified as a robot"); // Kick the user with a reason
              console.log(`User ${interaction.user.tag} has been kicked.`);
            } catch (error) {
              console.error("Failed to kick user:", error);
            }
          }, 5000); // 5-second delay
        } catch (error) {
          console.error("Failed to notify user before kick:", error);
          await interaction.reply({
            content: "There was an error kicking the user.",
            ephemeral: true,
          });
        }
        return;
      }

      // Placeholder logic for additional buttons (if needed)
      else if (customId === "button_1") { // Replace "button_1" with the actual customId
        console.log(`Button 1 pressed by ${interaction.user.tag}`);
        // Add specific functionality for button_1 here
        await interaction.reply({
          content: "Button 1 action executed!",
          ephemeral: true,
        });
      } else if (customId === "button_2") { // Replace "button_2" with the actual customId
        console.log(`Button 2 pressed by ${interaction.user.tag}`);
        // Add specific functionality for button_2 here
        await interaction.reply({
          content: "Button 2 action executed!",
          ephemeral: true,
        });
      }

      // Lock the thread tied to the embed if it exists
      if (message.thread) {
        console.log("Attempting to lock the thread...");
        await message.thread.setLocked(true);
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