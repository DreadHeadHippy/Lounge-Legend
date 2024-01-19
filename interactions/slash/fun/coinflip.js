// coinflip.js

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin and get heads or tails'),

    async execute(interaction) {
        // Generate a random number (0 or 1) for heads or tails
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

        await interaction.reply(`Coin landed on: ${result}`);
    },
};
