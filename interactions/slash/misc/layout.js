const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("layout")
        .setDescription("Display server layout"),

    async execute(interaction) {
        const welcomeChannels = [
            '[#reception](https://discord.com/channels/750491328688947212/1185357802126966854): The channel you arrived in when you joined this server. This is also where you [__***invite your friends***__](https://discord.com/channels/750491328688947212/1185357802126966854).',
          '[#rules](https://discord.com/channels/750491328688947212/1203606716260950097): The ~~rules~~ __laws__ \'round these parts.',
          '[#roles](https://discord.com/channels/750491328688947212/1213245206804299818): Go get you some roles here.',
        ];

        const infoDeskChannels = [
            '[#rocket-league](https://discord.com/channels/750491328688947212/1185503276993613935): Lets you check your MMR/RANK in Rocket League',
            '[#free-games](https://discord.com/channels/750491328688947212/1186846523334598707): Updates us with free games (may or may not be any good)',
          '[#polls](https://discord.com/channels/750491328688947212/1205967960661827639): Polls are held in here. If your vote is required you will be pinged.',
            '[#server-boosters](https://discord.com/channels/750491328688947212/1202764862569320488): These are the people that will be carried in Valhalla for boosting this server. We thank you!'
        ];

        const mainLobbyChannels = [
            '[#the-lounge](https://discord.com/channels/750491328688947212/1185303246059864114): The main hangout.',
              '[#screenshots-clips](https://discord.com/channels/750491328688947212/1351723109098590238): Share every sick gaming moment here.',
                '[#game-bot](https://discord.com/channels/750491328688947212/1197304121557012541): Play bot games in this channel.',
          '[#commands](https://discord.com/channels/750491328688947212/1210710468445081740): Keep bot commands in here.',
          '[#room-of-requirement](https://discord.com/channels/750491328688947212/1203608039307874304): If you require it, make a room for it!',
        ];

        const voiceChannels = [
          '[#Join To Create](https://discord.com/channels/750491328688947212/1197959997259256018): Upon joining, you will be moved to a personal VC **you** can control! *Click the chat bubble of your VC for controls*! Once a personal channel is empty, it will be **REMOVED** automatically. This feature allows for better COMS on busy days :)',
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
                    name: '**🎤 VOICE CHANNELS**',
                    value: voiceChannels.join('\n'),
                },
            ],
        };

        await interaction.reply({ embeds: [layoutEmbed],
                                ephemeral: true
                                });
    },
};