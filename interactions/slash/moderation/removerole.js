const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removerole")
    .setDescription("Remove a role from another user.")
    .addUserOption((option) =>
      option
        .setName("target_user")
        .setDescription("The user from whom you want to remove a role.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role_name")
        .setDescription("The name of the role you want to remove.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("target_user");
    const roleName = interaction.options.getRole("role_name");

    const member = interaction.guild.members.cache.get(targetUser.id);

    // Check permissions here, using Permissions.FLAGS.MANAGE_ROLES
    if (!interaction.member.permissions.has(BigInt(0x00000004))) {
      return interaction.reply({
        content: "You do not have permission to remove roles from members.",
        ephemeral: true,
      });
    }

    try {
      // Remove the role from the user
      await member.roles.remove(roleName);
      await interaction.reply(`Removed role ${roleName.name} from ${targetUser.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply("There was an error removing the role.");
    }
  },
};
