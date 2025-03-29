const { EmbedBuilder } = require("discord.js");

module.exports = {
  id: 'deny_suggestion',

  async execute(interaction) {
    if (!interaction.member.permissions.has("Administrator")) {
      return await interaction.reply({
        content: "You don't have permission to use this button.",
        ephemeral: true,
      });
    }

    const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  id: "deny_suggestion",

  async execute(interaction) {
    // Only allow admins to deny
    if (!interaction.member.permissions.has("Administrator")) {
      return await interaction.reply({
        content: "You don't have permission to use this button.",
        ephemeral: true,
      });
    }

    const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "deny",

	async execute(interaction) {
		if (!interaction.member.roles.cache.has(adminRoleId)) {
			return interaction.reply({
				content: "You do not have permission to use this button.",
				ephemeral: true,
			});
		}

		// Update embed to reflect denial
		const embed = EmbedBuilder.from(interaction.message.embeds[0])
			.setColor("Red")
			.addFields({ name: "Status", value: "Denied ❌" });

		await interaction.update({ embeds: [embed], components: [] });
	},
};
  },
};
  },
};