const { Events } = require("discord.js");

module.exports = {
	name: Events.InteractionCreate,

	// Executes when an interaction is created and handles it.

	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is an autocomplete interaction (to prevent weird bugs)

		if (!interaction.isAutocomplete()) return;

		// Checks if the request is available in our code.

		const request = client.autocompleteInteractions.get(
			interaction.commandName
		);

		// If the interaction is not a request in cache return.

		if (!request) return;

		// An attempt to execute the interaction.

		try {
			await request.execute(interaction);
		} catch (err) {
			console.error(err);
			return Promise.reject(err);
		}
	},
};
