const { Events } = require("discord.js");

// Create a variable to store the user who initiated the bump
let bumpInitiator = null;

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Check if the message is from the DISBOARD bot and contains at least one embed
        if (
            message.author.id === '302050872383242240' && // DISBOARD bot ID
            message.embeds.length > 0
        ) {
            // Check if the user who initiated the bump has been stored
            if (bumpInitiator) {
                // Send a thank-you message to the user who initiated the bump and set a reminder
                await message.channel.send(`Thanks for the /bump <@${bumpInitiator}>! I will remind you in 2 hours to /bump again.`);

                // Set a timeout to remind the user to bump after 2 hours
                setTimeout(() => {
                    message.channel.send(`<@${bumpInitiator}>, don't forget to /bump the server!`);
                }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

                // Reset the bumpInitiator variable
                bumpInitiator = null;
            }
        }

        // Check if the message is the /bump command
        if (message.content.toLowerCase() === '/bump') {
            // Store the user who initiated the bump
            bumpInitiator = message.author.id;
        }
    },
};
