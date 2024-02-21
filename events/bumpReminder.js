const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Check if the message is the /bump command
        if (message.content.toLowerCase() === '/bump') {
            // Send a thank-you message to the user who initiated the bump
            await message.channel.send(`Thanks for the /bump ${message.author}! I will remind you in 2 hours to /bump again.`);

            // Set a timeout to remind the user to bump after 2 hours
            setTimeout(() => {
                message.channel.send(`${message.author}, don't forget to /bump the server!`);
            }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
        }
    },
};
