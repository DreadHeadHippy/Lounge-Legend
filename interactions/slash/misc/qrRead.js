const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qrread')
    .setDescription('Read a QR code from a provided media link')
    .addStringOption(option =>
      option.setName('medialink')
        .setDescription('Media link containing the QR code')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Extract the media link from the interaction
    const mediaLink = interaction.options.getString('medialink');

    try {
      // Respond to the user with "Decoding..."
      await interaction.reply('Decoding...');

      // Construct the API URL for QR code scanning
      const scanUrl = `https://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURIComponent(mediaLink)}`;

      // Make a request to the QR code scanning API
      const scanResponse = await axios.get(scanUrl);

      // Extract the decoded content
      const decodedContent = scanResponse.data[0].symbol[0].data;

      // Respond to the user with the decoded content in a new message
      await interaction.followUp(`Decoded Content from the provided media link with a QR code: ${decodedContent}`);
    } catch (error) {
      // Handle errors, e.g., if there's an issue with the API request or decoding
      console.error(error);
      await interaction.followUp('Sorry, there was an error scanning the provided media link with a QR code.');
    }
  },
};
