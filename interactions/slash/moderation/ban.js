const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to be banned')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.permissions.has(BigInt(0x10000000))) {
      return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
    }

    try {
      await interaction.guild.members.ban(user, { reason });
      await interaction.reply(`Achievement Unlocked: Ban-Hammered! ${user.tag} banned for attempting to speedrun the rules of The Gamers Lounge.`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while trying to ban the user.', ephemeral: true });
    }
  },
};
