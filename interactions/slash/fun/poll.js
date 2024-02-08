// poll.js

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
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(BigInt(0x00000004))) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const question = interaction.options.getString('question');
        const options = interaction.options.getString('options').split(',');

        if (options.length > 10) {
            return interaction.reply({ content: 'You can only have up to 10 options.', ephemeral: true });
        }

        const pollEmbed = {
            color: 0x3498db,
            title: question,
            description: options.map((option, index) => `${index + 1}. ${option}`).join('\n'),
            footer: { text: 'React with the corresponding emoji to vote' }
        };

        const pollMessage = await interaction.channel.send({ embeds: [pollEmbed] });

        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(String(i + 1) + '\u20E3'); // Adds reaction numbers 1️⃣, 2️⃣, etc.
        }

        await interaction.reply('Poll created!');
    },
};
