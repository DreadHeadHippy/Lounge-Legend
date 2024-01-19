const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8-ball a question and get a random answer')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Your mandatory message for the magic 8-ball')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Possible 8-ball answers
        const answers = [
            'Yes',
            'No',
            'Ask again later',
            'Cannot predict now',
            'Don\'t count on it',
            'My sources say yes',
            'Outlook not so good',
            'Maybe',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'My sources say no.',
            'Very doubtful.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Signs point to yes.',
            'Reply hazy, try again.',
            'It is certain.',
            'The answer is hiding inside you',
        ];

        // Get the mandatory user's message from the interaction options
        const userMessage = interaction.options.getString('message');

        // Generate a random index to pick a random answer
        const randomIndex = Math.floor(Math.random() * answers.length);
        const randomAnswer = answers[randomIndex];

        // Include the user's question in the response
        await interaction.reply(`You asked: "${userMessage}"\nMagic 8-ball says: ${randomAnswer}`);
    },
};
