const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qrcreate')
    .setDescription('Create a QR code')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('The content for the QR code')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Extract the content from the interaction
    const content = interaction.options.getString('content');

    // Generate a QR code using api.qrserver.com
    const generateUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(content)}&size=150x150`;

    try {
      // Make a request to the QR code generation API
      const qrCodeResponse = await axios.get(generateUrl);

      // Respond to the user with the generated QR code
      await interaction.reply({
        files: [{
          attachment: qrCodeResponse.request.res.responseUrl,
          name: 'qrcode.png',
        }],
      });
    } catch (error) {
      // Handle errors, e.g., if there's an issue with the API request
      console.error(error);
      await interaction.reply('Sorry, there was an error generating the QR code.');
    }
  },
};
