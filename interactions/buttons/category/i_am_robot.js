module.exports = {
  id: 'i_am_robot', // Custom ID of the button

  async execute(interaction) {
    try {
      // Notify the user before kicking them
      await interaction.reply({
        content: "You have been identified as a robot and will be removed from the server in 5 seconds.",
        ephemeral: true, // Message visible only to the user
      });

      // Introduce a short delay (5000 ms = 5 seconds) before kicking the user
      setTimeout(async () => {
        try {
          await interaction.member.kick('User identified as a robot'); // Kick the user with a reason
        } catch (error) {
          console.error('Failed to kick user:', error);
        }
      }, 5000); // 5-second delay
    } catch (error) {
      console.error('Failed to notify user before kick:', error);
      await interaction.reply({
        content: "There was an error kicking the user.",
        ephemeral: true,
      });
    }
  },
};