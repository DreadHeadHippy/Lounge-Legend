const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("layout")
        .setDescription("Display server layout"),

    async execute(interaction) {
        const welcomeChannels = [`[#reception](https://discord.com/channels/750491328688947212/1185357802126966854): The channel you arrive at when you first join the server.`];

        const infoDeskChannels = [
            '[arena-announcements](https://discord.com/channels/750491328688947212/1197301890682208276): Announcements from EFT:Arena',
            '[#thefinals-announcements](https://discord.com/channels/750491328688947212/1184253032687489025): Announcements from THE FINALS',
            '[#thefinals-patchnotes](https://discord.com/channels/750491328688947212/1184649435288981554): Patch notes from THE FINALS',
            '[#rocket-league](https://discord.com/channels/750491328688947212/1185503276993613935): Lets you check your MMR/RANK in Rocket League',
            '[#free-games](https://discord.com/channels/750491328688947212/1186846523334598707): Updates us with free games (may or may not be any good)',
        ];

        const mainLobbyChannels = [
            '[#the-lounge](https://discord.com/channels/750491328688947212/1185303246059864114): A place to chill, chat, share clips and highlights, etc.',
            '[#cards-against-humanity](https://discord.com/channels/750491328688947212/1197304121557012541): Lets you play "Cards Against Humanity" with other server members. (Type /help for help)',
        ];

        const voiceChannels = [
            '[#Join To Create](https://discord.com/channels/750491328688947212/1184315337118847086): Upon joining you will be moved to your personal VC and be given a text channel only YOU can see. That text channel allows you commands to control your VC. Once a VC is completely empty it will remove itself. This feature allows for better COMS on busy days :)',
        ];

        const randomColor = Math.floor(Math.random() * 16777215);

        const layoutEmbed = {
            color: randomColor,
            title: "Server Layout",
            fields: [
                {
                    name: '**👋 WELCOME**',
                    value: welcomeChannels.join('\n'),
                },
                {
                    name: '**📖 INFO DESK**',
                    value: infoDeskChannels.join('\n'),
                },
                {
                    name: '**😎 MAIN LOBBY**',
                    value: mainLobbyChannels.join('\n'),
                },
                {
                    name: '**📩 SERVER INVITATION**',
                    value: '[#invite-your-friends](https://discord.com/channels/750491328688947212/1184398185175719996): Invite your friends to this server',
                },
                {
                    name: '**🎤 VOICE CHANNELS**',
                    value: voiceChannels.join('\n'),
                },
            ],
        };

        await interaction.reply({ embeds: [layoutEmbed] });
    },
};
