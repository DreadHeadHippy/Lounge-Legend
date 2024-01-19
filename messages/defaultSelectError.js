// Error Message On Error Select Menu Interaction

module.exports = {
	// Executes when the select menu interaction could not be fetched.

	async execute(interaction) {
		await interaction.reply({
			content: "There was an issue while fetching this select menu option!",
			ephemeral: true,
		});
		return;
	},
};
