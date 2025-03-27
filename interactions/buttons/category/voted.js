/**
 * @type {import('../../../typings').ButtonInteractionCommand}
 */
module.exports = {
  id: "voted", // Custom ID for the button

  async execute(interaction) {
    // Respond to the button click
    await interaction.reply({
      content: "Thank you for voting! We'll remind you in 2 hours.",
      ephemeral: true, // Makes the message visible only to the user
    });

    // Set a timeout to send a follow-up reminder after 2 hours (7200000 ms)
    setTimeout(async () => {
      try {
        await interaction.followUp({
          content: "It's time to vote again!",
          ephemeral: true, // Keeps this reminder private
        });
      } catch (error) {
        console.error("Failed to send reminder:", error);
      }
    }, 7200000);

    return;
  },
};