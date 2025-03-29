const { Collection, ChannelType, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const config = require("../config.json"); // Import your config.json file

// Directly define adminRoleId and suggestionsChannelId here
const adminRoleId = "1204091424686215180"; // Replace with actual Admin Role ID
const suggestionsChannelId = "1355273996345540789"; // Replace with actual Suggestions Channel ID

// Use values from config.json
const prefix = config.prefix;
const owner = config.owner;

// Prefix regex for matching mention prefix
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = {
  name: Events.MessageCreate,

  async execute(message) {
    // Early exits for invalid conditions
    if (!message || !message.channel || !message.author || !message.content) {
      console.warn("Received invalid or system message. Ignoring.");
      return;
    }

    // Ensure the bot doesn't process its own messages
    if (message.author.bot) {
      console.warn("Message is from a bot. Ignoring.");
      return;
    }

    // Ignore non-GuildText channels
    if (message.channel.type !== ChannelType.GuildText) {
      console.warn("Message is not from a GuildText channel. Ignoring.");
      return;
    }

    // Declares const to be used
    const { client, channel, content, author } = message;

    // Debug logs to verify incoming message data
    console.log("Message received:", {
      content: content,
      author: author.tag,
      channelId: channel.id,
      expectedChannelId: suggestionsChannelId,
    });

    // Suggestions feature
    if (channel.id === suggestionsChannelId) {
      console.log("Suggestions feature triggered. Channel ID matches.");

      try {
        // Create an embed for the suggestion
        const embed = new EmbedBuilder()
          .setColor("#FFFFFF") // White for the embed
          .setAuthor({ name: `Suggested by ${author.tag}`, iconURL: author.displayAvatarURL() })
          .setDescription(content)
          .setFooter({ text: "Please wait for a decision" });

        // Create buttons for admin actions
        const approveButton = new ButtonBuilder()
          .setCustomId("approve_suggestion")
          .setLabel("Approved")
          .setStyle(ButtonStyle.Success);

        const denyButton = new ButtonBuilder()
          .setCustomId("deny_suggestion")
          .setLabel("Denied")
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(approveButton, denyButton);

        // Send a new embed and delete the user's original message
        const sentMessage = await channel.send({ embeds: [embed], components: [row] });
        console.log("Embed and buttons sent successfully.");

        // React to the sent embed
        await sentMessage.react("✅");
        await sentMessage.react("❌");
        console.log("Reactions added to the message.");

        // Create a thread for the suggestion
        const thread = await sentMessage.startThread({
          name: `Discussion: ${author.username}'s Suggestion`,
          autoArchiveDuration: 1440, // 1 day auto-archive duration
          reason: "Created for discussion on the suggestion.",
        });
        console.log(`Thread created successfully: ${thread.name}`);

        // Delete the original user message
        await message.delete();
        console.log("Original message deleted successfully.");
      } catch (error) {
        console.error("Error handling suggestion:", error);
      }

      // Exit after handling the suggestion
      return;
    }

    // Prefix logic for commands
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );

    if (!prefixRegex.test(content.toLowerCase())) return;

    const [matchedPrefix] = content.toLowerCase().match(prefixRegex);
    const args = content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Command handling
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    // Owner-only commands
    if (command.ownerOnly && message.author.id !== owner) {
      return message.reply({ content: "This is an owner-only command!" });
    }

    // Guild-only commands
    if (command.guildOnly && message.channel.type === ChannelType.DM) {
      return message.reply({
        content: "I can't execute that command inside DMs!",
      });
    }

    // Check for permissions
    if (command.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (!authorPerms || !authorPerms.has(command.permissions)) {
        return message.reply({ content: "You cannot do this!" });
      }
    }

    // Cooldowns
    const { cooldowns } = client;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply({
          content: `please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`,
        });
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Try executing the command
    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply({
        content: "There was an error trying to execute that command!",
      });
    }
  },
};