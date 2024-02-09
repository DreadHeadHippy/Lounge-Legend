// events/modmail.js

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        const modMailChannelId = '1205411930307559484'; // Replace with your modmail channel ID

        // Filter out messages that are not in guilds (direct messages)
        if (!message.guild && !message.author.bot) {
            console.log(`Received modmail message from ${message.author.tag}: ${message.content}`);
            const modMailChannel = client.channels.cache.get(modMailChannelId);
            if (modMailChannel) {
                const forwardedContent = `**From:** ${message.author.tag} (${message.author.id})\n\n${message.content}`;
                await modMailChannel.send(forwardedContent);
                console.log(`Forwarded modmail message from ${message.author.tag} to modmail channel.`);
            } else {
                console.error('Modmail channel not found.');
            }
            console.log(`Reply sent to ${message.author.tag}: Your message has been forwarded to the moderators.`);
            await message.author.send('Your message has been forwarded to the moderators.');
        }
    },
};
