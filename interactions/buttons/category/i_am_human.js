module.exports = {
  id: 'i_am_human', // Custom ID of the button

  async execute(interaction) {
    const role = interaction.guild.roles.cache.find(role => role.name === 'Silver Member'); // Replace with the role name in your server

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
      console.error('Failed to assign role:', error);
      await interaction.reply({
        content: "There was an error assigning the role.",
        ephemeral: true,
      });
    }
  },
};