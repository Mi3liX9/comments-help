import "https://deno.land/x/dotenv/load.ts";
import { webhookCallback } from "https://deno.land/x/grammy@v1.9.2/mod.ts";
import { serve } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { bot } from "./bot.ts";

const ENV = Deno.env.get("DENO_ENV");

function app() {
  if (ENV?.toLowerCase() === "production") {
    console.log("Bot is started using Webhooks.");
    return webhookApp();
  }
  console.log("Bot is started using Long Poll.");
  return startPolling();
}

app();

async function startPolling() {
  try {
    await bot.start();
  } catch (err) {
    console.error(err);
  } finally {
    bot.catch(async (error) => {
      await error.ctx.reply(error.message);
      console.log(error.message);
    });
  }
}

function webhookApp() {
  const handleUpdate = webhookCallback(bot, "std/http");

  serve({
    ["/" + Deno.env.get("BOT_TOKEN")]: async (req) => {
      if (req.method == "POST") {
        try {
          return await handleUpdate(req);
        } catch (err) {
          console.error(err);
        }
      }
      return new Response();
    },
    "/": () => {
      return new Response("Hello world!");
    },
  });
}
