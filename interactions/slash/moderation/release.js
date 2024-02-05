const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('release')
    .setDescription('Release an inmate from jail')
    .addUserOption((option) =>
      option.setName('user')
        .setDescription('The user to be released')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    const inmateRole = interaction.guild.roles.cache.find(role => role.name === 'Inmate');
    if (!inmateRole) {
      return interaction.reply('The "inmate" role is not set up properly.');
    }

    if (!interaction.member.permissions.has(BigInt(0x00000004))) {
      return interaction.reply({ content: 'You do not have permission to release inmates.', ephemeral: true });
    }

    try {
      // Store user's roles before removing inmate role
      const originalRoles = member.roles.cache.filter(role => role.id !== inmateRole.id);

      await member.roles.remove(inmateRole);

      // Reapply original roles
      await member.roles.add(originalRoles);

      await interaction.reply(`Successfully released ${user.tag} from jail.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error trying to release the user.');
    }
  },
};
