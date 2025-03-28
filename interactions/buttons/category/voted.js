const { Collection } = require("discord.js");

/**
 * A collection to track active timers for users. Key is the user ID, and value is the timer expiration timestamp.
 */
const activeTimers = new Collection();

/**
 * @type {import('../../../typings').ButtonInteractionCommand}
 */
module.exports = {
  id: "voted", // Custom ID for the button

  async execute(interaction) {
    const userId = interaction.user.id;
    const currentTime = Date.now();

    // Check if the user already has an active timer
    if (activeTimers.has(userId)) {
      const expirationTime = activeTimers.get(userId);
      const remainingTime = Math.ceil((expirationTime - currentTime) / 1000);

      if (remainingTime > 0) {
        // Notify the user about the remaining time
        return await interaction.reply({
          content: `You've already clicked the button! Time remaining: ${Math.floor(
            remainingTime / 60
          )} minute(s) and ${remainingTime % 60} second(s).`,
          ephemeral: true,
        });
      }
    }

    // Set a new timer for the user (2 hours = 7200000 milliseconds)
    const newExpirationTime = currentTime + 7200000; // 2 hours
    activeTimers.set(userId, newExpirationTime);

    // Respond to the button click
    await interaction.reply({
      content: "Thank you for voting! We'll remind you in 2 hours.",
      ephemeral: true, // Makes the message visible only to the user
    });

    // Schedule the reminder
    setTimeout(async () => {
      try {
        // Send the reminder as a new message in the same channel
        await interaction.channel.send(`<@${userId}>, it's time to vote again!`);

        // Remove the user from the activeTimers collection
        activeTimers.delete(userId);
      } catch (error) {
        console.error("Failed to send reminder:", error);
      }
    }, 7200000); // 2 hours

    return;
  },
};