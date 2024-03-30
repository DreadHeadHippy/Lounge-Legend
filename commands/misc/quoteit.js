const Jimp = require('jimp');
const fs = require('fs');

module.exports = {
  name: 'quoteit',
  description: 'Quote a message',
  async execute(message) {
    try {
      // Check if the command was used as a reply
      if (!message.reference || !message.reference.messageId) {
        await message.reply('Please use this command as a reply to the message you want to quote.', { ephemeral: true });
        return;
      }

      // Get the replied message
      const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);

      // Get the content and author of the replied message
      const { content, author } = repliedMessage;

      // Load the background image from the URL using JIMP
      const backgroundImage = await Jimp.read('https://cdn.discordapp.com/attachments/1218267262406889522/1220810306448523355/2Z17cSV.jpg?ex=66104b32&is=65fdd632&hm=350070adfca252731c2109768152d08261164fffbacef702580df16c3a763dfb&');

      // Create a new JIMP image for the quoted message
      const quotedImage = backgroundImage.clone();

      // Define text properties
      const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

      // Define the maximum width and height for the text
      const maxWidth = quotedImage.bitmap.width - 70; // Adjust as needed
      const maxHeight = quotedImage.bitmap.height - 24; // Adjust as needed

      // Add the quoted text centered on the image within the specified maximum width and height
      quotedImage.print(font, 35, 12, {
        text: `"${content}"\n- ${author.tag}`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      }, maxWidth, maxHeight);

      // Save the resulting image
      const outputFilePath = 'output.jpg';
      await quotedImage.writeAsync(outputFilePath);

      // Read the saved image file as a buffer
      const imageBuffer = fs.readFileSync(outputFilePath);

      // Get the target channel by ID
      const targetChannelId = '1220596029112455299'; // Replace with the actual channel ID where you want to send the quoted image
      const targetChannel = message.client.channels.cache.get(targetChannelId);

      if (!targetChannel) {
        throw new Error('Target channel not found.');
      }

      // Send the image buffer as a file attachment
      await targetChannel.send({ content: 'Quoted!', files: [{ attachment: imageBuffer, name: 'quoted-image.jpg' }] });

      // Reply in the current channel
      await message.reply({ content: 'Successfully quoted message.', ephemeral: true });
    } catch (error) {
      console.error('Error quoting message:', error);
      await message.reply('Oops! Something went wrong while quoting the message.', { ephemeral: true });
    }
  },
};
