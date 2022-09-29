module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        require("../../handlers/commandHandler").init(client);
        require("../../mongo");
        setInterval(() => { client.user.setPresence({ status: `online`, activities: [{ name: `Spotify | ${new Date().toLocaleTimeString('ru', { timeZone: 'Europe/Moscow', timeStyle: 'short' })} МСК`, type: 2 }] }) }, 15 * 1000)
    }
}