const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "approve",

	async execute(interaction) {
		if (!interaction.member.roles.cache.has(adminRoleId)) {
			return interaction.reply({
				content: "You do not have permission to use this button.",
				ephemeral: true,
			});
		}

		// Update embed to reflect approval
		const embed = EmbedBuilder.from(interaction.message.embeds[0])
			.setColor("Green")
			.addFields({ name: "Status", value: "Approved ✅" });

		await interaction.update({ embeds: [embed], components: [] });
	},
};