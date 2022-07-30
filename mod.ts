import { webhookCallback } from "https://deno.land/x/grammy@v1.9.2/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { bot } from "./bot.ts";

const token = Deno.env.get("BOT_TOKEN");
const handleUpdate = webhookCallback(bot, "oak");

const router = new Router();

router.post("/" + token, handleUpdate);

// router.post("/" + token, async (ctx) => {
//   try {
//     return await handleUpdate(ctx);
//   } catch (err) {
//     console.error(err);
//   }
//   return new Response();
// });

router.use(() => new Response("Hello world!"));

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("error", (e) => {
  console.error("ERROR: ", e.error);
});

app.addEventListener("listen", (e) => {
  console.log("Bot is started using Webhooks.");
});

await app.listen({ hostname: "localhost", port: 8080 });
