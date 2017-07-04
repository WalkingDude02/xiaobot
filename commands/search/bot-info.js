const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { dbotsKey } = require('../../config');

module.exports = class BotSearchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bot-info',
            group: 'search',
            memberName: 'bot-info',
            description: 'Searches Discord Bots for info on a bot.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'bot',
                    prompt: 'Which bot do you want to get information for?',
                    type: 'user'
                }
            ]
        });
    }

    async run(msg, args) {
        const { bot } = args;
        try {
            const { body } = await snekfetch
                .get(`https://bots.discord.pw/api/bots/${bot.id}`)
                .set({ Authorization: dbotsKey });
            const embed = new MessageEmbed()
                .setColor(0x9797FF)
                .setAuthor('Discord Bots', 'https://i.imgur.com/lrKYBQi.jpg')
                .setTitle(body.name)
                .setURL(`https://bots.discord.pw/bots/${bot.id}`)
                .setDescription(body.description)
                .addField('❯ Library',
                    body.library, true)
                .addField('❯ Invite',
                    `[Here](${body.invite_url})`, true)
                .addField('❯ Prefix',
                    body.prefix, true);
            return msg.embed(embed);
        } catch (err) {
            if (err.message === '404 Not Found') return msg.say('Bot Not Found.');
            else throw err;
        }
    }
};
