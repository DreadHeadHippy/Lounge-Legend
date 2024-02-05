const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jail')
    .setDescription('Jail a user')
    .addUserOption((option) =>
      option.setName('user')
        .setDescription('The user to be jailed')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName('duration')
        .setDescription('Duration of jail sentence in minutes')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const duration = interaction.options.getInteger('duration');

    const inmateRole = interaction.guild.roles.cache.find(role => role.name === 'Inmate');
    if (!inmateRole) {
      return interaction.reply('The "inmate" role is not set up properly.');
    }

    if (!interaction.member.permissions.has(BigInt(0x00000004))) {
      return interaction.reply({ content: 'You do not have permission to jail users.', ephemeral: true });
    }

    try {
      // Store user's roles before modifying
      const originalRoles = member.roles.cache.map(role => role.id);

      // Add inmate role to the user
      await member.roles.add(inmateRole);

      // Remove other roles from the user
      await member.roles.set([inmateRole.id]);

      await interaction.reply(`Successfully jailed ${user.tag} for ${duration} minutes!`);

      // Set a timeout to remove the inmate role after the specified duration
      setTimeout(async () => {
        // Reapply original roles
        await member.roles.add(originalRoles);

        // Remove inmate role
        await member.roles.remove(inmateRole);

        interaction.followUp(`Released ${user.tag} from jail after ${duration} minutes.`);
      }, duration * 60000);
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error trying to jail the user.');
    }
  },
};
