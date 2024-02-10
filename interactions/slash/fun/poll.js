const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The poll question')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('options')
                .setDescription('The poll options, separated by commas')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('The duration of the poll in days')
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(BigInt(0x00000004))) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const question = interaction.options.getString('question');
        const options = interaction.options.getString('options').split(',');
        const duration = interaction.options.getInteger('duration');

        if (options.length > 10) {
            return interaction.reply({ content: 'You can only have up to 10 options.', ephemeral: true });
        }

        const pollEmbed = {
            color: 0x3498db,
            title: question,
            description: options.map((option, index) => `${index + 1}. ${option}`).join('\n'),
            footer: { text: 'React with the corresponding emoji to vote | Poll ends in: ' }
        };

        const pollMessage = await interaction.channel.send({ embeds: [pollEmbed] });

        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(String(i + 1) + '\u20E3'); // Adds reaction numbers 1️⃣, 2️⃣, etc.
        }

        if (duration) {
            const endTime = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

            const updateInterval = 1000; // Update every second
            const updateMessage = async () => {
                const timeRemaining = endTime - Date.now();

                if (timeRemaining > 0) {
                    const daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
                    const hoursRemaining = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                    const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
                    const secondsRemaining = Math.floor((timeRemaining % (60 * 1000)) / 1000);

                    pollEmbed.footer.text = `React with the corresponding emoji to vote | Poll ends in: ${daysRemaining}d ${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s`;
                    await pollMessage.edit({ embeds: [pollEmbed] });
                    setTimeout(updateMessage, updateInterval);
                } else {
                    pollEmbed.footer.text = 'Voting for this poll has ended.';
                    await pollMessage.edit({ embeds: [pollEmbed] });
                    const voteCounts = await getVoteCounts(pollMessage, options);
                    await postResults(interaction.channel, options, voteCounts);
                    await pollMessage.reactions.removeAll(); // Remove all reactions to prevent further voting
                }
            };

            updateMessage();
        } else {
            await postResults(interaction.channel, options);
        }

        await interaction.reply('Poll created!');
    },
};

// Function to get vote counts for each option
async function getVoteCounts(pollMessage, options) {
    const voteCounts = new Array(options.length).fill(0); // Initialize vote counts array

    const reactions = await pollMessage.reactions.cache;
    for (const reaction of reactions.values()) {
        const users = await reaction.users.fetch();
        users.forEach((user) => {
            if (!user.bot) {
                const emoji = reaction.emoji.name;
                const index = options.findIndex((option, index) => emoji === String(index + 1) + '\u20E3');
                if (index !== -1) {
                    voteCounts[index]++;
                }
            }
        });
    }

    return voteCounts;
}

// Function to post results
async function postResults(channel, options, voteCounts = []) {
    const resultsEmbed = {
        color: 0x2ecc71,
        title: 'Poll Results',
        description: options.map((option, index) => `${option}: ${voteCounts[index] || 0} votes`).join('\n')
    };
    await channel.send({ embeds: [resultsEmbed] });
}
