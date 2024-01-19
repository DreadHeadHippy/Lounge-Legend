// Bot Mention Command
 

const { prefix } = require("../config.json");

module.exports = {
	// Executes when the bot is pinged.

	async execute(message) {
		return message.channel.send(
			`Hi ${message.author}! My prefix is \`${prefix}\`, get help by \`${prefix}help\` OR /help`
		);
	},
};
