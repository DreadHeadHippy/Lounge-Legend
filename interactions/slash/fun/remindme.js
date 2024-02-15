const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remindme")
    .setDescription("Set a reminder.")
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("how long until you are reminded.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message for the reminder.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const duration = interaction.options.getString("duration");
    const message = interaction.options.getString("message");

    // Parse duration to milliseconds
    const timeInMs = parseDuration(duration);

    // Set the reminder
    setTimeout(async () => {
      // Notify the user when the reminder is up
      const reminderMessage = `Hey ${interaction.user.toString()}, here's your reminder to ${message}`;

      // Send a new message with the reminder
      await interaction.channel.send(reminderMessage);
    }, timeInMs);

    // Confirmation message
    await interaction.reply({
      content: `I will remind you in ${duration} to "${message}".`,
    });
  },
};

// Function to parse duration in various formats to milliseconds
function parseDuration(duration) {
  // Example duration formats: "10m", "2h", "30s"
  const durationRegex = /(\d+)([smh])/;
  const match = duration.match(durationRegex);
  if (!match) return 0;

  const [, value, unit] = match;
  const valueInMs = parseInt(value, 10);

  switch (unit) {
    case "s":
      return valueInMs * 1000; // Seconds to milliseconds
    case "m":
      return valueInMs * 60 * 1000; // Minutes to milliseconds
    case "h":
      return valueInMs * 60 * 60 * 1000; // Hours to milliseconds
    default:
      return 0;
  }
}
