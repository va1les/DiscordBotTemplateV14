const { Client, CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    slash: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Send a ping request"),
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true })
        interaction.editReply({ content: `Latency: ${Date.now() - interaction.createdTimestamp}ms\nUptime: <t:${Math.round(client.readyTimestamp / 1000)}:R>\nMemory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}Mb`, ephemeral: true })
    }
}