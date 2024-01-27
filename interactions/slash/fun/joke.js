const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke'),

  async execute(interaction) {
    try {
      // Fetch a joke from the JokeAPI with a random category
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
      const joke = response.data.type === 'twopart'
        ? `${response.data.setup}\n${response.data.delivery}`
        : response.data.joke;

      await interaction.reply(`Here's a joke for you:\n${joke}`);
    } catch (error) {
      console.error('Error fetching joke:', error.message);
      await interaction.reply('Oops! Something went wrong while fetching a joke.');
    }
  },
};
