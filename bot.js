// Declare constants which will be used throughout the bot.

const fs = require("fs");
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  REST,
  Routes
} = require("discord.js");
const { client_id, test_guild_id } = require("./config.json");
const token = process.env['token'];
const guildMemberRemove = require('./events/guildMemberRemove');
const reactionRoles = require('./reactionRoles.json');

// Define cache for reaction messages
const reactionMessageCache = new Map();

// Function to cache reaction messages from a specific channel
const cacheReactionMessages = async () => {
    // Get the guild where the channel is located
    const guild = client.guilds.cache.get('750491328688947212');
    if (!guild) {
        console.error(`Guild not found`);
        return;
    }

    // Get the channel by its ID
const channel = guild.channels.cache.get('1213245206804299818');
if (!channel) {
    console.error(`Channel not found`);
    return;
}
  
    // Fetch the messages in the channel
    try {
        const messages = await channel.messages.fetch({ limit: 100 });

        // Cache the reaction messages
        messages.filter(message => message.reactions.cache.size > 0)
            .forEach(message => {
                // Cache the message in the reactionMessageCache map
                reactionMessageCache.set(message.id, message);
            });
    } catch (error) {
        console.error(`Error fetching messages in channel: ${error}`);
    }
};

/**
 * From v13, specifying the intents is compulsory.
 * @type {import('./typings').Client}
 * @description Main Application Client */

// @ts-ignore
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Channel],
});

/**********************************************************************/
// Below we will be making an event handler!

/**
 * @description All event files of the event handler.
 * @type {String[]}
 */

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

// Loop through all files and execute the event when it is actually emitted.
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(
      event.name,
      async (...args) => await event.execute(...args, client)
    );
  }
}

/**********************************************************************/
// Define Collection of Commands, Slash Commands and cooldowns

client.commands = new Collection();
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.modalCommands = new Collection();
client.cooldowns = new Collection();
client.autocompleteInteractions = new Collection();
client.triggers = new Collection();

/**********************************************************************/
// Registration of Message-Based Legacy Commands.

/**
 * @type {String[]}
 * @description All command categories aka folders.
 */

const commandFolders = fs.readdirSync("./commands");

// Loop through all files and store commands in commands collection.

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

/**********************************************************************/
// Registration of Slash-Command Interactions.

/**
 * @type {String[]}
 * @description All slash commands.
 */
const slashCommands = fs.readdirSync("./interactions/slash");
const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    // Loop through all files and store slash-commands in slashCommands collection.

for (const module of slashCommands) {
  const commandFiles = fs
    .readdirSync(`./interactions/slash/${module}`)
    .filter((file) => file.endsWith(".js"));

  for (const commandFile of commandFiles) {
    const command = require(`./interactions/slash/${module}/${commandFile}`);

    // Check if the command has a valid 'data' property with a 'name' field
    if (command.data && command.data.name) {
      client.slashCommands.set(command.data.name, command);
    } else {
      console.error(`Invalid command found in ${module}/${commandFile}`);
    }
  }
}
    /**********************************************************************/
    // Registration of Autocomplete Interactions.

    /**
     * @type {String[]}
     * @description All autocomplete interactions.
     */

    const autocompleteInteractions = fs.readdirSync("./interactions/autocomplete");

    // Loop through all files and store autocomplete interactions in autocompleteInteractions collection.

    for (const module of autocompleteInteractions) {
      const files = fs
        .readdirSync(`./interactions/autocomplete/${module}`)
        .filter((file) => file.endsWith(".js"));

      for (const interactionFile of files) {
        const interaction = require(`./interactions/autocomplete/${module}/${interactionFile}`);
        client.autocompleteInteractions.set(interaction.name, interaction);
      }
    }

    /**********************************************************************/
    // Registration of Context-Menu Interactions

    /**
     * @type {String[]}
     * @description All Context Menu commands.
     */

    const contextMenus = fs.readdirSync("./interactions/context-menus");

    // Loop through all files and store context-menus in contextMenus collection.

    for (const folder of contextMenus) {
      const files = fs
        .readdirSync(`./interactions/context-menus/${folder}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of files) {
        const menu = require(`./interactions/context-menus/${folder}/${file}`);
        const keyName = `${folder.toUpperCase()} ${menu.data.name}`;
        client.contextCommands.set(keyName, menu);
      }
    }

    /**********************************************************************/
    // Registration of Button-Command Interactions.

    /**
     * @type {String[]}
     * @description All button commands.
     */

    const buttonCommands = fs.readdirSync("./interactions/buttons");

    // Loop through all files and store button-commands in buttonCommands collection.

    for (const module of buttonCommands) {
      const commandFiles = fs
        .readdirSync(`./interactions/buttons/${module}`)
        .filter((file) => file.endsWith(".js"));

      for (const commandFile of commandFiles) {
        const command = require(`./interactions/buttons/${module}/${commandFile}`);
        client.buttonCommands.set(command.id, command);
      }
    }

    /**********************************************************************/
    // Registration of Modal-Command Interactions.

    /**
     * @type {String[]}
     * @description All modal commands.
     */

    const modalCommands = fs.readdirSync("./interactions/modals");

    // Loop through all files and store modal-commands in modalCommands collection.

    for (const module of modalCommands) {
      const commandFiles = fs
        .readdirSync(`./interactions/modals/${module}`)
        .filter((file) => file.endsWith(".js"));

      for (const commandFile of commandFiles) {
        const command = require(`./interactions/modals/${module}/${commandFile}`);
        client.modalCommands.set(command.id, command);
      }
    }

    /**********************************************************************/
    // Registration of select-menus Interactions

    /**
     * @type {String[]}
     * @description All Select Menu commands.
     */

    const selectMenus = fs.readdirSync("./interactions/select-menus");

    // Loop through all files and store select-menus in selectMenus collection.

    for (const module of selectMenus) {
      const commandFiles = fs
        .readdirSync(`./interactions/select-menus/${module}`)
        .filter((file) => file.endsWith(".js"));
      for (const commandFile of commandFiles) {
        const command = require(`./interactions/select-menus/${module}/${commandFile}`);
        client.selectCommands.set(command.id, command);
      }
    }

    /**********************************************************************/
    // Registration of Slash-Commands in Discord API

    const commandJsonData = [
      ...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
      ...Array.from(client.contextCommands.values()).map((c) => c.data),
    ];
  
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      			/**
			 * By default, you will be using guild commands during development.
			 * Once you are done and ready to use global commands (which have 1 hour cache time),
			 * 1. Please uncomment the below (commented) line to deploy global commands.
			 * 2. Please comment the below (uncommented) line (for guild commands).
			 */

			 
          Routes.applicationGuildCommands(client_id, test_guild_id),

			/**
			 * Good advice for global commands, you need to execute them only once to update
			 * your commands to the Discord API. Please comment it again after running the bot once
			 * to ensure they don't get re-deployed on the next restart.
			 */

			   //Routes.applicationCommands(client_id),

			{ body: commandJsonData }
		);

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

/**********************************************************************/
// Registration of Message Based Chat Triggers

/**
 * @type {String[]}
 * @description All trigger categories aka folders.
 */

const triggerFolders = fs.readdirSync("./triggers");

// Loop through all files and store triggers in triggers collection.

for (const folder of triggerFolders) {
  const triggerFiles = fs
    .readdirSync(`./triggers/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of triggerFiles) {
    const trigger = require(`./triggers/${folder}/${file}`);
    client.triggers.set(trigger.name, trigger);
  }
}

