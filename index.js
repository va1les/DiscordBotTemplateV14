require("dotenv").config();
require("colors");
console.log("The system is running!".yellow.bold)
const { ShardingManager, WebhookClient } = require("discord.js");
const manager = new ShardingManager('./src/bot.js', {
    token: process.env.token,
    totalShards: "auto",
})

manager.on("shardCreate", (shard) => {
    console.log(`[SHARD #${shard.id}]: `.green.bold + `Launched shard `.blue.bold + `${shard.id}`.yellow.bold);
});

manager.spawn();