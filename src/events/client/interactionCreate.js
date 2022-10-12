const { Collection } = require("discord.js");
const cooldowns = new Collection()
module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;
        if (!interaction.guild) return;

        const cmd = client.commands.get(interaction.commandName)
        if (!cmd) return;

        if (!await client.db.guild.findOne({ guildId: interaction.guild.id })) await client.db.guild.create({ guildId: interaction.guild.id })
        if (!await client.db.user.findOne({ guildId: interaction.guild.id, userId: interaction.user.id })) await client.db.user.create({ guildId: interaction.guild.id, userId: interaction.user.id })

        if (cmd.user_perm && cmd.user_perm.length > 0 && !interaction.member.permissions.has(cmd.user_perm)) {
            return text(`> ${client.emoji.error} You don\'t have permissions: \`${cmd.user_perm.join(", ")}\``, true);
        }
        if (cmd.bot_perm && cmd.bot_perm.length > 0 && !interaction.guild.members.me.permissions.has(cmd.bot_perm)) {
            return text(`> ${client.emoji.error} I don\'t have permissions: \`${cmd.bot_perm.join(", ")}\``, true);
        }

        if (!cooldowns.has(interaction.commandName)) {
            cooldowns.set(interaction.commandName, new Collection())
        }
        const now = Date.now();
        const timestamps = cooldowns.get(interaction.commandName);
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + (cmd.cooldown || 1) * 1000;;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply(`Wait **${timeLeft.toFixed(2)}s.** and use this command again.`, true);
            }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), (cmd.cooldown || 1) * 1000);
        console.log(`[LOGS]: `.green.bold + `[${interaction.commandName.toUpperCase()}]`.blue.bold + ` ${interaction.user.tag}`.yellow + ` used the command.`.grey)
        try { cmd.execute(client, interaction) } catch { interaction.reply({ content: `> ${client.emoji.danger} An error has occured`, ephemeral: true }) }
    }
}