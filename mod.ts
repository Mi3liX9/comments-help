import { webhookCallback } from "https://deno.land/x/grammy@v1.9.2/mod.ts";
import { serve } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { bot } from "./bot.ts";

console.log("Bot is started using Webhooks.");

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
