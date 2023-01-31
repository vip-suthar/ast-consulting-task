const { Telegraf } = require('telegraf')
const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN);

// Function to get temperature in Delhi
async function getTemperature() {
    try {
        const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${OPEN_WEATHER_API_KEY}`);
        return response.data.main.temp;
    } catch (error) {
        console.error(error);
    }
}

// start command
bot.command('start', ctx => {
    ctx.replyWithHTML(`<b>Hello! I am ${ctx.me}, a bot.</b>\nI can send you temperature updates for delhi every hour.\nTo subscribe you can type /subscribe and send and to stop receiving messages type /unsubscribe and send.\nIf you send any other messages, i'll simply revert those messages.`)
})

const subscribers = [];
const intervalIds = [];
// subscribe command
bot.command('subscribe', (ctx) => {
    const chatId = ctx.chat.id;

    if (!subscribers.includes(chatId)) {

        subscribers.push(chatId);

        const sendMessage = async () => {
            const temperature = await getTemperature();
            bot.telegram.sendMessage(chatId, `The temperature in Delhi is ${(temperature - 273.16).toFixed(2)}°C.`);
        }

        setTimeout(sendMessage, 1000); // one message just after subscribing
        intervalIds.push(setInterval(sendMessage, 60 * 60 * 1000)) // after subscription, one message every hour

        ctx.reply("You have successfully subscribed.");
    } else {
        ctx.reply("You are already subscribed.");
    }
});

// unsubscribe command
bot.command('unsubscribe', (ctx) => {
    const chatId = ctx.chat.id;

    if (subscribers.includes(chatId)) {
        subscribers = subscribers.filter((id, i) => {
            if (id === chatId) {
                clearInterval(intervalIds[i]);
                intervalIds.splice(i, 1);
                return false;
            }
            return true;
        });

        ctx.reply("You have successfully unsubscribed.");
    } else {
        ctx.reply("You are not subscribed yet.");
    }
});

// handling all other messages from subscriber
bot.on('message', (ctx) => {
    const chatId = ctx.chat.id;

    if (subscribers.includes(chatId)) {
        ctx.reply(ctx.message.text);
    } else {
        ctx.reply("You are not subscribed yet. Please type `/subscribe` to subscribe.");
    }
});

bot.launch();
