const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get current weather information for a location')
    .addStringOption(option =>
      option.setName('location')
        .setDescription('The city and state or zip code for weather information')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Extract the location from the interaction
    const location = interaction.options.getString('location');

    // Replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual OpenWeatherMap API key
    const apiKey = 'c6f0262e4f075dd2a973ca5c960f477b';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=imperial`;

    try {
      // Make a request to the OpenWeatherMap API
      const response = await axios.get(apiUrl);
      const weatherInfo = response.data.weather[0];
      const temperature = response.data.main.temp;

      // Respond to the user with the weather information
      await interaction.reply(`Current weather in ${location}: ${temperature}°F, ${weatherInfo.description}`);

      // You can add additional formatting or logging as needed
    } catch (error) {
      // Handle errors, e.g., if the location is not found or there's an issue with the API request
      console.error(error);
      await interaction.reply('Sorry, there was an error fetching the weather information.');
    }
  },
};
