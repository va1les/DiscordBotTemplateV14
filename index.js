require("dotenv").config();
require("colors");
console.log("The system is running!".yellow.bold)
const { ShardingManager, WebhookClient } = require("discord.js");
const manager = new ShardingManager('./src/bot.js', {
    token: process.env.token,
    totalShards: "auto",
})

const webhook = new WebhookClient({ url: `https://discord.com/api/webhooks/1024640672717869088/11CPHkgki1y_0ZV6Te-RFKZu9tWYWQbGo1uLAVckqvBKwpV9F8JuP-TLhdplPlxOIX-2` })

manager.on("shardCreate", (shard) => {
    console.log(`[SHARD #${shard.id}]: `.green.bold + `Launched shard `.blue.bold + `${shard.id}`.yellow.bold);
    webhook.send({embeds: ``})
});

manager.spawn();