const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios'); // To make HTTP requests

module.exports = {
  data: new SlashCommandBuilder()
    .setName('steam')
    .setDescription('Search for a game on Steam and get its details')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('The title of the game')
        .setRequired(true)
    ),

  async execute(interaction) {
    const gameTitleInput = interaction.options.getString('title'); // User-provided game title
    const steamApiKey = 'steam_key'; // Replace 'placeholder' with your Steam API key
    const searchUrl = `https://api.steampowered.com/ISteamApps/GetAppList/v2/`;

    try {
      // Fetch the list of apps from Steam API
      const response = await axios.get(searchUrl);
      const apps = response.data.applist.apps;

      // Find the game matching the title (case-insensitive)
      const matchingApp = apps.find(app => app.name.toLowerCase() === gameTitleInput.toLowerCase());

      if (!matchingApp) {
        await interaction.reply({
          content: `No game found with the title "${gameTitleInput}" on Steam.`,
          ephemeral: true,
        });
        return;
      }

      // Fetch detailed game info using the app ID
      const gameDetailsUrl = `https://store.steampowered.com/api/appdetails?appids=${matchingApp.appid}`;
      const gameDetailsResponse = await axios.get(gameDetailsUrl);
      const gameData = gameDetailsResponse.data[matchingApp.appid].data;

      if (!gameData) {
        await interaction.reply({
          content: `Could not fetch details for "${matchingApp.name}".`,
          ephemeral: true,
        });
        return;
      }

      // Extract relevant information
      const gameTitle = gameData.name || 'Unknown';
      const gameDescription = gameData.short_description || 'No description available.';
      const gamePrice = gameData.is_free
        ? 'Free'
        : gameData.price_overview
        ? `$${gameData.price_overview.final / 100}`
        : 'Price not available';
      const gameImage = gameData.header_image || null;
      const gameUrl = `https://store.steampowered.com/app/${matchingApp.appid}/`;

      // Create and send the embed
      const embed = {
        color: 0x1b2838, // Steam's theme color
        title: gameTitle,
        description: gameDescription,
        url: gameUrl,
        image: { url: gameImage }, // Larger image for the game
        fields: [
          { name: 'Price', value: gamePrice, inline: true },
          { name: 'Link', value: `[Steam Page](${gameUrl})`, inline: true },
        ],
        footer: {
          text: 'Data fetched from Steam',
        },
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching game data:', error);
      await interaction.reply({
        content: 'An error occurred while fetching game details. Please try again later.',
        ephemeral: true,
      });
    }
  },
};