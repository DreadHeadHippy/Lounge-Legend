const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const mySecret = process.env['apiKey']

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

    // Replace 'YOUR_ACCUWEATHER_API_KEY' with your actual AccuWeather API key
    const apiKey = 'g0sTHa5TbPwDRdUiebAan9aXhjRVdSJx';
    const apiUrl = `http://dataservice.accuweather.com/locations/v1/search?q=${encodeURIComponent(location)}&apikey=${apiKey}`;

    try {
      // Make a request to the AccuWeather API to get location key
      const locationResponse = await axios.get(apiUrl);
      const locationKey = locationResponse.data[0].Key;

      // Use the location key to fetch current conditions
      const currentConditionsUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`;

      // Make a request to the AccuWeather API for current conditions
      const response = await axios.get(currentConditionsUrl);
      const weatherInfo = response.data[0];

      // Extract relevant information from the response
      const temperature = weatherInfo.Temperature.Imperial.Value;
      const description = weatherInfo.WeatherText;
      const humidity = weatherInfo.RelativeHumidity;
      const windSpeed = weatherInfo.Wind.Speed.Imperial.Value;
      const uvIndex = weatherInfo.UVIndex;
      const visibility = weatherInfo.Visibility.Imperial.Value;
      const pressure = weatherInfo.Pressure.Imperial.Value;

      // Respond to the user with extended weather information
      await interaction.reply(`
        Current weather in ${location}:
        - Temperature: ${temperature}°F
        - Description: ${description}
        - Humidity: ${humidity}%
        - Wind Speed: ${windSpeed} mph
        - UV Index: ${uvIndex}
        - Visibility: ${visibility} miles
        - Pressure: ${pressure} inHg
      `);

      // You can add additional formatting or logging as needed
    } catch (error) {
      // Handle errors, e.g., if the location is not found or there's an issue with the API request
      console.error(error);
      await interaction.reply('Sorry, there was an error fetching the weather information.');
    }
  },
};
