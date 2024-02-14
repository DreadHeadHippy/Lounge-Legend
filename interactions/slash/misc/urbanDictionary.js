const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Lookup a word on Urban Dictionary')
        .addStringOption(option =>
            option.setName('term')
                .setDescription('The term you want to look up')
                .setRequired(true)),
    async execute(interaction) {
        const term = interaction.options.getString('term');

        try {
            const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${term}`);
            const data = response.data;

            if (data.list.length > 0) {
                const definition = data.list[0].definition;
                await interaction.reply({ content: `Definition of "${term}": ${definition}` });
            } else {
                await interaction.reply({ content: `No definition found for "${term}".` });
            }
        } catch (error) {
            console.error('Error fetching definition:', error);
            await interaction.reply({ content: 'An error occurred while fetching the definition.' });
        }
    },
};
