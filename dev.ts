import { bot } from "./bot.ts";

bot.catch(async (error) => {
  await error.ctx.reply(error.message);
  console.log(error.message);
});

console.log("Bot is started using Long Poll.");
await bot.start();
