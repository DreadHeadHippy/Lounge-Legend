module.exports = {
    name: "ping",
    // Refer to typings.d.ts for available properties.

    execute(message, args) {
        const pingEmbed = {
            color: 0x3498db, // Use the integer value for the color
            title: "Ping",
            description: "Calculating ping...",
        };

        message.channel.send({ embeds: [pingEmbed] }).then(sentMessage => {
            const ping = sentMessage.createdTimestamp - message.createdTimestamp;
            pingEmbed.description = `Bot latency: ${ping}ms | API latency: ${message.client.ws.ping}ms`;
            sentMessage.edit({ embeds: [pingEmbed] });
        });
    },
};
