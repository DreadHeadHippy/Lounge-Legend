const { SlashCommandBuilder } = require('@discordjs/builders');
const reactionRoles = require('../../../reactionRoles.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-reaction-message')
    .setDescription('Create a reaction message with specified role and emoji')
    .addStringOption(option =>
      option.setName('roles')
        .setDescription('The roles to assign when reacting, separated by commas')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('emojis')
        .setDescription('The emojis to react with, separated by commas')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Title of the embed')
        .setRequired(true)),
  async execute(interaction) {
    const rolesString = interaction.options.getString('roles');
    const emojisString = interaction.options.getString('emojis');
    const title = interaction.options.getString('title');

    // Check if rolesString and emojisString are not null or undefined
    if (!rolesString || !emojisString) {
      return interaction.reply({ content: 'Please provide roles and emojis.', ephemeral: true });
    }

    // Split rolesString and emojisString into arrays
    const roles = rolesString.split(',').map(r => r.trim());
    const emojis = emojisString.split(',').map(e => e.trim());

    // Convert hexadecimal color code to integer
    const color = parseInt('0099ff', 16);

    // Create the embed
    const embed = {
      color: color,
      title: title,
      description: 'React with the corresponding emoji to get the specified role',
    };

    // Send the initial reply
    await interaction.reply({ content: 'Creating reaction message...', ephemeral: true });

    // Send the embed
    const message = await interaction.channel.send({ embeds: [embed] });

    // Add reactions
    for (const emoji of emojis) {
      // Check if the emoji is a custom emoji
      const customEmojiRegex = /<a?:[a-zA-Z0-9_]+:[0-9]+>|:[a-zA-Z0-9_]+:/;
      if (customEmojiRegex.test(emoji)) {
        // Extract the emoji name
        const emojiName = emoji.match(/(?<=:)[a-zA-Z0-9_]+(?=:)/);
        if (emojiName) {
          // Resolve the custom emoji by name
          const resolvedEmoji = interaction.guild.emojis.cache.find(e => e.name === emojiName[0]);
          if (resolvedEmoji) {
            await message.react(resolvedEmoji);
          } else {
            console.log(`Failed to resolve emoji: ${emoji}`);
          }
        } else {
          console.log(`Invalid custom emoji format: ${emoji}`);
        }
      } else {
        // Standard emoji, directly react with it
        await message.react(emoji);
      }
    }

    await interaction.editReply({ content: 'Reaction message created successfully.', embeds: [embed], ephemeral: true });
  },
};
