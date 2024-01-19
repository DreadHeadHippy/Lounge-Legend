// Error Message On Error Modal Interaction
 

module.exports = {
	// Executes when the modal interaction could not be fetched.

	async execute(interaction) {
		await interaction.reply({
			content: "There was an issue while fetching this modal!",
			ephemeral: true,
		});
		return;
	},
};
