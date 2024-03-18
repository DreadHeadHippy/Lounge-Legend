const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify yourself to gain access to the server.'),

  async execute(interaction) {
    try {
      const roleID = '1184438090375381063'; // Your verification role ID
      const role = interaction.guild.roles.cache.get(roleID);

      if (!role) {
        await interaction.reply({ content: 'Verification role not found.', ephemeral: true });
        return;
      }

      await interaction.member.roles.add(role);
      await interaction.reply({ content: 'You have been verified successfully!', ephemeral: true });
    } catch (error) {
      console.error('Error verifying user:', error);
      await interaction.reply({ content: 'An error occurred while verifying you.', ephemeral: true });
    }
  },
};
