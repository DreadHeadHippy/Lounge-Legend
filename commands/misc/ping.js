module.exports = {
    name: "ping",
    // Refer to typings.d.ts for available properties.

    execute(message, args) {
        const pingEmbed = {
            color: 0x3498db, // Use the integer value for the color
            title: "🏓Pong!",
            description: "Calculating pong...",
        };

        message.channel.send({ embeds: [pingEmbed] }).then(sentMessage => {
            const pong = sentMessage.createdTimestamp - message.createdTimestamp;
            pingEmbed.description = `Bot latency: ${pong}ms | API latency: ${message.client.ws.ping}ms`;
            sentMessage.edit({ embeds: [pingEmbed] });
        });
    },
};
