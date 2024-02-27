const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select a banned user to unban')
        .setRequired(true)
    ),

  async execute(interaction) {
    const guild = interaction.guild;

    if (!interaction.member.permissions.has(BigInt(0x10000000))) {
      return interaction.reply({ content: 'You do not have permission to unban members.', ephemeral: true });
    }

    try {
      const bans = await guild.bans.fetch();

      if (!bans.size) {
        return interaction.reply({ content: 'There are no users banned from this server.', ephemeral: true });
      }

      const selectedUser = interaction.options.getUser('user');

      if (!selectedUser) {
        return interaction.reply({ content: 'Invalid user selection.', ephemeral: true });
      }

      const selectedUserId = selectedUser.id;

      await guild.members.unban(selectedUserId);
      await interaction.reply(`User with ID ${selectedUserId} has been unbanned.`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while trying to unban the user.', ephemeral: true });
    }
  },
};
