const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timer")
    .setDescription("Set a timer for a specified duration and reason.")
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of the timer in minutes.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for setting the timer.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const duration = interaction.options.getInteger("duration");
    const reason = interaction.options.getString("reason");

    // Calculate the time in milliseconds
    const timeInMs = duration * 60000;

    // Set the timer
    setTimeout(async () => {
      // Notify the user when the timer is up
      const reminderMessage = `Hey ${interaction.user.toString()}, time to ${reason}!`;

      // Send a new message with the reminder
      await interaction.followUp(reminderMessage);
    }, timeInMs);

    // Confirmation message
    await interaction.reply({
      content: `Timer set for ${duration} minutes. I will notify you when it's time to ${reason}.`,
    });
  },
};
