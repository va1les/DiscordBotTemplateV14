const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders')
module.exports = {
    slash: new SlashCommandBuilder()
        .setName('shards')
        .setDescription("Information about shards"),
    async execute(client, interaction) {

        let currentPage = 0;
        pages = []
        interaction.client.shard.broadcastEval(client => [client.shard.ids, client.ws.ping, client.readyAt / 1000, client.guilds.cache.size, client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0), client.channels.cache.size, process.memoryUsage().heapUsed])
            .then(async (results) => {
                results.map((data) => {
                    const embed = new EmbedBuilder()
                        .setTitle(`List of bot shards (Total ${interaction.client.shard.count} shards)`)
                        .setColor(client.colors.default)
                    embed.addFields({
                        name: `<a:good:974932953408880641> | Shard #${Number(data[0]) + 1}\n`,
                        value: `**Ping:** ${data[1]}\n**Uptime:** <t:${(data[2]).toFixed(0)}:R>\n**Servers:** ${data[3]}\n**Users: **${data[4]}**\nChannels:** ${data[5]}\n**RAM:** ${formatBytes(process.memoryUsage(data[6]).rss)}\n`,
                        inline: true
                    })
                    pages.push(embed)
                })
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('page_previous')
                            .setEmoji('⏪')
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId('page_next')
                            .setEmoji('⏩')
                            .setStyle(ButtonStyle.Secondary)
                    );
                interaction.reply({ embeds: [pages[currentPage]], components: [row] })

                const msg = await interaction.fetchReply();

                const collector = msg.createMessageComponentCollector();
                setTimeout(() => { msg.edit({ components: [] }) }, 60 * 1000)
                collector.on('collect', async x => {
                    if (x.user.id == interaction.user.id) return x.followUp({ content: `> ${client.emoji.error} You are not allowed to use buttons.`, ephemeral: true });
                    x.deferUpdate();
                    if (x.customId == "page_previous") {
                        if (currentPage - 1 < 0) {
                            currentPage = pages.length - 1
                        } else {
                            currentPage -= 1;
                        }
                    } else if (x.customId == "page_next") {
                        if (currentPage + 1 == pages.length) {
                            currentPage = 0;
                        } else {
                            currentPage += 1;
                        }
                    }
                    if (x.customId == "page_previous" || x.customId == "page_next") {
                        msg.edit({ embeds: [pages[currentPage].setFooter({ text: `${currentPage + 1}/${pages.length}` })], components: [row] });
                    }
                })

                function formatBytes(a, b) {
                    if (0 == a) return "0 Bytes"
                    let c = 1024;
                    let d = b || 2;
                    let e = ["Б", "КБ", "МБ", "ГБ", "ТБ", "ПБ", "ЕБ", "ЗБ", "УБ"]
                    let f = Math.floor(Math.log(a) / Math.log(c));
                    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
                };
            });
    }
}