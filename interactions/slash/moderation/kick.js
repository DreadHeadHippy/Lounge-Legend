const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to be kicked')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.guild) {
            return await interaction.reply('This command can only be used in a server.');
        }

      if (!interaction.member.permissions.has(BigInt(0x10000000))) {
        return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
      }

        if (!user) {
            return await interaction.reply('Please mention the user you want to kick.');
        }

        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply('That user is not in this server.');
        }

        try {
            await member.kick(reason);
            await interaction.reply(`Successfully kicked ${user.tag}. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error kicking that user.');
        }
    },
};
