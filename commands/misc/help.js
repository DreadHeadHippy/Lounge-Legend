const { prefix } = require("./../../config.json");

module.exports = {
    name: "help",
    description: "List all commands of bot or info about a specific command.",
    aliases: ["commands"],
    usage: "[command name]",
    cooldown: 5,

    execute(message, args) {
        const { commands } = message.client;

        if (!args.length) {
            const commandList = commands.map((command) => `\`${command.name}\``).join(", ");
            const helpMessage = `List of all my commands: ${commandList}\n\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`;

            return message.channel.send(helpMessage);
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply({ content: "That's not a valid command!" });
        }

        const commandInfo = [
            `**Name:** ${command.name}`,
            `**Description:** ${command.description || "No description provided."}`,
            `**Aliases:** ${command.aliases ? command.aliases.join(", ") : "None"}`,
            `**Cooldown:** ${command.cooldown || 3} second(s)`,
            `**Usage:** ${prefix}${command.name} ${command.usage || ""}`,
        ].join("\n");

        message.channel.send(`Command Help for ${command.name}:\n${commandInfo}`);
    },
};