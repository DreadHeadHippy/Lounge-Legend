const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { Permissions } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("Add a role to another user.")
    .addUserOption((option) =>
      option
        .setName("target_user")
        .setDescription("The user to whom you want to add a role.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role_name")
        .setDescription("The name of the role you want to add.")
        .setRequired(true)
    ),

      async execute(interaction) {
      const targetUser = interaction.options.getUser("target_user");
      const roleName = interaction.options.getRole("role_name");

      const member = interaction.guild.members.cache.get(targetUser.id);

      // Check permissions here, using Permissions.FLAGS.MANAGE_ROLES
        if (!interaction.member.permissions.has(BigInt(0x00000004))) {
          return interaction.reply({ content: 'You do not have permission to add roles to members.', ephemeral: true });
        }

      try {
        // Add the role to the user
        await member.roles.add(roleName);
        await interaction.reply(`Added role ${roleName.name} to ${targetUser.tag}.`);
      } catch (error) {
        console.error(error);
        await interaction.reply("There was an error adding the role.");
    }
  },
};
