module.exports = (member) => {
  console.log(`User ${member.displayName} left the server.`);
  const farewellEmbed = {
    color: 0xff0000,
    title: `${member.displayName} left!`,
    description: 'Goodbye Traveler!',
    footer: {
      text: 'good luck in the aether!',
    },
    thumbnail: {
      url: member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }) || member.user.defaultAvatarURL,
    },
  };

  const farewellChannel = member.guild.channels.cache.find(channel => channel.name === 'farewell');
  console.log(`Farewell channel: ${farewellChannel}`);

  if (farewellChannel) {
    farewellChannel.send({ embeds: [farewellEmbed] });
  }
};
