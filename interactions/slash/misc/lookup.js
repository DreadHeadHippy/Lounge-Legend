const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lookup')
    .setDescription('Look up the definition of a word')
    .addStringOption(option =>
      option.setName('word')
        .setDescription('Enter the word you want to look up')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Extract the word to look up from the interaction
      const word = interaction.options.getString('word');

      // Fetch the definition of the word from the Dictionary API
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      const definitions = response.data[0]?.meanings;

      if (!definitions) {
        await interaction.reply(`No definitions found for the word "${word}".`);
        return;
      }

      // Format the definitions
      const formattedDefinitions = definitions.map(meaning => `- *${meaning.partOfSpeech}*: ${meaning.definitions[0].definition}`).join('\n');

      // Respond to the user with the definitions
      await interaction.reply(`Definitions for the word "${word}":\n${formattedDefinitions}`);
    } catch (error) {
      console.error('Error looking up word:', error.message);
      await interaction.reply('Oops! Something went wrong while looking up the word.');
    }
  },
};