// Use the guildMemberRemove event
client.on('guildMemberRemove', guildMemberRemove);

// Listen for the 'messageReactionAdd' event
client.on('messageReactionAdd', async (reaction, user) => {
  // Check if the reaction is added to a message in a guild
  if (!reaction.message.guild) return;

  // Check if the reacted emoji is mapped to a role in the configuration
  const roleId = reactionRoles[reaction.emoji.name];
  if (!roleId) return;

  // Get the role object corresponding to the roleId
  const role = reaction.message.guild.roles.cache.get(roleId);
  if (!role) {
    console.error(`Role with ID ${roleId} not found.`);
    return;
  }

  // Get the member who reacted
  const member = reaction.message.guild.members.cache.get(user.id);
  if (!member) {
    console.error(`Member with ID ${user.id} not found.`);
    return;
  }

  // Assign the role to the member
  try {
    await member.roles.add(role);
    console.log(`Role ${role.name} added to ${member.user.tag}`);
  } catch (error) {
    console.error(`Error assigning role ${role.name} to ${member.user.tag}: ${error}`);
  }
});

// Listen for the 'messageReactionRemove' event
client.on('messageReactionRemove', async (reaction, user) => {
  // Check if the reaction is removed from a message in a guild
  if (!reaction.message.guild) return;

  // Check if the reacted emoji is mapped to a role in the configuration
  const roleId = reactionRoles[reaction.emoji.name];
  if (!roleId) return;

  // Get the role object corresponding to the roleId
  const role = reaction.message.guild.roles.cache.get(roleId);
  if (!role) {
    console.error(`Role with ID ${roleId} not found.`);
    return;
  }

  // Get the member who removed the reaction
  const member = reaction.message.guild.members.cache.get(user.id);
  if (!member) {
    console.error(`Member with ID ${user.id} not found.`);
    return;
  }

  // Remove the role from the member
  try {
    await member.roles.remove(role);
    console.log(`Role ${role.name} removed from ${member.user.tag}`);
  } catch (error) {
    console.error(`Error removing role ${role.name} from ${member.user.tag}: ${error}`);
  }
});

  // Listen for the 'ready' event
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Cache reaction messages when the bot starts up
    cacheReactionMessages();

    // Set the bot's profile picture
        const gifFilePath = 'Bot pfp/Lounge Legend.gif'; // Replace with the actual path to your GIF file
        const gifData = fs.readFileSync(gifFilePath);
        client.user.setAvatar(gifData)
            .then(() => console.log('Profile picture updated successfully!'))
            .catch(console.error);
    });

    // Rest of your existing code (Express server setup)
    const express = require('express')
    const app = express();
    const port = 3000;
    app.get('/', (req, res) => {
      res.send('Lounge Legend is online!')
    })
    app.listen(port, () => {
      console.log(`Lounge Legend is now deployed!`)
    });

  // Login into your client application with bot's token.
  client.login(token);
