// events/modmail.js

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        const modMailChannelId = '1205415290738053201'; // Replace with your modmail channel ID

        // Filter out messages that are not in guilds (direct messages)
        if (!message.guild && !message.author.bot) {
            console.log(`Received modmail message from ${message.author.tag}: ${message.content}`);

            const modMailChannel = client.channels.cache.get(modMailChannelId);
            if (modMailChannel) {
                let forwardedContent = `**From:** ${message.author.tag} (${message.author.id})`;

                // Add text content if available
                if (message.content) {
                    forwardedContent += `\n\n**Content:**\n${message.content}`;
                }

                // Add attachments if available
                if (message.attachments.size > 0) {
                    const attachments = message.attachments.map(attachment => attachment.url);
                    forwardedContent += `\n\n**Attachments:**\n${attachments.join('\n')}`;
                }

                // Add embeds if available
                if (message.embeds.length > 0) {
                    const embeds = message.embeds.map(embed => `\n\n${embed.url || embed.description}`);
                    forwardedContent += `\n\n**Embeds:**${embeds.join('\n')}`;
                }

                await modMailChannel.send(forwardedContent);
                console.log(`Forwarded modmail message from ${message.author.tag} to modmail channel.`);
            } else {
                console.error('Modmail channel not found.');
            }
            await message.react('✅'); // React with ✅ (Unicode representation)
        }
    },
};
